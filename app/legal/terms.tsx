
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

export default function TermsScreen() {
  const colorScheme = useColorScheme();
  const themeColors = colors[colorScheme || 'light'];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Header
        title="Conditions d'utilisation"
        leftIcon="arrow-back"
        onLeftPress={() => router.back()}
      />
      
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: themeColors.text }]}>
          Conditions d&apos;utilisation OSEF BENIN
        </Text>
        
        <Text style={[styles.lastUpdated, { color: themeColors.textSecondary }]}>
          Dernière mise à jour : 15 janvier 2024
        </Text>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            1. Acceptation des conditions
          </Text>
          <Text style={[styles.paragraph, { color: themeColors.text }]}>
            En utilisant l&apos;application OSEF BENIN, vous acceptez d&apos;être lié par ces 
            conditions d&apos;utilisation. Si vous n&apos;acceptez pas ces conditions, 
            veuillez ne pas utiliser notre service.
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            2. Description du service
          </Text>
          <Text style={[styles.paragraph, { color: themeColors.text }]}>
            OSEF BENIN est une plateforme de mise en relation entre candidats, 
            employeurs et formateurs au Bénin. Nous facilitons la recherche d&apos;emploi, 
            le recrutement et l&apos;accès à la formation professionnelle.
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            3. Inscription et compte utilisateur
          </Text>
          <Text style={[styles.paragraph, { color: themeColors.text }]}>
            Pour utiliser certaines fonctionnalités, vous devez créer un compte. 
            Vous êtes responsable de :
          </Text>
          <Text style={[styles.bulletPoint, { color: themeColors.text }]}>
            • Fournir des informations exactes et à jour
          </Text>
          <Text style={[styles.bulletPoint, { color: themeColors.text }]}>
            • Maintenir la sécurité de votre mot de passe
          </Text>
          <Text style={[styles.bulletPoint, { color: themeColors.text }]}>
            • Toutes les activités sous votre compte
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            4. Utilisation acceptable
          </Text>
          <Text style={[styles.paragraph, { color: themeColors.text }]}>
            Vous vous engagez à ne pas :
          </Text>
          <Text style={[styles.bulletPoint, { color: themeColors.text }]}>
            • Publier de contenu illégal, offensant ou trompeur
          </Text>
          <Text style={[styles.bulletPoint, { color: themeColors.text }]}>
            • Harceler ou discriminer d&apos;autres utilisateurs
          </Text>
          <Text style={[styles.bulletPoint, { color: themeColors.text }]}>
            • Utiliser le service à des fins commerciales non autorisées
          </Text>
          <Text style={[styles.bulletPoint, { color: themeColors.text }]}>
            • Tenter de compromettre la sécurité du système
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            5. Propriété intellectuelle
          </Text>
          <Text style={[styles.paragraph, { color: themeColors.text }]}>
            Le contenu de l&apos;application, y compris les textes, graphiques, logos, 
            et logiciels, est protégé par les droits d&apos;auteur et autres droits 
            de propriété intellectuelle.
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            6. Limitation de responsabilité
          </Text>
          <Text style={[styles.paragraph, { color: themeColors.text }]}>
            OSEF BENIN ne peut être tenu responsable des dommages directs ou indirects 
            résultant de l&apos;utilisation de notre service. Nous ne garantissons pas 
            que le service sera ininterrompu ou exempt d&apos;erreurs.
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            7. Modifications des conditions
          </Text>
          <Text style={[styles.paragraph, { color: themeColors.text }]}>
            Nous nous réservons le droit de modifier ces conditions à tout moment. 
            Les modifications prendront effet dès leur publication sur l&apos;application.
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            8. Contact
          </Text>
          <Text style={[styles.paragraph, { color: themeColors.text }]}>
            Pour toute question concernant ces conditions d&apos;utilisation, 
            veuillez nous contacter à : legal@osefbenin.com
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
