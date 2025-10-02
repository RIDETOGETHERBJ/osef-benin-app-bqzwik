
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useColorScheme,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import Card from '../components/Card';
import Header from '../components/Header';
import Button from '../components/Button';
import { colors, spacing, typography, borderRadius } from '../styles/commonStyles';
import { PerformanceMonitor } from '../utils/performanceMonitor';
import { ErrorLogger } from '../utils/errorLogger';
import { OfflineManager } from '../utils/offlineManager';

export default function DevToolsScreen() {
  const [performanceLogs, setPerformanceLogs] = useState<any[]>([]);
  const [errorLogs, setErrorLogs] = useState<any[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  const colorScheme = useColorScheme();
  const themeColors = colors[colorScheme || 'light'];

  useEffect(() => {
    loadLogs();
    
    // Listen to network status
    const removeListener = OfflineManager.addNetworkListener(setIsOnline);
    return removeListener;
  }, []);

  const loadLogs = async () => {
    const perfLogs = await PerformanceMonitor.getLogs();
    const errLogs = await ErrorLogger.getLogs();
    setPerformanceLogs(perfLogs.slice(0, 10)); // Show last 10
    setErrorLogs(errLogs.slice(0, 10)); // Show last 10
  };

  const clearAllLogs = () => {
    Alert.alert(
      'Effacer tous les logs',
      'Êtes-vous sûr de vouloir effacer tous les logs de performance et d\'erreur ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Effacer',
          style: 'destructive',
          onPress: async () => {
            await PerformanceMonitor.clearLogs();
            await ErrorLogger.clearLogs();
            setPerformanceLogs([]);
            setErrorLogs([]);
            Alert.alert('Succès', 'Tous les logs ont été effacés');
          },
        },
      ]
    );
  };

  const exportLogs = async () => {
    try {
      const perfLogs = await PerformanceMonitor.getLogs();
      const errLogs = await ErrorLogger.getLogs();
      
      const exportData = {
        timestamp: new Date().toISOString(),
        performance: perfLogs,
        errors: errLogs,
        networkStatus: isOnline,
      };

      console.log('Exported logs:', JSON.stringify(exportData, null, 2));
      Alert.alert('Logs exportés', 'Les logs ont été exportés dans la console');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'exporter les logs');
    }
  };

  const formatDuration = (duration: number) => {
    if (duration < 1000) {
      return `${duration}ms`;
    }
    return `${(duration / 1000).toFixed(2)}s`;
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('fr-FR');
  };

  const getPerformanceColor = (duration: number) => {
    if (duration < 100) return themeColors.success;
    if (duration < 500) return themeColors.warning;
    return themeColors.error;
  };

  const StatusCard = ({ title, value, color, icon }: {
    title: string;
    value: string;
    color: string;
    icon: string;
  }) => (
    <Card style={styles.statusCard}>
      <View style={[styles.statusIcon, { backgroundColor: color }]}>
        <IconSymbol name={icon as any} size={20} color="#FFFFFF" />
      </View>
      <View style={styles.statusInfo}>
        <Text style={[styles.statusValue, { color: themeColors.text }]}>
          {value}
        </Text>
        <Text style={[styles.statusTitle, { color: themeColors.textSecondary }]}>
          {title}
        </Text>
      </View>
    </Card>
  );

  if (!__DEV__) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
        <Header
          title="Outils de développement"
          leftIcon="arrow-back"
          onLeftPress={() => router.back()}
        />
        <View style={styles.notAvailable}>
          <IconSymbol name="code-off" size={64} color={themeColors.textSecondary} />
          <Text style={[styles.notAvailableText, { color: themeColors.text }]}>
            Outils de développement non disponibles
          </Text>
          <Text style={[styles.notAvailableSubtext, { color: themeColors.textSecondary }]}>
            Ces outils ne sont disponibles qu&apos;en mode développement
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Header
        title="Outils de développement"
        leftIcon="arrow-back"
        onLeftPress={() => router.back()}
      />
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Status Overview */}
        <View style={styles.statusGrid}>
          <StatusCard
            title="Réseau"
            value={isOnline ? 'En ligne' : 'Hors ligne'}
            color={isOnline ? themeColors.success : themeColors.error}
            icon={isOnline ? 'wifi' : 'wifi-off'}
          />
          <StatusCard
            title="Logs de performance"
            value={performanceLogs.length.toString()}
            color={themeColors.info}
            icon="speed"
          />
          <StatusCard
            title="Logs d'erreur"
            value={errorLogs.length.toString()}
            color={errorLogs.length > 0 ? themeColors.warning : themeColors.success}
            icon="bug-report"
          />
        </View>

        {/* Actions */}
        <Card style={styles.actionsCard}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            Actions
          </Text>
          <View style={styles.actionsGrid}>
            <Button
              title="Actualiser les logs"
              onPress={loadLogs}
              variant="outline"
              style={styles.actionButton}
            />
            <Button
              title="Exporter les logs"
              onPress={exportLogs}
              variant="outline"
              style={styles.actionButton}
            />
            <Button
              title="Effacer tous les logs"
              onPress={clearAllLogs}
              variant="outline"
              style={[styles.actionButton, { borderColor: themeColors.error }]}
              textStyle={{ color: themeColors.error }}
            />
          </View>
        </Card>

        {/* Performance Logs */}
        <Card style={styles.logsCard}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            Logs de performance (10 derniers)
          </Text>
          {performanceLogs.length > 0 ? (
            performanceLogs.map((log, index) => (
              <View key={index} style={styles.logItem}>
                <View style={styles.logHeader}>
                  <Text style={[styles.logName, { color: themeColors.text }]}>
                    {log.name}
                  </Text>
                  <Text style={[
                    styles.logDuration,
                    { color: getPerformanceColor(log.duration) }
                  ]}>
                    {formatDuration(log.duration)}
                  </Text>
                </View>
                <Text style={[styles.logTime, { color: themeColors.textSecondary }]}>
                  {formatTime(log.timestamp)}
                </Text>
              </View>
            ))
          ) : (
            <Text style={[styles.noLogs, { color: themeColors.textSecondary }]}>
              Aucun log de performance
            </Text>
          )}
        </Card>

        {/* Error Logs */}
        <Card style={styles.logsCard}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            Logs d&apos;erreur (10 derniers)
          </Text>
          {errorLogs.length > 0 ? (
            errorLogs.map((log, index) => (
              <View key={index} style={styles.logItem}>
                <View style={styles.logHeader}>
                  <Text style={[styles.logName, { color: themeColors.text }]}>
                    {log.message}
                  </Text>
                  <View style={[
                    styles.logLevel,
                    { backgroundColor: log.level === 'error' ? themeColors.error : themeColors.warning }
                  ]}>
                    <Text style={styles.logLevelText}>
                      {log.level.toUpperCase()}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.logTime, { color: themeColors.textSecondary }]}>
                  {formatTime(log.timestamp)}
                </Text>
              </View>
            ))
          ) : (
            <Text style={[styles.noLogs, { color: themeColors.textSecondary }]}>
              Aucun log d&apos;erreur
            </Text>
          )}
        </Card>
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
  notAvailable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  notAvailableText: {
    ...typography.h2,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  notAvailableSubtext: {
    ...typography.body,
    textAlign: 'center',
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  statusCard: {
    flex: 1,
    minWidth: '30%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  statusIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  statusInfo: {
    flex: 1,
  },
  statusValue: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  statusTitle: {
    fontSize: 12,
  },
  actionsCard: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    marginBottom: spacing.md,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
    minWidth: '45%',
  },
  logsCard: {
    marginBottom: spacing.lg,
  },
  logItem: {
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  logName: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    marginRight: spacing.sm,
  },
  logDuration: {
    fontSize: 12,
    fontWeight: '600',
  },
  logLevel: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  logLevelText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  logTime: {
    fontSize: 12,
  },
  noLogs: {
    ...typography.body,
    textAlign: 'center',
    paddingVertical: spacing.lg,
    fontStyle: 'italic',
  },
});
