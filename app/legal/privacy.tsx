
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Header from '../../components/Header';
import { colors, spacing, typography } from '../../styles/commonStyles';

export default function PrivacyScreen() {
  const colorScheme = useColorScheme();
  const themeColors = colors[colorScheme || 'light'];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Header
        title="Politique de confidentialité"
        leftIcon="arrow-back"
        onLeftPress={() => router.back()}
      />
      
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: themeColors.text }]}>
          Politique de confidentialité OSEF BENIN
        </Text>
        
        <Text style={[styles.lastUpdated, { color: themeColors.textSecondary }]}>
          Dernière mise à jour : 15 janvier 2024
        </Text>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            1. Collecte des informations
          </Text>
          <Text style={[styles.paragraph, { color: themeColors.text }]}>
            OSEF BENIN collecte les informations que vous nous fournissez directement, 
            telles que votre nom, adresse e-mail, informations de profil professionnel, 
            et toute autre information que vous choisissez de partager.
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            2. Utilisation des informations
          </Text>
          <Text style={[styles.paragraph, { color: themeColors.text }]}>
            Nous utilisons vos informations pour :
          </Text>
          <Text style={[styles.bulletPoint, { color: themeColors.text }]}>
            • Fournir et améliorer nos services
          </Text>
          <Text style={[styles.bulletPoint, { color: themeColors.text }]}>
            • Faciliter la mise en relation entre candidats et employeurs
          </Text>
          <Text style={[styles.bulletPoint, { color: themeColors.text }]}>
            • Envoyer des notifications importantes
          </Text>
          <Text style={[styles.bulletPoint, { color: themeColors.text }]}>
            • Assurer la sécurité de la plateforme
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            3. Partage des informations
          </Text>
          <Text style={[styles.paragraph, { color: themeColors.text }]}>
            Nous ne vendons, n&apos;échangeons ni ne louons vos informations personnelles 
            à des tiers. Nous pouvons partager vos informations uniquement dans les cas suivants :
          </Text>
          <Text style={[styles.bulletPoint, { color: themeColors.text }]}>
            • Avec votre consentement explicite
          </Text>
          <Text style={[styles.bulletPoint, { color: themeColors.text }]}>
            • Pour se conformer aux obligations légales
          </Text>
          <Text style={[styles.bulletPoint, { color: themeColors.text }]}>
            • Pour protéger nos droits et notre sécurité
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            4. Sécurité des données
          </Text>
          <Text style={[styles.paragraph, { color: themeColors.text }]}>
            Nous mettons en place des mesures de sécurité appropriées pour protéger 
            vos informations personnelles contre l&apos;accès non autorisé, la modification, 
            la divulgation ou la destruction.
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            5. Vos droits
          </Text>
          <Text style={[styles.paragraph, { color: themeColors.text }]}>
            Vous avez le droit de :
          </Text>
          <Text style={[styles.bulletPoint, { color: themeColors.text }]}>
            • Accéder à vos informations personnelles
          </Text>
          <Text style={[styles.bulletPoint, { color: themeColors.text }]}>
            • Corriger ou mettre à jour vos informations
          </Text>
          <Text style={[styles.bulletPoint, { color: themeColors.text }]}>
            • Supprimer votre compte
          </Text>
          <Text style={[styles.bulletPoint, { color: themeColors.text }]}>
            • Vous opposer au traitement de vos données
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            6. Contact
          </Text>
          <Text style={[styles.paragraph, { color: themeColors.text }]}>
            Pour toute question concernant cette politique de confidentialité, 
            veuillez nous contacter à : privacy@osefbenin.com
          </Text>
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
  title: {
    ...typography.h2,
    marginBottom: spacing.sm,
  },
  lastUpdated: {
    fontSize: 14,
    marginBottom: spacing.xl,
    fontStyle: 'italic',
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h3,
    marginBottom: spacing.md,
  },
  paragraph: {
    ...typography.body,
    lineHeight: 24,
    marginBottom: spacing.md,
  },
  bulletPoint: {
    ...typography.body,
    lineHeight: 24,
    marginBottom: spacing.xs,
    marginLeft: spacing.md,
  },
});
