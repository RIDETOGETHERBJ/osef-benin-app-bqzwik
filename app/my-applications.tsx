
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  useColorScheme,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import Card from '../components/Card';
import Header from '../components/Header';
import Button from '../components/Button';
import { colors, spacing, typography, borderRadius } from '../styles/commonStyles';
import { useApplications } from '../hooks/useApplications';

export default function MyApplicationsScreen() {
  const colorScheme = useColorScheme();
  const themeColors = colors[colorScheme || 'light'];
  const { applications, loading, withdrawApplication, refetch } = useApplications();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'envoyée':
        return themeColors.info;
      case 'en cours':
        return themeColors.warning;
      case 'acceptée':
        return themeColors.success;
      case 'refusée':
        return themeColors.error;
      default:
        return themeColors.textSecondary;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'envoyée':
        return 'Envoyée';
      case 'en cours':
        return 'En cours';
      case 'acceptée':
        return 'Acceptée';
      case 'refusée':
        return 'Refusée';
      default:
        return status;
    }
  };

  const handleWithdraw = (applicationId: string, jobTitle: string) => {
    Alert.alert(
      'Retirer la candidature',
      `Êtes-vous sûr de vouloir retirer votre candidature pour "${jobTitle}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Retirer',
          style: 'destructive',
          onPress: async () => {
            const result = await withdrawApplication(applicationId);
            if (result.error) {
              Alert.alert('Erreur', result.error);
            } else {
              Alert.alert('Succès', 'Candidature retirée avec succès');
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const renderApplicationItem = ({ item }: { item: any }) => (
    <Card style={styles.applicationCard}>
      <View style={styles.applicationHeader}>
        <View style={styles.applicationInfo}>
          <Text style={[styles.jobTitle, { color: themeColors.text }]}>
            {item.offreemploi?.title || 'Offre supprimée'}
          </Text>
          <Text style={[styles.companyName, { color: themeColors.textSecondary }]}>
            {item.offreemploi?.entreprise?.name || 'Entreprise inconnue'}
          </Text>
        </View>
        
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>
            {getStatusLabel(item.status)}
          </Text>
        </View>
      </View>
      
      <View style={styles.applicationDetails}>
        <View style={styles.detailRow}>
          <IconSymbol name="schedule" size={16} color={themeColors.textSecondary} />
          <Text style={[styles.detailText, { color: themeColors.textSecondary }]}>
            Candidature envoyée le {formatDate(item.created_at)}
          </Text>
        </View>
        
        {item.motivation && (
          <View style={styles.motivationContainer}>
            <Text style={[styles.motivationLabel, { color: themeColors.text }]}>
              Lettre de motivation :
            </Text>
            <Text 
              style={[styles.motivationText, { color: themeColors.textSecondary }]}
              numberOfLines={3}
            >
              {item.motivation}
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.applicationActions}>
        {item.cv_url && (
          <Button
            title="Voir CV"
            onPress={() => console.log('Open CV:', item.cv_url)}
            variant="outline"
            size="small"
            style={styles.actionButton}
          />
        )}
        
        {item.status === 'envoyée' && (
          <Button
            title="Retirer"
            onPress={() => handleWithdraw(item.id, item.offreemploi?.title)}
            variant="outline"
            size="small"
            style={[styles.actionButton, { borderColor: themeColors.error }]}
            textStyle={{ color: themeColors.error }}
          />
        )}
      </View>
    </Card>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <IconSymbol name="work-outline" size={64} color={themeColors.textSecondary} />
      <Text style={[styles.emptyTitle, { color: themeColors.text }]}>
        Aucune candidature
      </Text>
      <Text style={[styles.emptyMessage, { color: themeColors.textSecondary }]}>
        Vous n&apos;avez pas encore postulé à des offres d&apos;emploi. Explorez les offres disponibles et postulez !
      </Text>
      <Button
        title="Voir les offres"
        onPress={() => router.push('/(tabs)/jobs')}
        style={styles.exploreButton}
      />
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Header
        title="Mes candidatures"
        leftIcon="arrow-back"
        onLeftPress={() => router.back()}
      />
      
      <FlatList
        data={applications}
        renderItem={renderApplicationItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.applicationsList}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refetch}
            colors={[themeColors.primary]}
          />
        }
        ListEmptyComponent={!loading ? renderEmptyState : null}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  applicationsList: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  applicationCard: {
    marginBottom: spacing.md,
  },
  applicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  applicationInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  jobTitle: {
    ...typography.h3,
    fontSize: 16,
    marginBottom: spacing.xs,
  },
  companyName: {
    fontSize: 14,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  applicationDetails: {
    marginBottom: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  detailText: {
    fontSize: 14,
  },
  motivationContainer: {
    marginTop: spacing.sm,
  },
  motivationLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  motivationText: {
    fontSize: 14,
    lineHeight: 20,
  },
  applicationActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  emptyTitle: {
    ...typography.h2,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  emptyMessage: {
    ...typography.body,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  exploreButton: {
    paddingHorizontal: spacing.xl,
  },
});
