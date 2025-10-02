
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useColorScheme,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import Card from '../../components/Card';
import Header from '../../components/Header';
import { colors, spacing, typography, borderRadius } from '../../styles/commonStyles';
import { useAuthStore } from '../../store/userStore';
import { supabase } from '../../config/supabase';

interface DashboardStats {
  totalUsers: number;
  totalJobs: number;
  totalFormations: number;
  totalApplications: number;
  newUsersThisMonth: number;
  activeJobs: number;
}

export default function AdminDashboardScreen() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalJobs: 0,
    totalFormations: 0,
    totalApplications: 0,
    newUsersThisMonth: 0,
    activeJobs: 0,
  });
  const [loading, setLoading] = useState(true);
  const colorScheme = useColorScheme();
  const themeColors = colors[colorScheme || 'light'];
  const { profile } = useAuthStore();

  // Redirect if not admin
  useEffect(() => {
    if (profile && profile.role !== 'admin') {
      router.replace('/(tabs)');
    }
  }, [profile]);

  const fetchStats = async () => {
    try {
      setLoading(true);

      // Get total users
      const { count: totalUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      // Get total jobs
      const { count: totalJobs } = await supabase
        .from('offreemploi')
        .select('*', { count: 'exact', head: true });

      // Get active jobs
      const { count: activeJobs } = await supabase
        .from('offreemploi')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      // Get total formations
      const { count: totalFormations } = await supabase
        .from('formation')
        .select('*', { count: 'exact', head: true });

      // Get total applications
      const { count: totalApplications } = await supabase
        .from('candidature')
        .select('*', { count: 'exact', head: true });

      // Get new users this month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { count: newUsersThisMonth } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfMonth.toISOString());

      setStats({
        totalUsers: totalUsers || 0,
        totalJobs: totalJobs || 0,
        totalFormations: totalFormations || 0,
        totalApplications: totalApplications || 0,
        newUsersThisMonth: newUsersThisMonth || 0,
        activeJobs: activeJobs || 0,
      });
    } catch (error) {
      console.log('Error fetching admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const StatCard = ({ 
    title, 
    value, 
    icon, 
    color, 
    onPress 
  }: { 
    title: string; 
    value: number; 
    icon: string; 
    color: string;
    onPress?: () => void;
  }) => (
    <TouchableOpacity
      style={styles.statCard}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <Card style={styles.statCardContent}>
        <View style={[styles.statIcon, { backgroundColor: color }]}>
          <IconSymbol name={icon as any} size={24} color="#FFFFFF" />
        </View>
        <View style={styles.statInfo}>
          <Text style={[styles.statValue, { color: themeColors.text }]}>
            {value.toLocaleString()}
          </Text>
          <Text style={[styles.statTitle, { color: themeColors.textSecondary }]}>
            {title}
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
  );

  const QuickAction = ({ 
    title, 
    icon, 
    color, 
    onPress 
  }: { 
    title: string; 
    icon: string; 
    color: string;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      style={[styles.quickAction, { backgroundColor: color }]}
      onPress={onPress}
    >
      <IconSymbol name={icon as any} size={24} color="#FFFFFF" />
      <Text style={styles.quickActionText}>{title}</Text>
    </TouchableOpacity>
  );

  if (profile?.role !== 'admin') {
    return null;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Header
        title="Tableau de bord Admin"
        leftIcon="arrow-back"
        onLeftPress={() => router.back()}
      />
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={fetchStats}
            colors={[themeColors.primary]}
          />
        }
      >
        {/* Welcome Section */}
        <Card style={styles.welcomeCard}>
          <Text style={[styles.welcomeTitle, { color: themeColors.text }]}>
            Bienvenue, {profile?.full_name}
          </Text>
          <Text style={[styles.welcomeSubtitle, { color: themeColors.textSecondary }]}>
            Voici un aperçu de l&apos;activité sur OSEF BENIN
          </Text>
        </Card>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatCard
            title="Utilisateurs"
            value={stats.totalUsers}
            icon="people"
            color={themeColors.primary}
            onPress={() => router.push('/admin/users')}
          />
          <StatCard
            title="Offres d'emploi"
            value={stats.totalJobs}
            icon="work"
            color={themeColors.secondary}
          />
          <StatCard
            title="Formations"
            value={stats.totalFormations}
            icon="school"
            color={themeColors.accent}
          />
          <StatCard
            title="Candidatures"
            value={stats.totalApplications}
            icon="assignment"
            color={themeColors.warning}
          />
        </View>

        {/* Additional Stats */}
        <View style={styles.additionalStats}>
          <StatCard
            title="Nouveaux utilisateurs ce mois"
            value={stats.newUsersThisMonth}
            icon="person-add"
            color={themeColors.success}
          />
          <StatCard
            title="Offres actives"
            value={stats.activeJobs}
            icon="trending-up"
            color={themeColors.info}
          />
        </View>

        {/* Quick Actions */}
        <Card style={styles.quickActionsCard}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            Actions rapides
          </Text>
          <View style={styles.quickActionsGrid}>
            <QuickAction
              title="Gérer les utilisateurs"
              icon="people"
              color={themeColors.primary}
              onPress={() => router.push('/admin/users')}
            />
            <QuickAction
              title="Voir les statistiques"
              icon="bar-chart"
              color={themeColors.secondary}
              onPress={() => router.push('/admin/stats')}
            />
            <QuickAction
              title="Modérer le contenu"
              icon="flag"
              color={themeColors.warning}
              onPress={() => console.log('Content moderation')}
            />
            <QuickAction
              title="Paramètres système"
              icon="settings"
              color={themeColors.textSecondary}
              onPress={() => console.log('System settings')}
            />
          </View>
        </Card>

        {/* Recent Activity */}
        <Card style={styles.activityCard}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            Activité récente
          </Text>
          <Text style={[styles.comingSoon, { color: themeColors.textSecondary }]}>
            Fonctionnalité à venir...
          </Text>
        </Card>
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
    paddingBottom: spacing.xl,
  },
  welcomeCard: {
    marginBottom: spacing.lg,
    paddingVertical: spacing.xl,
  },
  welcomeTitle: {
    ...typography.h2,
    marginBottom: spacing.sm,
  },
  welcomeSubtitle: {
    ...typography.body,
    lineHeight: 22,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  additionalStats: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
  },
  statCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  statInfo: {
    flex: 1,
  },
  statValue: {
    ...typography.h2,
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  statTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  quickActionsCard: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    marginBottom: spacing.md,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  quickAction: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  quickActionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  activityCard: {
    marginBottom: spacing.lg,
  },
  comingSoon: {
    ...typography.body,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: spacing.xl,
  },
});
