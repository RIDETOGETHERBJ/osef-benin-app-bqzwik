
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useColorScheme,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Header from '../../components/Header';
import { colors, spacing, typography, borderRadius } from '../../styles/commonStyles';
import { useAuthStore } from '../../store/userStore';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const themeColors = colors[colorScheme || 'light'];
  const { profile, signOut, isLoading } = useAuthStore();

  const handleSignOut = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/auth/login');
          },
        },
      ]
    );
  };

  const ProfileSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <Card style={styles.section}>
      <Text style={[styles.sectionTitle, { color: themeColors.text }]}>{title}</Text>
      {children}
    </Card>
  );

  const ProfileItem = ({
    icon,
    label,
    value,
    onPress,
  }: {
    icon: string;
    label: string;
    value?: string;
    onPress?: () => void;
  }) => (
    <TouchableOpacity
      style={styles.profileItem}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.profileItemLeft}>
        <IconSymbol name={icon as any} size={20} color={themeColors.textSecondary} />
        <Text style={[styles.profileItemLabel, { color: themeColors.text }]}>
          {label}
        </Text>
      </View>
      <View style={styles.profileItemRight}>
        {value && (
          <Text style={[styles.profileItemValue, { color: themeColors.textSecondary }]}>
            {value}
          </Text>
        )}
        {onPress && (
          <IconSymbol name="chevron-right" size={20} color={themeColors.textSecondary} />
        )}
      </View>
    </TouchableOpacity>
  );

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'candidat':
        return 'Candidat';
      case 'entreprise':
        return 'Entreprise';
      case 'formateur':
        return 'Formateur';
      case 'admin':
        return 'Administrateur';
      default:
        return role;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Header
        title="Profil"
        rightIcon="edit"
        onRightPress={() => router.push('/profile/edit')}
      />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Profile Header */}
        <Card style={styles.profileHeader}>
          <View style={[styles.avatar, { backgroundColor: themeColors.primary }]}>
            <Text style={styles.avatarText}>
              {profile?.first_name?.charAt(0)?.toUpperCase() || 'U'}
            </Text>
          </View>
          
          <Text style={[styles.profileName, { color: themeColors.text }]}>
            {profile?.first_name} {profile?.last_name}
          </Text>
          
          <View style={[styles.roleBadge, { backgroundColor: themeColors.highlight }]}>
            <Text style={[styles.roleText, { color: themeColors.primary }]}>
              {getRoleLabel(profile?.role || 'candidat')}
            </Text>
          </View>
          
          {profile?.location && (
            <View style={styles.locationContainer}>
              <IconSymbol name="location-on" size={16} color={themeColors.textSecondary} />
              <Text style={[styles.locationText, { color: themeColors.textSecondary }]}>
                {profile.location}
              </Text>
            </View>
          )}
        </Card>

        {/* Personal Information */}
        <ProfileSection title="Informations personnelles">
          <ProfileItem
            icon="person"
            label="Nom complet"
            value={`${profile?.first_name || ''} ${profile?.last_name || ''}`}
          />
          <ProfileItem
            icon="mail"
            label="Email"
            value={profile?.email}
          />
          <ProfileItem
            icon="work"
            label="Rôle"
            value={getRoleLabel(profile?.role || 'candidat')}
          />
          <ProfileItem
            icon="location-on"
            label="Localisation"
            value={profile?.location || 'Non renseigné'}
          />
        </ProfileSection>

        {/* Skills */}
        {profile?.skills && profile.skills.length > 0 && (
          <ProfileSection title="Compétences">
            <View style={styles.skillsContainer}>
              {profile.skills.map((skill, index) => (
                <View key={index} style={[styles.skillChip, { backgroundColor: themeColors.highlight }]}>
                  <Text style={[styles.skillText, { color: themeColors.primary }]}>
                    {skill}
                  </Text>
                </View>
              ))}
            </View>
          </ProfileSection>
        )}

        {/* App Settings */}
        <ProfileSection title="Paramètres">
          <ProfileItem
            icon="notifications"
            label="Notifications"
            onPress={() => console.log('Notifications settings')}
          />
          <ProfileItem
            icon="security"
            label="Confidentialité"
            onPress={() => console.log('Privacy settings')}
          />
          <ProfileItem
            icon="language"
            label="Langue"
            value="Français"
            onPress={() => console.log('Language settings')}
          />
          <ProfileItem
            icon="dark-mode"
            label="Thème"
            value={colorScheme === 'dark' ? 'Sombre' : 'Clair'}
            onPress={() => console.log('Theme settings')}
          />
        </ProfileSection>

        {/* Admin Access */}
        {profile?.role === 'admin' && (
          <ProfileSection title="Administration">
            <ProfileItem
              icon="dashboard"
              label="Tableau de bord admin"
              onPress={() => router.push('/admin/dashboard')}
            />
            <ProfileItem
              icon="people"
              label="Gestion des utilisateurs"
              onPress={() => router.push('/admin/users')}
            />
            <ProfileItem
              icon="bar-chart"
              label="Statistiques"
              onPress={() => router.push('/admin/stats')}
            />
          </ProfileSection>
        )}

        {/* Legal */}
        <ProfileSection title="Légal">
          <ProfileItem
            icon="privacy-tip"
            label="Politique de confidentialité"
            onPress={() => router.push('/legal/privacy')}
          />
          <ProfileItem
            icon="description"
            label="Conditions d'utilisation"
            onPress={() => router.push('/legal/terms')}
          />
          <ProfileItem
            icon="group"
            label="Notre équipe"
            onPress={() => router.push('/legal/team')}
          />
        </ProfileSection>

        {/* Sign Out */}
        <View style={styles.signOutContainer}>
          <Button
            title="Se déconnecter"
            onPress={handleSignOut}
            variant="outline"
            loading={isLoading}
            style={[styles.signOutButton, { borderColor: themeColors.error }]}
            textStyle={{ color: themeColors.error }}
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
    paddingHorizontal: spacing.lg,
    paddingBottom: 120, // Space for floating tab bar
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '600',
  },
  profileName: {
    ...typography.h2,
    marginBottom: spacing.sm,
  },
  roleBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  roleText: {
    fontSize: 14,
    fontWeight: '600',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  locationText: {
    fontSize: 14,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    marginBottom: spacing.md,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  profileItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileItemLabel: {
    fontSize: 16,
    marginLeft: spacing.md,
  },
  profileItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  profileItemValue: {
    fontSize: 14,
    maxWidth: 150,
    textAlign: 'right',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  skillChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  skillText: {
    fontSize: 14,
    fontWeight: '500',
  },
  signOutContainer: {
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  signOutButton: {
    borderWidth: 1,
  },
});
