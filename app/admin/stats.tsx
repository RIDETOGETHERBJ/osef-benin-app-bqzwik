
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useColorScheme,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import Card from '../../components/Card';
import Header from '../../components/Header';
import { colors, spacing, typography } from '../../styles/commonStyles';
import { useAuthStore } from '../../store/userStore';
import { supabase } from '../../config/supabase';

const { width } = Dimensions.get('window');

interface MonthlyStats {
  month: string;
  users: number;
  jobs: number;
  applications: number;
}

export default function AdminStatsScreen() {
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats[]>([]);
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

  const fetchMonthlyStats = async () => {
    try {
      setLoading(true);
      
      // Get last 6 months of data
      const months = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        months.push({
          start: new Date(date.getFullYear(), date.getMonth(), 1),
          end: new Date(date.getFullYear(), date.getMonth() + 1, 0),
          label: date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }),
        });
      }

      const stats: MonthlyStats[] = [];

      for (const month of months) {
        // Get users count for this month
        const { count: users } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', month.start.toISOString())
          .lt('created_at', month.end.toISOString());

        // Get jobs count for this month
        const { count: jobs } = await supabase
          .from('offreemploi')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', month.start.toISOString())
          .lt('created_at', month.end.toISOString());

        // Get applications count for this month
        const { count: applications } = await supabase
          .from('candidature')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', month.start.toISOString())
          .lt('created_at', month.end.toISOString());

        stats.push({
          month: month.label,
          users: users || 0,
          jobs: jobs || 0,
          applications: applications || 0,
        });
      }

      setMonthlyStats(stats);
    } catch (error) {
      console.log('Error fetching monthly stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonthlyStats();
  }, []);

  const SimpleBarChart = ({ 
    data, 
    dataKey, 
    color, 
    title 
  }: { 
    data: MonthlyStats[]; 
    dataKey: keyof MonthlyStats; 
    color: string;
    title: string;
  }) => {
    const maxValue = Math.max(...data.map(item => Number(item[dataKey])));
    const chartWidth = width - (spacing.lg * 2) - (spacing.lg * 2); // Account for card padding
    const barWidth = (chartWidth - (spacing.sm * (data.length - 1))) / data.length;

    return (
      <Card style={styles.chartCard}>
        <Text style={[styles.chartTitle, { color: themeColors.text }]}>
          {title}
        </Text>
        <View style={styles.chart}>
          <View style={styles.barsContainer}>
            {data.map((item, index) => {
              const value = Number(item[dataKey]);
              const height = maxValue > 0 ? (value / maxValue) * 120 : 0;
              
              return (
                <View key={index} style={styles.barColumn}>
                  <View style={styles.barContainer}>
                    <View
                      style={[
                        styles.bar,
                        {
                          height: height,
                          backgroundColor: color,
                          width: barWidth,
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.barValue, { color: themeColors.text }]}>
                    {value}
                  </Text>
                  <Text style={[styles.barLabel, { color: themeColors.textSecondary }]}>
                    {item.month}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </Card>
    );
  };

  const StatsSummary = () => {
    const totalUsers = monthlyStats.reduce((sum, month) => sum + month.users, 0);
    const totalJobs = monthlyStats.reduce((sum, month) => sum + month.jobs, 0);
    const totalApplications = monthlyStats.reduce((sum, month) => sum + month.applications, 0);

    return (
      <Card style={styles.summaryCard}>
        <Text style={[styles.summaryTitle, { color: themeColors.text }]}>
          Résumé des 6 derniers mois
        </Text>
        <View style={styles.summaryGrid}>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryValue, { color: themeColors.primary }]}>
              {totalUsers}
            </Text>
            <Text style={[styles.summaryLabel, { color: themeColors.textSecondary }]}>
              Nouveaux utilisateurs
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryValue, { color: themeColors.secondary }]}>
              {totalJobs}
            </Text>
            <Text style={[styles.summaryLabel, { color: themeColors.textSecondary }]}>
              Offres publiées
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryValue, { color: themeColors.accent }]}>
              {totalApplications}
            </Text>
            <Text style={[styles.summaryLabel, { color: themeColors.textSecondary }]}>
              Candidatures
            </Text>
          </View>
        </View>
      </Card>
    );
  };

  if (profile?.role !== 'admin') {
    return null;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Header
        title="Statistiques"
        leftIcon="arrow-back"
        onLeftPress={() => router.back()}
      />
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <StatsSummary />
        
        <SimpleBarChart
          data={monthlyStats}
          dataKey="users"
          color={themeColors.primary}
          title="Nouveaux utilisateurs par mois"
        />
        
        <SimpleBarChart
          data={monthlyStats}
          dataKey="jobs"
          color={themeColors.secondary}
          title="Offres d'emploi publiées par mois"
        />
        
        <SimpleBarChart
          data={monthlyStats}
          dataKey="applications"
          color={themeColors.accent}
          title="Candidatures par mois"
        />

        {loading && (
          <Card style={styles.loadingCard}>
            <Text style={[styles.loadingText, { color: themeColors.textSecondary }]}>
              Chargement des statistiques...
            </Text>
          </Card>
        )}
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
  summaryCard: {
    marginBottom: spacing.lg,
  },
  summaryTitle: {
    ...typography.h3,
    marginBottom: spacing.md,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    ...typography.h1,
    fontSize: 32,
    marginBottom: spacing.xs,
  },
  summaryLabel: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  chartCard: {
    marginBottom: spacing.lg,
  },
  chartTitle: {
    ...typography.h3,
    marginBottom: spacing.lg,
  },
  chart: {
    height: 180,
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 160,
    gap: spacing.sm,
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
  },
  barContainer: {
    height: 120,
    justifyContent: 'flex-end',
    marginBottom: spacing.xs,
  },
  bar: {
    borderRadius: 4,
    minHeight: 2,
  },
  barValue: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  barLabel: {
    fontSize: 10,
    textAlign: 'center',
  },
  loadingCard: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  loadingText: {
    ...typography.body,
    fontStyle: 'italic',
  },
});
