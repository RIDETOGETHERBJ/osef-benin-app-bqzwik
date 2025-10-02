
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import { colors, spacing, typography } from '../styles/commonStyles';
import { useApplications } from '../hooks/useApplications';

export default function ApplyJobScreen() {
  const { jobId, jobTitle } = useLocalSearchParams();
  const [motivation, setMotivation] = useState('');
  const [cvUrl, setCvUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme();
  const themeColors = colors[colorScheme || 'light'];
  const { applyToJob } = useApplications();

  const handleApply = async () => {
    if (!motivation.trim()) {
      Alert.alert('Erreur', 'Veuillez rédiger une lettre de motivation');
      return;
    }

    setLoading(true);
    const result = await applyToJob(
      jobId as string,
      motivation.trim(),
      cvUrl.trim() || undefined
    );

    if (result.error) {
      Alert.alert('Erreur', result.error);
    } else {
      Alert.alert(
        'Candidature envoyée',
        'Votre candidature a été envoyée avec succès !',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Header
        title="Postuler"
        leftIcon="arrow-back"
        onLeftPress={() => router.back()}
      />
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Card style={styles.jobInfo}>
          <Text style={[styles.jobTitle, { color: themeColors.text }]}>
            {jobTitle}
          </Text>
          <Text style={[styles.jobSubtitle, { color: themeColors.textSecondary }]}>
            Vous postulez pour ce poste
          </Text>
        </Card>

        <Card style={styles.form}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            Lettre de motivation *
          </Text>
          <Input
            placeholder="Expliquez pourquoi vous êtes le candidat idéal pour ce poste..."
            value={motivation}
            onChangeText={setMotivation}
            multiline
            numberOfLines={8}
            containerStyle={styles.motivationInput}
          />

          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            Lien vers votre CV (optionnel)
          </Text>
          <Input
            placeholder="https://drive.google.com/file/d/..."
            value={cvUrl}
            onChangeText={setCvUrl}
            keyboardType="url"
            autoCapitalize="none"
            leftIcon="link"
          />

          <Text style={[styles.hint, { color: themeColors.textSecondary }]}>
            Vous pouvez partager un lien vers votre CV hébergé sur Google Drive, Dropbox, ou tout autre service de stockage en ligne.
          </Text>
        </Card>

        <Card style={styles.tips}>
          <Text style={[styles.tipsTitle, { color: themeColors.text }]}>
            💡 Conseils pour une candidature réussie
          </Text>
          <Text style={[styles.tipsText, { color: themeColors.textSecondary }]}>
            • Personnalisez votre lettre de motivation pour ce poste spécifique{'\n'}
            • Mettez en avant vos compétences pertinentes{'\n'}
            • Montrez votre motivation et votre intérêt pour l&apos;entreprise{'\n'}
            • Relisez-vous avant d&apos;envoyer
          </Text>
        </Card>

        <Button
          title="Envoyer ma candidature"
          onPress={handleApply}
          loading={loading}
          style={styles.submitButton}
        />
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
  jobInfo: {
    marginBottom: spacing.lg,
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  jobTitle: {
    ...typography.h2,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  jobSubtitle: {
    ...typography.body,
    textAlign: 'center',
  },
  form: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    marginBottom: spacing.md,
  },
  motivationInput: {
    marginBottom: spacing.lg,
  },
  hint: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: spacing.sm,
  },
  tips: {
    marginBottom: spacing.lg,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  tipsText: {
    fontSize: 14,
    lineHeight: 22,
  },
  submitButton: {
    marginTop: spacing.lg,
  },
});
