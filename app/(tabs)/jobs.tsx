
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  useColorScheme,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Header from '../../components/Header';
import { colors, spacing, typography, borderRadius } from '../../styles/commonStyles';
import { useJobs } from '../../hooks/useJobs';
import { router } from 'expo-router';

interface JobOffer {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  description: string;
  requirements: string[];
  postedDate: string;
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
    description: 'Nous recherchons un développeur React Native expérimenté pour rejoindre notre équipe.',
    requirements: ['React Native', 'JavaScript', 'TypeScript', 'Git'],
    postedDate: '2024-01-15',
  },
  {
    id: '2',
    title: 'Designer UI/UX',
    company: 'Creative Studio',
    location: 'Porto-Novo',
    salary: '250,000 - 400,000 FCFA',
    type: 'CDD',
    description: 'Créez des expériences utilisateur exceptionnelles pour nos clients.',
    requirements: ['Figma', 'Adobe XD', 'Prototyping', 'User Research'],
    postedDate: '2024-01-14',
  },
  {
    id: '3',
    title: 'Chef de Projet Digital',
    company: 'Digital Solutions',
    location: 'Cotonou',
    salary: '400,000 - 600,000 FCFA',
    type: 'CDI',
    description: 'Dirigez des projets digitaux innovants et gérez une équipe de développeurs.',
    requirements: ['Gestion de projet', 'Agile', 'Scrum', 'Leadership'],
    postedDate: '2024-01-13',
  },
  {
    id: '4',
    title: 'Développeur Web Full Stack',
    company: 'WebDev Pro',
    location: 'Parakou',
    salary: '280,000 - 450,000 FCFA',
    type: 'CDI',
    description: 'Développez des applications web modernes avec les dernières technologies.',
    requirements: ['React', 'Node.js', 'MongoDB', 'Express'],
    postedDate: '2024-01-12',
  },
  {
    id: '5',
    title: 'Spécialiste Marketing Digital',
    company: 'Marketing Plus',
    location: 'Cotonou',
    salary: '200,000 - 350,000 FCFA',
    type: 'CDD',
    description: 'Développez et exécutez des stratégies marketing digital pour nos clients.',
    requirements: ['SEO', 'Google Ads', 'Social Media', 'Analytics'],
    postedDate: '2024-01-11',
  },
];

export default function JobsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredJobs, setFilteredJobs] = useState<JobOffer[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');
  const colorScheme = useColorScheme();
  const themeColors = colors[colorScheme || 'light'];
  const { jobs, loading } = useJobs();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterJobs(query, selectedType);
  };

  const filterJobs = React.useCallback((query: string, type: string) => {
    const dataToFilter = jobs.length > 0 ? jobs : mockJobs;
    let filtered = dataToFilter;

    // Filter by type
    if (type !== 'all') {
      filtered = filtered.filter(job => job.type === type);
    }

    // Filter by search query
    if (query.trim()) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(query.toLowerCase()) ||
        job.description?.toLowerCase().includes(query.toLowerCase()) ||
        job.location?.toLowerCase().includes(query.toLowerCase())
      );
    }

    setFilteredJobs(filtered);
  }, [jobs]);

  // Update filtered jobs when jobs or filters change
  React.useEffect(() => {
    filterJobs(searchQuery, selectedType);
  }, [jobs, searchQuery, selectedType, filterJobs]);

  const TypeFilter = () => (
    <View style={styles.typeFilter}>
      {['all', 'CDI', 'CDD', 'Stage', 'Freelance'].map((type) => (
        <TouchableOpacity
          key={type}
          style={[
            styles.typeFilterButton,
            {
              backgroundColor: selectedType === type 
                ? themeColors.primary 
                : themeColors.card,
              borderColor: selectedType === type 
                ? themeColors.primary 
                : themeColors.border,
            },
          ]}
          onPress={() => setSelectedType(type)}
        >
          <Text
            style={[
              styles.typeFilterText,
              {
                color: selectedType === type 
                  ? '#FFFFFF' 
                  : themeColors.text,
              },
            ]}
          >
            {type === 'all' ? 'Tous' : type}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderJobItem = ({ item }: { item: any }) => (
    <Card style={styles.jobCard}>
      <View style={styles.jobHeader}>
        <View style={styles.jobTitleContainer}>
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
          {item.entreprise?.name || item.company || 'Entreprise'}
        </Text>
      </View>
      
      <View style={styles.jobDetails}>
        <View style={styles.jobDetailRow}>
          <IconSymbol name="location-on" size={16} color={themeColors.textSecondary} />
          <Text style={[styles.jobDetailText, { color: themeColors.textSecondary }]}>
            {item.location || 'Non spécifié'}
          </Text>
        </View>
        <View style={styles.jobDetailRow}>
          <IconSymbol name="attach-money" size={16} color={themeColors.textSecondary} />
          <Text style={[styles.jobDetailText, { color: themeColors.textSecondary }]}>
            {item.salary_range || item.salary || 'À négocier'}
          </Text>
        </View>
        <View style={styles.jobDetailRow}>
          <IconSymbol name="schedule" size={16} color={themeColors.textSecondary} />
          <Text style={[styles.jobDetailText, { color: themeColors.textSecondary }]}>
            Publié le {new Date(item.postedDate).toLocaleDateString('fr-FR')}
          </Text>
        </View>
      </View>
      
      <Text style={[styles.jobDescription, { color: themeColors.text }]} numberOfLines={2}>
        {item.description}
      </Text>
      
      <View style={styles.requirements}>
        {item.requirements.slice(0, 3).map((req, index) => (
          <View key={index} style={[styles.requirement, { backgroundColor: themeColors.highlight }]}>
            <Text style={[styles.requirementText, { color: themeColors.primary }]}>
              {req}
            </Text>
          </View>
        ))}
        {item.requirements.length > 3 && (
          <Text style={[styles.moreRequirements, { color: themeColors.textSecondary }]}>
            +{item.requirements.length - 3} autres
          </Text>
        )}
      </View>
      
      <View style={styles.jobActions}>
        <Button
          title="Voir détails"
          onPress={() => console.log('View job details:', item.id)}
          variant="outline"
          size="small"
          style={styles.actionButton}
        />
        <Button
          title="Postuler"
          onPress={() => router.push({
            pathname: '/apply-job',
            params: { jobId: item.id, jobTitle: item.title }
          })}
          size="small"
          style={styles.actionButton}
        />
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Header title="Offres d'emploi" />
      
      <View style={styles.searchContainer}>
        <Input
          placeholder="Rechercher un emploi, entreprise..."
          value={searchQuery}
          onChangeText={handleSearch}
          leftIcon="search"
          containerStyle={styles.searchInput}
        />
        
        <TouchableOpacity
          style={[styles.filterButton, { backgroundColor: themeColors.primary }]}
          onPress={() => console.log('Open filters')}
        >
          <IconSymbol name="tune" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.filtersContainer}>
        <TypeFilter />
      </View>
      
      <View style={styles.resultsHeader}>
        <Text style={[styles.resultsCount, { color: themeColors.textSecondary }]}>
          {filteredJobs.length} offre{filteredJobs.length > 1 ? 's' : ''} trouvée{filteredJobs.length > 1 ? 's' : ''}
        </Text>
      </View>
      
      <FlatList
        data={filteredJobs}
        renderItem={renderJobItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.jobsList}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    marginBottom: 0,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20, // Align with input field
  },
  resultsHeader: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  resultsCount: {
    fontSize: 14,
  },
  jobsList: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 100, // Space for floating tab bar
  },
  jobCard: {
    marginBottom: spacing.md,
  },
  jobHeader: {
    marginBottom: spacing.md,
  },
  jobTitleContainer: {
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
  },
  jobDetails: {
    marginBottom: spacing.md,
  },
  jobDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  jobDetailText: {
    fontSize: 14,
    marginLeft: spacing.xs,
  },
  jobDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  requirements: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  requirement: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  requirementText: {
    fontSize: 12,
    fontWeight: '500',
  },
  moreRequirements: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  jobActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
  },
  filtersContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  typeFilter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  typeFilterButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
  },
  typeFilterText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
