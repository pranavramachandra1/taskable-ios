import { useState, useEffect, useCallback } from 'react';
import { authService, User, AuthTokens } from '../services/auth';

interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: User | null;
  error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    isLoading: true,
    isAuthenticated: false,
    user: null,
    error: null,
  });

  // Check authentication status on hook initialization
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const isAuthenticated = await authService.isAuthenticated();
      if (isAuthenticated) {
        const user = await authService.getCurrentUser();
        setState({
          isLoading: false,
          isAuthenticated: true,
          user,
          error: null,
        });
      } else {
        setState({
          isLoading: false,
          isAuthenticated: false,
          user: null,
          error: null,
        });
      }
    } catch (error) {
      setState({
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: error instanceof Error ? error.message : 'Authentication check failed',
      });
    }
  }, []);

  const signIn = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const result = await authService.signInWithGoogle();
      
      if (result) {
        setState({
          isLoading: false,
          isAuthenticated: true,
          user: result.user,
          error: null,
        });
        return result;
      } else {
        // User cancelled or other non-error case
        setState(prev => ({ ...prev, isLoading: false }));
        return null;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign-in failed';
      setState({
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: errorMessage,
      });
      throw error;
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      await authService.signOut();
      
      setState({
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: null,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign-out failed';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, []);

  const getAccessToken = useCallback(async () => {
    return await authService.getAccessToken();
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    signIn,
    signOut,
    getAccessToken,
    clearError,
    refreshAuthStatus: checkAuthStatus,
  };
}

export type UseAuthReturn = ReturnType<typeof useAuth>;