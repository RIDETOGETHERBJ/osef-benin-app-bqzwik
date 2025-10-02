
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import Button from '../components/Button';
import { colors, spacing, typography } from '../styles/commonStyles';
import { useAuthStore } from '../store/userStore';

export default function EmailConfirmedScreen() {
  const colorScheme = useColorScheme();
  const themeColors = colors[colorScheme || 'light'];
  const { checkAuthState } = useAuthStore();

  useEffect(() => {
    // Check auth state when component mounts
    checkAuthState();
  }, []);

  const handleContinue = () => {
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: themeColors.success }]}>
          <IconSymbol name="check-circle" size={64} color="#FFFFFF" />
        </View>
        
        <Text style={[styles.title, { color: themeColors.text }]}>
          Email confirmé !
        </Text>
        
        <Text style={[styles.description, { color: themeColors.textSecondary }]}>
          Votre adresse email a été confirmée avec succès. Vous pouvez maintenant accéder à toutes les fonctionnalités de OSEF BENIN.
        </Text>
        
        <Button
          title="Continuer"
          onPress={handleContinue}
          style={styles.continueButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h1,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  description: {
    ...typography.body,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xxl,
  },
  continueButton: {
    width: '100%',
  },
});
