
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  useColorScheme,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import Card from '../components/Card';
import Header from '../components/Header';
import Button from '../components/Button';
import { colors, spacing, typography, borderRadius } from '../styles/commonStyles';
import { useNotifications } from '../hooks/useNotifications';
import { Notification } from '../config/supabase';

export default function NotificationsScreen() {
  const colorScheme = useColorScheme();
  const themeColors = colors[colorScheme || 'light'];
  const { notifications, loading, markAsRead, markAllAsRead, refetch } = useNotifications();

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return 'À l\'instant';
    } else if (diffInHours < 24) {
      return `Il y a ${diffInHours}h`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `Il y a ${diffInDays}j`;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'job_application':
        return 'work';
      case 'message':
        return 'chat';
      case 'formation':
        return 'school';
      case 'system':
        return 'info';
      default:
        return 'notifications';
    }
  };

  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      onPress={() => {
        if (!item.is_read) {
          markAsRead(item.id);
        }
        // Handle navigation based on notification type
        console.log('Notification pressed:', item);
      }}
    >
      <Card style={[
        styles.notificationCard,
        !item.is_read && { backgroundColor: themeColors.highlight }
      ]}>
        <View style={styles.notificationContent}>
          <View style={[styles.iconContainer, { backgroundColor: themeColors.primary }]}>
            <IconSymbol 
              name={getNotificationIcon(item.type || 'notifications')} 
              size={20} 
              color="#FFFFFF" 
            />
          </View>
          
          <View style={styles.textContainer}>
            <Text style={[
              styles.notificationTitle, 
              { color: themeColors.text },
              !item.is_read && { fontWeight: '600' }
            ]}>
              {item.payload?.title || 'Nouvelle notification'}
            </Text>
            
            <Text style={[styles.notificationMessage, { color: themeColors.textSecondary }]}>
              {item.payload?.message || 'Vous avez une nouvelle notification'}
            </Text>
            
            <Text style={[styles.notificationTime, { color: themeColors.textSecondary }]}>
              {formatTime(item.created_at)}
            </Text>
          </View>
          
          {!item.is_read && (
            <View style={[styles.unreadDot, { backgroundColor: themeColors.primary }]} />
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <IconSymbol name="notifications-none" size={64} color={themeColors.textSecondary} />
      <Text style={[styles.emptyTitle, { color: themeColors.text }]}>
        Aucune notification
      </Text>
      <Text style={[styles.emptyMessage, { color: themeColors.textSecondary }]}>
        Vous n&apos;avez pas encore de notifications. Elles apparaîtront ici lorsque vous en recevrez.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Header
        title="Notifications"
        leftIcon="arrow-back"
        onLeftPress={() => router.back()}
        rightIcon={notifications.some(n => !n.is_read) ? "done-all" : undefined}
        onRightPress={notifications.some(n => !n.is_read) ? markAllAsRead : undefined}
      />
      
      <FlatList
        data={notifications}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
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
  listContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  notificationCard: {
    marginBottom: spacing.md,
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    marginBottom: spacing.xs,
  },
  notificationMessage: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: spacing.xs,
  },
  notificationTime: {
    fontSize: 12,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: spacing.sm,
    marginTop: spacing.xs,
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
  },
});
