import * as SecureStore from 'expo-secure-store';
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin';
import { Alert } from 'react-native';

const TOKEN_KEY = 'user_token';
const USER_DATA_KEY = 'user_data';
const API_BASE_URL = 'http://0.0.0.0:8080';

export interface User {
  user_id: string;
  username: string;
  email: string;
  phone_number: string;
  first_name: string;
  last_name: string;
  created_at: string;
  last_updated_at: string;
}

export interface AuthTokens {
  access_token: string;
  token_type: string;
}

class AuthService {
  private isConfigured = false;

  async configure() {
    if (this.isConfigured) return;
    
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID, // Will need to be added to .env
      iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID, // Will need to be added to .env
      offlineAccess: true,
      hostedDomain: '',
      forceCodeForRefreshToken: true,
    });
    
    this.isConfigured = true;
  }

  // Secure token storage
  async storeTokens(tokens: AuthTokens): Promise<void> {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, JSON.stringify(tokens));
    } catch (error) {
      console.error('Error storing tokens:', error);
      throw new Error('Failed to store authentication tokens');
    }
  }

  async getTokens(): Promise<AuthTokens | null> {
    try {
      const tokens = await SecureStore.getItemAsync(TOKEN_KEY);
      return tokens ? JSON.parse(tokens) : null;
    } catch (error) {
      console.error('Error retrieving tokens:', error);
      return null;
    }
  }

  async removeTokens(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_DATA_KEY);
    } catch (error) {
      console.error('Error removing tokens:', error);
    }
  }

  // User data storage
  async storeUserData(user: User): Promise<void> {
    try {
      await SecureStore.setItemAsync(USER_DATA_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error storing user data:', error);
      throw new Error('Failed to store user data');
    }
  }

  async getUserData(): Promise<User | null> {
    try {
      const userData = await SecureStore.getItemAsync(USER_DATA_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error retrieving user data:', error);
      return null;
    }
  }

  // Google Sign-In flow
  async signInWithGoogle(): Promise<{ tokens: AuthTokens; user: User } | null> {
    try {
      await this.configure();
      
      // Check if device supports Google Play services
      await GoogleSignin.hasPlayServices();
      
      // Get user info from Google
      const userInfo = await GoogleSignin.signIn();
      
      if (!userInfo.data?.idToken) {
        throw new Error('No ID token received from Google');
      }

      // Authenticate with our backend
      const response = await fetch(`${API_BASE_URL}/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          google_token: userInfo.data.idToken,
        }),
      });

      if (!response.ok) {
        if (response.status === 404) {
          // User not found, need to create account
          const newUser = await this.createUserAccount(userInfo.data);
          const authResponse = await this.authenticateUser(userInfo.data.idToken);
          return { tokens: authResponse, user: newUser };
        }
        throw new Error(`Authentication failed: ${response.status}`);
      }

      const tokens: AuthTokens = await response.json();
      
      // Get user data from backend using Google ID
      const userData = await this.fetchUserByGoogleId(userInfo.data.user.id, tokens.access_token);
      
      // Store tokens and user data securely
      await this.storeTokens(tokens);
      await this.storeUserData(userData);
      
      return { tokens, user: userData };
      
    } catch (error: any) {
      console.error('Google Sign-In error:', error);
      
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // User cancelled the login flow
        return null;
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('Sign in in progress', 'Please wait...');
        return null;
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Error', 'Google Play services not available');
        return null;
      }
      
      Alert.alert('Sign-in Error', error.message || 'An unexpected error occurred');
      return null;
    }
  }

  async createUserAccount(googleUserInfo: any): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: googleUserInfo.user.email.split('@')[0], // Use email prefix as username
        email: googleUserInfo.user.email,
        password: 'google_oauth', // Placeholder for OAuth users
        phone_number: '', // Will be empty initially
        first_name: googleUserInfo.user.givenName || '',
        last_name: googleUserInfo.user.familyName || '',
        google_id: googleUserInfo.user.id,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create user account: ${response.status}`);
    }

    return await response.json();
  }

  async authenticateUser(googleToken: string): Promise<AuthTokens> {
    const response = await fetch(`${API_BASE_URL}/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        google_token: googleToken,
      }),
    });

    if (!response.ok) {
      throw new Error(`Authentication failed: ${response.status}`);
    }

    return await response.json();
  }

  async fetchUserByGoogleId(googleId: string, accessToken: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/google-id/${googleId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user data: ${response.status}`);
    }

    return await response.json();
  }

  // Sign out
  async signOut(): Promise<void> {
    try {
      await GoogleSignin.signOut();
      await this.removeTokens();
    } catch (error) {
      console.error('Sign-out error:', error);
      // Even if Google sign-out fails, remove local tokens
      await this.removeTokens();
    }
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    const tokens = await this.getTokens();
    return tokens !== null;
  }

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    return await this.getUserData();
  }

  // Get access token for API calls
  async getAccessToken(): Promise<string | null> {
    const tokens = await this.getTokens();
    return tokens?.access_token || null;
  }
}

export const authService = new AuthService();