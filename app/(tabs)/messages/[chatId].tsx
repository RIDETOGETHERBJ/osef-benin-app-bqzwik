
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  useColorScheme,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import Header from '../../../components/Header';
import { colors, spacing, typography, borderRadius } from '../../../styles/commonStyles';
import { useMessages } from '../../../hooks/useMessages';
import { useAuthStore } from '../../../store/userStore';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'file';
  isMe: boolean;
}

// Mock data - replace with real data from Supabase
const mockMessages: Message[] = [
  {
    id: '1',
    senderId: 'user1',
    senderName: 'TechCorp Bénin',
    content: 'Bonjour ! Nous avons reçu votre candidature pour le poste de développeur React Native.',
    timestamp: '2024-01-15T09:00:00Z',
    type: 'text',
    isMe: false,
  },
  {
    id: '2',
    senderId: 'me',
    senderName: 'Moi',
    content: 'Bonjour ! Merci pour votre retour rapide. Je suis très intéressé par cette opportunité.',
    timestamp: '2024-01-15T09:05:00Z',
    type: 'text',
    isMe: true,
  },
  {
    id: '3',
    senderId: 'user1',
    senderName: 'TechCorp Bénin',
    content: 'Parfait ! Votre profil correspond exactement à ce que nous recherchons. Pourriez-vous nous parler de votre expérience avec React Native ?',
    timestamp: '2024-01-15T09:10:00Z',
    type: 'text',
    isMe: false,
  },
  {
    id: '4',
    senderId: 'me',
    senderName: 'Moi',
    content: 'J\'ai 3 ans d\'expérience en développement React Native. J\'ai travaillé sur plusieurs applications mobiles, notamment une app de e-commerce et une app de gestion de tâches.',
    timestamp: '2024-01-15T09:15:00Z',
    type: 'text',
    isMe: true,
  },
  {
    id: '5',
    senderId: 'user1',
    senderName: 'TechCorp Bénin',
    content: 'Excellent ! Nous aimerions programmer un entretien avec vous. Êtes-vous disponible cette semaine ?',
    timestamp: '2024-01-15T10:30:00Z',
    type: 'text',
    isMe: false,
  },
];

export default function ChatScreen() {
  const { chatId } = useLocalSearchParams();
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const colorScheme = useColorScheme();
  const themeColors = colors[colorScheme || 'light'];
  const { user } = useAuthStore();
  const { messages, sendMessage: sendMessageToDb, loading } = useMessages(chatId as string);

  // Mock chat info - replace with real data
  const chatInfo = {
    id: chatId,
    name: 'TechCorp Bénin',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face',
    isOnline: true,
    type: 'individual' as const,
  };

  useEffect(() => {
    // Scroll to bottom when messages change
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Aujourd\'hui';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Hier';
    } else {
      return date.toLocaleDateString('fr-FR');
    }
  };

  const sendMessage = async () => {
    if (newMessage.trim() === '' || !chatId) return;

    const messageContent = newMessage.trim();
    setNewMessage('');

    const result = await sendMessageToDb(messageContent);
    if (result?.error) {
      console.log('Error sending message:', result.error);
      // Restore message on error
      setNewMessage(messageContent);
    }
  };

  const renderMessage = ({ item, index }: { item: any; index: number }) => {
    const isMe = item.sender_id === user?.id;
    const previousMessage = index > 0 ? messages[index - 1] : null;
    const showDate = !previousMessage || 
      formatDate(item.created_at) !== formatDate(previousMessage.created_at);
    const showAvatar = !isMe && (!previousMessage || previousMessage.sender_id === user?.id || previousMessage.sender_id !== item.sender_id);

    return (
      <View>
        {showDate && (
          <View style={styles.dateContainer}>
            <Text style={[styles.dateText, { color: themeColors.textSecondary }]}>
              {formatDate(item.created_at)}
            </Text>
          </View>
        )}
        
        <View style={[
          styles.messageContainer,
          isMe ? styles.myMessageContainer : styles.otherMessageContainer,
        ]}>
          {!isMe && showAvatar && (
            <View style={[styles.messageAvatar, { backgroundColor: themeColors.primary }]}>
              <Text style={styles.avatarText}>
                {chatInfo.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          {!isMe && !showAvatar && <View style={styles.avatarSpacer} />}
          
          <View style={[
            styles.messageBubble,
            {
              backgroundColor: isMe ? themeColors.primary : themeColors.card,
              maxWidth: '75%',
            },
          ]}>
            <Text style={[
              styles.messageText,
              { color: isMe ? '#FFFFFF' : themeColors.text },
            ]}>
              {item.content}
            </Text>
            <Text style={[
              styles.messageTime,
              { color: isMe ? 'rgba(255,255,255,0.7)' : themeColors.textSecondary },
            ]}>
              {formatTime(item.created_at)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderTypingIndicator = () => {
    if (!isTyping) return null;

    return (
      <View style={styles.typingContainer}>
        <Image source={{ uri: chatInfo.avatar }} style={styles.messageAvatar} />
        <View style={[styles.typingBubble, { backgroundColor: themeColors.card }]}>
          <Text style={[styles.typingText, { color: themeColors.textSecondary }]}>
            {chatInfo.name} est en train d&apos;écrire...
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Header
        title={chatInfo.name}
        leftIcon="arrow-back"
        onLeftPress={() => router.back()}
        rightIcon="call"
        onRightPress={() => console.log('Call')}
      />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <FlatList
          ref={flatListRef}
          data={messages.length > 0 ? messages : mockMessages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messagesList}
          ListFooterComponent={renderTypingIndicator}
        />
        
        <View style={[styles.inputContainer, { backgroundColor: themeColors.card }]}>
          <TouchableOpacity
            style={styles.attachButton}
            onPress={() => console.log('Attach file')}
          >
            <IconSymbol name="attach-file" size={24} color={themeColors.textSecondary} />
          </TouchableOpacity>
          
          <TextInput
            style={[
              styles.textInput,
              {
                backgroundColor: themeColors.background,
                color: themeColors.text,
                borderColor: themeColors.border,
              },
            ]}
            placeholder="Tapez votre message..."
            placeholderTextColor={themeColors.textSecondary}
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
            maxLength={1000}
          />
          
          <TouchableOpacity
            style={[
              styles.sendButton,
              {
                backgroundColor: newMessage.trim() ? themeColors.primary : themeColors.border,
              },
            ]}
            onPress={sendMessage}
            disabled={newMessage.trim() === ''}
          >
            <IconSymbol
              name="send"
              size={20}
              color={newMessage.trim() ? '#FFFFFF' : themeColors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  messagesList: {
    paddingVertical: spacing.md,
    paddingBottom: spacing.lg,
  },
  dateContainer: {
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  dateText: {
    fontSize: 12,
    fontWeight: '500',
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  myMessageContainer: {
    justifyContent: 'flex-end',
  },
  otherMessageContainer: {
    justifyContent: 'flex-start',
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  avatarSpacer: {
    width: 32 + spacing.sm,
  },
  messageBubble: {
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: spacing.xs,
  },
  messageTime: {
    fontSize: 12,
    alignSelf: 'flex-end',
  },
  typingContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    marginVertical: spacing.xs,
  },
  typingBubble: {
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  typingText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  attachButton: {
    padding: spacing.sm,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
