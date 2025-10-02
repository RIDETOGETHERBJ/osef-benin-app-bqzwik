
import { useState, useEffect } from 'react';
import { supabase, Message } from '../config/supabase';
import { useAuthStore } from '../store/userStore';

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  avatar?: string;
  isOnline: boolean;
  type: 'individual' | 'group';
  otherUserId?: string;
}

export const useChats = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  const fetchChats = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Get all messages where user is sender or receiver
      const { data: messages, error } = await supabase
        .from('message')
        .select(`
          *,
          sender:sender_id (
            id,
            userprofile (
              full_name,
              avatar_url
            )
          ),
          receiver:receiver_id (
            id,
            userprofile (
              full_name,
              avatar_url
            )
          )
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) {
        console.log('Error fetching messages:', error.message);
        setError(error.message);
        return;
      }

      // Group messages by conversation
      const chatMap = new Map<string, Chat>();
      
      messages?.forEach((message: any) => {
        const isFromMe = message.sender_id === user.id;
        const otherUser = isFromMe ? message.receiver : message.sender;
        const otherUserId = isFromMe ? message.receiver_id : message.sender_id;
        
        if (!otherUser?.userprofile) return;
        
        const chatId = [user.id, otherUserId].sort().join('-');
        
        if (!chatMap.has(chatId)) {
          chatMap.set(chatId, {
            id: chatId,
            name: otherUser.userprofile.full_name || 'Utilisateur',
            lastMessage: message.content,
            lastMessageTime: message.created_at,
            unreadCount: 0,
            avatar: otherUser.userprofile.avatar_url,
            isOnline: false, // TODO: implement online status
            type: 'individual',
            otherUserId: otherUserId,
          });
        }
        
        // Count unread messages
        if (!message.is_read && message.sender_id !== user.id) {
          const chat = chatMap.get(chatId)!;
          chat.unreadCount++;
        }
      });

      setChats(Array.from(chatMap.values()));
    } catch (err: any) {
      console.log('Exception fetching chats:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();

    // Set up real-time subscription for new messages
    if (user) {
      const subscription = supabase
        .channel('messages')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'message',
            filter: `receiver_id=eq.${user.id}`,
          },
          () => {
            console.log('New message received, refreshing chats');
            fetchChats();
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user]);

  return { chats, loading, error, refetch: fetchChats };
};
