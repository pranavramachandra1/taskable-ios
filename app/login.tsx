import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { router } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
import { ThemedView } from '../components/ThemedView';
import { ThemedText } from '../components/ThemedText';
import { useThemeColor } from '../hooks/useThemeColor';
import * as Haptics from 'expo-haptics';

export default function LoginScreen() {
  const { signIn, isLoading, error, clearError } = useAuth();
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  const handleGoogleSignIn = async () => {
    try {
      clearError();
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      const result = await signIn();
      
      if (result) {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Success);
        // Navigate to main app
        router.replace('/(tabs)');
      }
    } catch (error) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      Alert.alert(
        'Sign-in Failed',
        error instanceof Error ? error.message : 'An unexpected error occurred',
        [{ text: 'OK', onPress: clearError }]
      );
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <ThemedView style={styles.content}>
        {/* App Logo/Title */}
        <View style={styles.header}>
          <ThemedText style={styles.title}>Taskable</ThemedText>
          <ThemedText style={styles.subtitle}>
            Your personal task management companion
          </ThemedText>
        </View>

        {/* Features List */}
        <View style={styles.features}>
          <FeatureItem 
            icon="✓" 
            text="Create and organize your tasks"
            textColor={textColor}
          />
          <FeatureItem 
            icon="📋" 
            text="Manage multiple task lists"
            textColor={textColor}
          />
          <FeatureItem 
            icon="🔄" 
            text="Sync across all your devices"
            textColor={textColor}
          />
          <FeatureItem 
            icon="👥" 
            text="Share lists with friends and family"
            textColor={textColor}
          />
        </View>

        {/* Sign-in Section */}
        <View style={styles.signInContainer}>
          <ThemedText style={styles.signInTitle}>
            Sign in to get started
          </ThemedText>
          
          {error && (
            <View style={styles.errorContainer}>
              <ThemedText style={styles.errorText}>{error}</ThemedText>
            </View>
          )}

          <GoogleSigninButton
            style={styles.googleButton}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={handleGoogleSignIn}
            disabled={isLoading}
          />

          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={tintColor} />
              <ThemedText style={styles.loadingText}>Signing in...</ThemedText>
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <ThemedText style={styles.footerText}>
            By signing in, you agree to our Terms of Service and Privacy Policy
          </ThemedText>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}

interface FeatureItemProps {
  icon: string;
  text: string;
  textColor: string;
}

function FeatureItem({ icon, text, textColor }: FeatureItemProps) {
  return (
    <View style={styles.featureItem}>
      <Text style={styles.featureIcon}>{icon}</Text>
      <Text style={[styles.featureText, { color: textColor }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    opacity: 0.7,
    textAlign: 'center',
    lineHeight: 24,
  },
  features: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 8,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 16,
    width: 32,
    textAlign: 'center',
  },
  featureText: {
    fontSize: 16,
    flex: 1,
    lineHeight: 22,
  },
  signInContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  signInTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    width: '100%',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    textAlign: 'center',
  },
  googleButton: {
    width: 280,
    height: 48,
    marginBottom: 16,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    opacity: 0.7,
  },
  footer: {
    paddingTop: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(128, 128, 128, 0.3)',
  },
  footerText: {
    fontSize: 12,
    opacity: 0.6,
    textAlign: 'center',
    lineHeight: 16,
  },
});