
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

interface Formation {
  id: string;
  title: string;
  provider: string;
  duration: string;
  price: string;
  level: string;
  description: string;
  skills: string[];
  startDate: string;
  mode: string;
}

// Mock data - replace with real data from Supabase
const mockFormations: Formation[] = [
  {
    id: '1',
    title: 'Formation React Native',
    provider: 'Code Academy Bénin',
    duration: '3 mois',
    price: '150,000 FCFA',
    level: 'Intermédiaire',
    description: 'Apprenez à développer des applications mobiles avec React Native.',
    skills: ['React Native', 'JavaScript', 'Mobile Development'],
    startDate: '2024-02-01',
    mode: 'Présentiel',
  },
  {
    id: '2',
    title: 'Marketing Digital',
    provider: 'Digital Institute',
    duration: '2 mois',
    price: '100,000 FCFA',
    level: 'Débutant',
    description: 'Maîtrisez les outils et stratégies du marketing digital.',
    skills: ['SEO', 'Google Ads', 'Social Media', 'Analytics'],
    startDate: '2024-02-15',
    mode: 'En ligne',
  },
  {
    id: '3',
    title: 'Design UI/UX',
    provider: 'Creative School',
    duration: '4 mois',
    price: '200,000 FCFA',
    level: 'Intermédiaire',
    description: 'Créez des interfaces utilisateur modernes et intuitives.',
    skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research'],
    startDate: '2024-02-10',
    mode: 'Hybride',
  },
  {
    id: '4',
    title: 'Développement Web Full Stack',
    provider: 'WebDev Academy',
    duration: '6 mois',
    price: '300,000 FCFA',
    level: 'Avancé',
    description: 'Devenez développeur full stack avec les technologies modernes.',
    skills: ['React', 'Node.js', 'MongoDB', 'Express'],
    startDate: '2024-03-01',
    mode: 'Présentiel',
  },
  {
    id: '5',
    title: 'Gestion de Projet Agile',
    provider: 'Management Pro',
    duration: '1 mois',
    price: '80,000 FCFA',
    level: 'Débutant',
    description: 'Apprenez les méthodes agiles pour gérer vos projets efficacement.',
    skills: ['Scrum', 'Kanban', 'Leadership', 'Communication'],
    startDate: '2024-02-20',
    mode: 'En ligne',
  },
];

export default function FormationsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFormations, setFilteredFormations] = useState(mockFormations);
  const colorScheme = useColorScheme();
  const themeColors = colors[colorScheme || 'light'];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredFormations(mockFormations);
    } else {
      const filtered = mockFormations.filter(
        formation =>
          formation.title.toLowerCase().includes(query.toLowerCase()) ||
          formation.provider.toLowerCase().includes(query.toLowerCase()) ||
          formation.skills.some(skill => skill.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredFormations(filtered);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Débutant':
        return themeColors.success;
      case 'Intermédiaire':
        return themeColors.warning;
      case 'Avancé':
        return themeColors.error;
      default:
        return themeColors.textSecondary;
    }
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'En ligne':
        return 'computer';
      case 'Présentiel':
        return 'school';
      case 'Hybride':
        return 'sync';
      default:
        return 'help';
    }
  };

  const renderFormationItem = ({ item }: { item: Formation }) => (
    <Card style={styles.formationCard}>
      <View style={styles.formationHeader}>
        <View style={styles.formationTitleContainer}>
          <Text style={[styles.formationTitle, { color: themeColors.text }]}>
            {item.title}
          </Text>
          <View style={[styles.levelBadge, { backgroundColor: getLevelColor(item.level) + '20' }]}>
            <Text style={[styles.levelText, { color: getLevelColor(item.level) }]}>
              {item.level}
            </Text>
          </View>
        </View>
        
        <Text style={[styles.formationProvider, { color: themeColors.textSecondary }]}>
          {item.provider}
        </Text>
      </View>
      
      <View style={styles.formationDetails}>
        <View style={styles.formationDetailRow}>
          <IconSymbol name="schedule" size={16} color={themeColors.textSecondary} />
          <Text style={[styles.formationDetailText, { color: themeColors.textSecondary }]}>
            {item.duration}
          </Text>
        </View>
        <View style={styles.formationDetailRow}>
          <IconSymbol name="attach-money" size={16} color={themeColors.textSecondary} />
          <Text style={[styles.formationDetailText, { color: themeColors.textSecondary }]}>
            {item.price}
          </Text>
        </View>
        <View style={styles.formationDetailRow}>
          <IconSymbol name={getModeIcon(item.mode) as any} size={16} color={themeColors.textSecondary} />
          <Text style={[styles.formationDetailText, { color: themeColors.textSecondary }]}>
            {item.mode}
          </Text>
        </View>
        <View style={styles.formationDetailRow}>
          <IconSymbol name="event" size={16} color={themeColors.textSecondary} />
          <Text style={[styles.formationDetailText, { color: themeColors.textSecondary }]}>
            Début: {new Date(item.startDate).toLocaleDateString('fr-FR')}
          </Text>
        </View>
      </View>
      
      <Text style={[styles.formationDescription, { color: themeColors.text }]} numberOfLines={2}>
        {item.description}
      </Text>
      
      <View style={styles.skills}>
        {item.skills.slice(0, 3).map((skill, index) => (
          <View key={index} style={[styles.skill, { backgroundColor: themeColors.highlight }]}>
            <Text style={[styles.skillText, { color: themeColors.primary }]}>
              {skill}
            </Text>
          </View>
        ))}
        {item.skills.length > 3 && (
          <Text style={[styles.moreSkills, { color: themeColors.textSecondary }]}>
            +{item.skills.length - 3} autres
          </Text>
        )}
      </View>
      
      <View style={styles.formationActions}>
        <Button
          title="Voir détails"
          onPress={() => console.log('View formation details:', item.id)}
          variant="outline"
          size="small"
          style={styles.actionButton}
        />
        <Button
          title="S'inscrire"
          onPress={() => console.log('Enroll in formation:', item.id)}
          size="small"
          style={styles.actionButton}
        />
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Header title="Formations" />
      
      <View style={styles.searchContainer}>
        <Input
          placeholder="Rechercher une formation..."
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
          {filteredFormations.length} formation{filteredFormations.length > 1 ? 's' : ''} disponible{filteredFormations.length > 1 ? 's' : ''}
        </Text>
      </View>
      
      <FlatList
        data={filteredFormations}
        renderItem={renderFormationItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.formationsList}
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
  formationsList: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 100, // Space for floating tab bar
  },
  formationCard: {
    marginBottom: spacing.md,
  },
  formationHeader: {
    marginBottom: spacing.md,
  },
  formationTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  formationTitle: {
    ...typography.h3,
    flex: 1,
    marginRight: spacing.sm,
  },
  levelBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  levelText: {
    fontSize: 12,
    fontWeight: '600',
  },
  formationProvider: {
    fontSize: 16,
    fontWeight: '600',
  },
  formationDetails: {
    marginBottom: spacing.md,
  },
  formationDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  formationDetailText: {
    fontSize: 14,
    marginLeft: spacing.xs,
  },
  formationDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  skills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  skill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  skillText: {
    fontSize: 12,
    fontWeight: '500',
  },
  moreSkills: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  formationActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
  },
});
