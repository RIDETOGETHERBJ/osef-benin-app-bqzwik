
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useColorScheme,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Card from '../../components/Card';
import Header from '../../components/Header';
import { colors, spacing, typography, borderRadius } from '../../styles/commonStyles';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  description: string;
  avatar: string;
}

const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Koffi Mensah',
    role: 'CEO & Fondateur',
    description: 'Entrepreneur passionné par l\'innovation technologique au service de l\'emploi au Bénin.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  },
  {
    id: '2',
    name: 'Aïcha Dossou',
    role: 'CTO',
    description: 'Ingénieure logiciel avec 8 ans d\'expérience dans le développement d\'applications mobiles.',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
  },
  {
    id: '3',
    name: 'Serge Agbodjan',
    role: 'Responsable Produit',
    description: 'Expert en UX/UI design, spécialisé dans la création d\'expériences utilisateur intuitives.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  },
  {
    id: '4',
    name: 'Fatou Kone',
    role: 'Responsable Marketing',
    description: 'Spécialiste en marketing digital et communication, passionnée par l\'impact social.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
  },
];

export default function TeamScreen() {
  const colorScheme = useColorScheme();
  const themeColors = colors[colorScheme || 'light'];

  const renderTeamMember = (member: TeamMember) => (
    <Card key={member.id} style={styles.memberCard}>
      <View style={styles.memberHeader}>
        <Image source={{ uri: member.avatar }} style={styles.memberAvatar} />
        <View style={styles.memberInfo}>
          <Text style={[styles.memberName, { color: themeColors.text }]}>
            {member.name}
          </Text>
          <Text style={[styles.memberRole, { color: themeColors.primary }]}>
            {member.role}
          </Text>
        </View>
      </View>
      <Text style={[styles.memberDescription, { color: themeColors.textSecondary }]}>
        {member.description}
      </Text>
    </Card>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Header
        title="Notre équipe"
        leftIcon="arrow-back"
        onLeftPress={() => router.back()}
      />
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: themeColors.text }]}>
            L&apos;équipe OSEF BENIN
          </Text>
          <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
            Une équipe passionnée dédiée à révolutionner le marché de l&apos;emploi au Bénin
          </Text>
        </View>
        
        <View style={styles.mission}>
          <Card>
            <Text style={[styles.missionTitle, { color: themeColors.text }]}>
              Notre mission
            </Text>
            <Text style={[styles.missionText, { color: themeColors.textSecondary }]}>
              Faciliter l&apos;accès à l&apos;emploi et à la formation professionnelle au Bénin 
              en créant une plateforme moderne et accessible qui connecte les talents 
              avec les opportunités.
            </Text>
          </Card>
        </View>
        
        <View style={styles.teamSection}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            Rencontrez l&apos;équipe
          </Text>
          {teamMembers.map(renderTeamMember)}
        </View>
        
        <View style={styles.values}>
          <Card>
            <Text style={[styles.valuesTitle, { color: themeColors.text }]}>
              Nos valeurs
            </Text>
            <View style={styles.valuesList}>
              <View style={styles.valueItem}>
                <Text style={[styles.valueTitle, { color: themeColors.primary }]}>
                  Innovation
                </Text>
                <Text style={[styles.valueDescription, { color: themeColors.textSecondary }]}>
                  Nous utilisons la technologie pour créer des solutions modernes et efficaces.
                </Text>
              </View>
              
              <View style={styles.valueItem}>
                <Text style={[styles.valueTitle, { color: themeColors.primary }]}>
                  Inclusion
                </Text>
                <Text style={[styles.valueDescription, { color: themeColors.textSecondary }]}>
                  Nous croyons que chacun mérite l&apos;accès aux opportunités d&apos;emploi.
                </Text>
              </View>
              
              <View style={styles.valueItem}>
                <Text style={[styles.valueTitle, { color: themeColors.primary }]}>
                  Excellence
                </Text>
                <Text style={[styles.valueDescription, { color: themeColors.textSecondary }]}>
                  Nous nous efforçons de fournir la meilleure expérience possible à nos utilisateurs.
                </Text>
              </View>
            </View>
          </Card>
        </View>
        
        <View style={styles.contact}>
          <Card>
            <Text style={[styles.contactTitle, { color: themeColors.text }]}>
              Contactez-nous
            </Text>
            <Text style={[styles.contactText, { color: themeColors.textSecondary }]}>
              Vous avez des questions ou des suggestions ? N&apos;hésitez pas à nous contacter :
            </Text>
            <Text style={[styles.contactEmail, { color: themeColors.primary }]}>
              contact@osefbenin.com
            </Text>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h1,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  subtitle: {
    ...typography.body,
    textAlign: 'center',
    lineHeight: 24,
  },
  mission: {
    marginBottom: spacing.xl,
  },
  missionTitle: {
    ...typography.h3,
    marginBottom: spacing.md,
  },
  missionText: {
    ...typography.body,
    lineHeight: 24,
  },
  teamSection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h2,
    marginBottom: spacing.lg,
  },
  memberCard: {
    marginBottom: spacing.lg,
  },
  memberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  memberAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: spacing.md,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    ...typography.h3,
    marginBottom: spacing.xs,
  },
  memberRole: {
    fontSize: 16,
    fontWeight: '600',
  },
  memberDescription: {
    ...typography.body,
    lineHeight: 22,
  },
  values: {
    marginBottom: spacing.xl,
  },
  valuesTitle: {
    ...typography.h3,
    marginBottom: spacing.md,
  },
  valuesList: {
    gap: spacing.lg,
  },
  valueItem: {
    marginBottom: spacing.md,
  },
  valueTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  valueDescription: {
    ...typography.body,
    lineHeight: 22,
  },
  contact: {
    marginBottom: spacing.lg,
  },
  contactTitle: {
    ...typography.h3,
    marginBottom: spacing.md,
  },
  contactText: {
    ...typography.body,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  contactEmail: {
    fontSize: 16,
    fontWeight: '600',
  },
});
