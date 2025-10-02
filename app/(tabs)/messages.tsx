
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  useColorScheme,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import Input from '../../components/Input';
import Header from '../../components/Header';
import { colors, spacing, typography, borderRadius } from '../../styles/commonStyles';

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  avatar?: string;
  isOnline: boolean;
  type: 'individual' | 'group';
}

// Mock data - replace with real data from Supabase
const mockChats: Chat[] = [
  {
    id: '1',
    name: 'TechCorp Bénin',
    lastMessage: 'Merci pour votre candidature. Nous aimerions programmer un entretien.',
    lastMessageTime: '10:30',
    unreadCount: 2,
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face',
    isOnline: true,
    type: 'individual',
  },
  {
    id: '2',
    name: 'Marie Kouassi',
    lastMessage: 'Bonjour, j\'ai vu votre profil et j\'aimerais discuter d\'une opportunité.',
    lastMessageTime: '09:15',
    unreadCount: 0,
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    isOnline: false,
    type: 'individual',
  },
  {
    id: '3',
    name: 'Creative Studio',
    lastMessage: 'Votre portfolio est impressionnant !',
    lastMessageTime: 'Hier',
    unreadCount: 1,
    avatar: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=100&h=100&fit=crop&crop=face',
    isOnline: true,
    type: 'individual',
  },
  {
    id: '4',
    name: 'Groupe Développeurs Bénin',
    lastMessage: 'Jean: Quelqu\'un connaît une bonne formation React ?',
    lastMessageTime: 'Hier',
    unreadCount: 5,
    avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=100&h=100&fit=crop&crop=face',
    isOnline: false,
    type: 'group',
  },
  {
    id: '5',
    name: 'Digital Solutions',
    lastMessage: 'Parfait, à bientôt !',
    lastMessageTime: '2 jours',
    unreadCount: 0,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    isOnline: false,
    type: 'individual',
  },
];

export default function MessagesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredChats, setFilteredChats] = useState(mockChats);
  const colorScheme = useColorScheme();
  const themeColors = colors[colorScheme || 'light'];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredChats(mockChats);
    } else {
      const filtered = mockChats.filter(
        chat =>
          chat.name.toLowerCase().includes(query.toLowerCase()) ||
          chat.lastMessage.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredChats(filtered);
    }
  };

  const formatTime = (time: string) => {
    // Simple time formatting - in real app, use proper date formatting
    return time;
  };

  const renderChatItem = ({ item }: { item: Chat }) => (
    <TouchableOpacity
      style={[styles.chatItem, { backgroundColor: themeColors.card }]}
      onPress={() => router.push(`/(tabs)/messages/${item.id}`)}
      activeOpacity={0.7}
    >
      <View style={styles.avatarContainer}>
        {item.avatar ? (
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatarPlaceholder, { backgroundColor: themeColors.primary }]}>
            <Text style={styles.avatarText}>
              {item.name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        {item.isOnline && <View style={[styles.onlineIndicator, { backgroundColor: themeColors.success }]} />}
        {item.type === 'group' && (
          <View style={[styles.groupIndicator, { backgroundColor: themeColors.accent }]}>
            <IconSymbol name="group" size={12} color="#FFFFFF" />
          </View>
        )}
      </View>
      
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={[styles.chatName, { color: themeColors.text }]} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={[styles.chatTime, { color: themeColors.textSecondary }]}>
            {formatTime(item.lastMessageTime)}
          </Text>
        </View>
        
        <View style={styles.chatFooter}>
          <Text
            style={[
              styles.lastMessage,
              {
                color: item.unreadCount > 0 ? themeColors.text : themeColors.textSecondary,
                fontWeight: item.unreadCount > 0 ? '600' : 'normal',
              },
            ]}
            numberOfLines={1}
          >
            {item.lastMessage}
          </Text>
          {item.unreadCount > 0 && (
            <View style={[styles.unreadBadge, { backgroundColor: themeColors.primary }]}>
              <Text style={styles.unreadCount}>
                {item.unreadCount > 99 ? '99+' : item.unreadCount}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const totalUnreadCount = filteredChats.reduce((sum, chat) => sum + chat.unreadCount, 0);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Header
        title="Messages"
        rightIcon="edit"
        onRightPress={() => console.log('New message')}
      />
      
      <View style={styles.searchContainer}>
        <Input
          placeholder="Rechercher une conversation..."
          value={searchQuery}
          onChangeText={handleSearch}
          leftIcon="search"
          containerStyle={styles.searchInput}
        />
      </View>
      
      {totalUnreadCount > 0 && (
        <View style={styles.unreadSummary}>
          <Text style={[styles.unreadSummaryText, { color: themeColors.textSecondary }]}>
            {totalUnreadCount} message{totalUnreadCount > 1 ? 's' : ''} non lu{totalUnreadCount > 1 ? 's' : ''}
          </Text>
        </View>
      )}
      
      <FlatList
        data={filteredChats}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.chatsList}
        ItemSeparatorComponent={() => (
          <View style={[styles.separator, { backgroundColor: themeColors.border }]} />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  searchInput: {
    marginBottom: 0,
  },
  unreadSummary: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  unreadSummaryText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  chatsList: {
    paddingBottom: 100, // Space for floating tab bar
  },
  chatItem: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: spacing.md,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  groupIndicator: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  chatName: {
    ...typography.h3,
    fontSize: 16,
    flex: 1,
    marginRight: spacing.sm,
  },
  chatTime: {
    fontSize: 12,
  },
  chatFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    flex: 1,
    marginRight: spacing.sm,
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
  },
  unreadCount: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  separator: {
    height: 1,
    marginLeft: spacing.lg + 50 + spacing.md, // Align with chat content
  },
});
