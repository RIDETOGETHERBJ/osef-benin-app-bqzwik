
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
  const [filteredJobs, setFilteredJobs] = useState(mockJobs);
  const colorScheme = useColorScheme();
  const themeColors = colors[colorScheme || 'light'];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredJobs(mockJobs);
    } else {
      const filtered = mockJobs.filter(
        job =>
          job.title.toLowerCase().includes(query.toLowerCase()) ||
          job.company.toLowerCase().includes(query.toLowerCase()) ||
          job.location.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredJobs(filtered);
    }
  };

  const renderJobItem = ({ item }: { item: JobOffer }) => (
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
          {item.company}
        </Text>
      </View>
      
      <View style={styles.jobDetails}>
        <View style={styles.jobDetailRow}>
          <IconSymbol name="location-on" size={16} color={themeColors.textSecondary} />
          <Text style={[styles.jobDetailText, { color: themeColors.textSecondary }]}>
            {item.location}
          </Text>
        </View>
        <View style={styles.jobDetailRow}>
          <IconSymbol name="attach-money" size={16} color={themeColors.textSecondary} />
          <Text style={[styles.jobDetailText, { color: themeColors.textSecondary }]}>
            {item.salary}
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
          onPress={() => console.log('Apply to job:', item.id)}
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
});
