
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  useColorScheme,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Header from '../../components/Header';
import { colors, spacing, typography, borderRadius } from '../../styles/commonStyles';
import { useAuthStore } from '../../store/userStore';

const ROLES = [
  { value: 'candidat', label: 'Candidat' },
  { value: 'entreprise', label: 'Entreprise' },
  { value: 'formateur', label: 'Formateur' },
];

const LOCATIONS = [
  'Cotonou',
  'Porto-Novo',
  'Parakou',
  'Abomey-Calavi',
  'Djougou',
  'Bohicon',
  'Kandi',
  'Ouidah',
  'Abomey',
  'Natitingou',
];

export default function ProfileEditScreen() {
  const [formData, setFormData] = useState({
    fullName: '',
    role: 'candidat' as 'candidat' | 'entreprise' | 'formateur',
    location: '',
    skills: '',
    phone: '',
    bio: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const colorScheme = useColorScheme();
  const themeColors = colors[colorScheme || 'light'];
  const { profile, updateProfile, isLoading } = useAuthStore();

  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.full_name || '',
        role: profile.role || 'candidat',
        location: profile.location || '',
        skills: profile.skills?.join(', ') || '',
        phone: profile.phone || '',
        bio: profile.bio || '',
      });
    }
  }, [profile]);

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Le nom complet est requis';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'La localisation est requise';
    }

    if (!formData.skills.trim()) {
      newErrors.skills = 'Les compétences sont requises';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    console.log('Updating profile with:', formData);
    const skillsArray = formData.skills
      .split(',')
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0);

    const result = await updateProfile({
      full_name: formData.fullName.trim(),
      role: formData.role,
      location: formData.location.trim(),
      skills: skillsArray,
      phone: formData.phone.trim(),
      bio: formData.bio.trim(),
    });

    if (result?.error) {
      Alert.alert('Erreur', result.error);
    } else {
      Alert.alert(
        'Profil mis à jour',
        'Votre profil a été mis à jour avec succès.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(tabs)'),
          },
        ]
      );
    }
  };

  const RoleSelector = () => (
    <View style={styles.roleContainer}>
      <Text style={[styles.label, { color: themeColors.text }]}>Rôle</Text>
      <View style={styles.roleButtons}>
        {ROLES.map((role) => (
          <TouchableOpacity
            key={role.value}
            style={[
              styles.roleButton,
              {
                backgroundColor: formData.role === role.value 
                  ? themeColors.primary 
                  : themeColors.card,
                borderColor: formData.role === role.value 
                  ? themeColors.primary 
                  : themeColors.border,
              },
            ]}
            onPress={() => updateFormData('role', role.value)}
          >
            <Text
              style={[
                styles.roleButtonText,
                {
                  color: formData.role === role.value 
                    ? '#FFFFFF' 
                    : themeColors.text,
                },
              ]}
            >
              {role.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Header
        title="Compléter le profil"
        leftIcon="arrow-back"
        onLeftPress={() => router.back()}
      />
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.form}>
          <Text style={[styles.description, { color: themeColors.textSecondary }]}>
            Complétez votre profil pour accéder à toutes les fonctionnalités de l&apos;application.
          </Text>

          <Input
            label="Nom complet"
            value={formData.fullName}
            onChangeText={(value) => updateFormData('fullName', value)}
            placeholder="Votre nom complet"
            autoCapitalize="words"
            leftIcon="person"
            error={errors.fullName}
          />

          <Input
            label="Téléphone"
            value={formData.phone}
            onChangeText={(value) => updateFormData('phone', value)}
            placeholder="Votre numéro de téléphone"
            keyboardType="phone-pad"
            leftIcon="phone"
            error={errors.phone}
          />

          <RoleSelector />

          <Input
            label="Localisation"
            value={formData.location}
            onChangeText={(value) => updateFormData('location', value)}
            placeholder="Votre ville"
            leftIcon="location-on"
            error={errors.location}
          />

          <Input
            label="Compétences"
            value={formData.skills}
            onChangeText={(value) => updateFormData('skills', value)}
            placeholder="Ex: JavaScript, React Native, Design..."
            multiline
            numberOfLines={3}
            leftIcon="star"
            error={errors.skills}
          />

          <Text style={[styles.hint, { color: themeColors.textSecondary }]}>
            Séparez vos compétences par des virgules
          </Text>

          <Input
            label="Bio"
            value={formData.bio}
            onChangeText={(value) => updateFormData('bio', value)}
            placeholder="Parlez-nous de vous..."
            multiline
            numberOfLines={4}
            leftIcon="info"
            error={errors.bio}
          />

          <Button
            title="Enregistrer le profil"
            onPress={handleSave}
            loading={isLoading}
            style={styles.saveButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  form: {
    paddingVertical: spacing.lg,
  },
  description: {
    ...typography.body,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  roleContainer: {
    marginBottom: spacing.md,
  },
  roleButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  roleButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    minWidth: 100,
    alignItems: 'center',
  },
  roleButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  hint: {
    fontSize: 12,
    marginTop: -spacing.sm,
    marginBottom: spacing.lg,
  },
  saveButton: {
    marginTop: spacing.xl,
  },
});
