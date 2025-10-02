
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useColorScheme,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import Card from '../../../components/Card';
import Button from '../../../components/Button';
import { colors, spacing, typography, borderRadius } from '../../../styles/commonStyles';
import { useAuthStore } from '../../../store/userStore';
import { useJobs } from '../../../hooks/useJobs';
import { useFormations } from '../../../hooks/useFormations';
import { useNotifications } from '../../../hooks/useNotifications';

interface JobOffer {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
}

interface Formation {
  id: string;
  title: string;
  provider: string;
  duration: string;
  price: string;
}

// Mock data - replace with real data from Supabase
const mockJobs: JobOffer[] = [
  {
    id: '1',
    title: 'Développeur React Native',
    company: 'TechCorp Bénin',
    location: 'Cotonou',
    salary: '300,000 - 500,000 FCFA',
    type: 'CDI',
  },
  {
    id: '2',
    title: 'Designer UI/UX',
    company: 'Creative Studio',
    location: 'Porto-Novo',
    salary: '250,000 - 400,000 FCFA',
    type: 'CDD',
  },
  {
    id: '3',
    title: 'Chef de Projet Digital',
    company: 'Digital Solutions',
    location: 'Cotonou',
    salary: '400,000 - 600,000 FCFA',
    type: 'CDI',
  },
];

const mockFormations: Formation[] = [
  {
    id: '1',
    title: 'Formation React Native',
    provider: 'Code Academy Bénin',
    duration: '3 mois',
    price: '150,000 FCFA',
  },
  {
    id: '2',
    title: 'Marketing Digital',
    provider: 'Digital Institute',
    duration: '2 mois',
    price: '100,000 FCFA',
  },
];

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const themeColors = colors[colorScheme || 'light'];
  const { profile } = useAuthStore();
  const { jobs, loading: jobsLoading } = useJobs();
  const { formations, loading: formationsLoading } = useFormations();
  const { unreadCount } = useNotifications();

  const renderJobItem = ({ item }: { item: any }) => (
    <Card style={styles.jobCard}>
      <View style={styles.jobHeader}>
        <Text style={[styles.jobTitle, { color: themeColors.text }]}>
          {item.title}
        </Text>
        <View style={[styles.jobType, { backgroundColor: themeColors.highlight }]}>
          <Text style={[styles.jobTypeText, { color: themeColors.primary }]}>
            {item.type}
          </Text>
        </View>
      </View>
      
      <Text style={[styles.jobCompany, { color: themeColors.textSecondary }]}>
        {item.entreprise?.name || 'Entreprise'}
      </Text>
      
      <View style={styles.jobDetails}>
        <View style={styles.jobDetailItem}>
          <IconSymbol name="location-on" size={16} color={themeColors.textSecondary} />
          <Text style={[styles.jobDetailText, { color: themeColors.textSecondary }]}>
            {item.location || 'Non spécifié'}
          </Text>
        </View>
        <View style={styles.jobDetailItem}>
          <IconSymbol name="attach-money" size={16} color={themeColors.textSecondary} />
          <Text style={[styles.jobDetailText, { color: themeColors.textSecondary }]}>
            {item.salary_range || 'À négocier'}
          </Text>
        </View>
      </View>
      
      <Button
        title="Voir l'offre"
        onPress={() => console.log('View job:', item.id)}
        variant="outline"
        size="small"
        style={styles.viewButton}
      />
    </Card>
  );

  const renderFormationItem = ({ item }: { item: any }) => (
    <Card style={styles.formationCard}>
      <Text style={[styles.formationTitle, { color: themeColors.text }]}>
        {item.title}
      </Text>
      <Text style={[styles.formationProvider, { color: themeColors.textSecondary }]}>
        {item.formateur?.full_name || 'Formateur'}
      </Text>
      
      <View style={styles.formationDetails}>
        <View style={styles.formationDetailItem}>
          <IconSymbol name="schedule" size={16} color={themeColors.textSecondary} />
          <Text style={[styles.formationDetailText, { color: themeColors.textSecondary }]}>
            {item.start_date ? new Date(item.start_date).toLocaleDateString('fr-FR') : 'Date à définir'}
          </Text>
        </View>
        <View style={styles.formationDetailItem}>
          <IconSymbol name="attach-money" size={16} color={themeColors.textSecondary} />
          <Text style={[styles.formationDetailText, { color: themeColors.textSecondary }]}>
            {item.price ? `${item.price} FCFA` : 'Gratuit'}
          </Text>
        </View>
      </View>
      
      <Button
        title="En savoir plus"
        onPress={() => console.log('View formation:', item.id)}
        variant="outline"
        size="small"
        style={styles.viewButton}
      />
    </Card>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: themeColors.textSecondary }]}>
              Bonjour,
            </Text>
            <Text style={[styles.userName, { color: themeColors.text }]}>
              {profile?.full_name?.split(' ')[0] || 'Utilisateur'} 👋
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.notificationButton, { backgroundColor: themeColors.card }]}
            onPress={() => router.push('/notifications')}
          >
            <IconSymbol name="notifications" size={24} color={themeColors.text} />
            {unreadCount > 0 && (
              <View style={[styles.notificationBadge, { backgroundColor: themeColors.error }]}>
                <Text style={styles.notificationBadgeText}>
                  {unreadCount > 99 ? '99+' : unreadCount.toString()}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.quickAction, { backgroundColor: themeColors.primary }]}
            onPress={() => router.push('/(tabs)/jobs')}
          >
            <IconSymbol name="work" size={24} color="#FFFFFF" />
            <Text style={styles.quickActionText}>Chercher un emploi</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.quickAction, { backgroundColor: themeColors.secondary }]}
            onPress={() => router.push('/(tabs)/formations')}
          >
            <IconSymbol name="school" size={24} color="#FFFFFF" />
            <Text style={styles.quickActionText}>Formations</Text>
          </TouchableOpacity>
        </View>

        {/* Latest Jobs */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
              Dernières offres d&apos;emploi
            </Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/jobs')}>
              <Text style={[styles.seeAll, { color: themeColors.primary }]}>
                Voir tout
              </Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={jobs.length > 0 ? jobs : mockJobs}
            renderItem={renderJobItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        {/* Latest Formations */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
              Formations recommandées
            </Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/formations')}>
              <Text style={[styles.seeAll, { color: themeColors.primary }]}>
                Voir tout
              </Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={formations.length > 0 ? formations : mockFormations}
            renderItem={renderFormationItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  greeting: {
    ...typography.body,
  },
  userName: {
    ...typography.h2,
    marginTop: spacing.xs,
  },
  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  quickAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  quickActionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
  },
  horizontalList: {
    paddingHorizontal: spacing.lg,
  },
  jobCard: {
    width: 280,
    marginRight: spacing.md,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  jobTitle: {
    ...typography.h3,
    flex: 1,
    marginRight: spacing.sm,
  },
  jobType: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  jobTypeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  jobCompany: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  jobDetails: {
    marginBottom: spacing.md,
  },
  jobDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  jobDetailText: {
    fontSize: 14,
    marginLeft: spacing.xs,
  },
  formationCard: {
    width: 260,
    marginRight: spacing.md,
  },
  formationTitle: {
    ...typography.h3,
    marginBottom: spacing.sm,
  },
  formationProvider: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  formationDetails: {
    marginBottom: spacing.md,
  },
  formationDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  formationDetailText: {
    fontSize: 14,
    marginLeft: spacing.xs,
  },
  viewButton: {
    marginTop: spacing.sm,
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});
