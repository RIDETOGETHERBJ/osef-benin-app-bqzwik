
import { useState, useEffect, useCallback } from 'react';
import { supabase, Message } from '../config/supabase';
import { useAuthStore } from '../store/userStore';

export const useMessages = (otherUserId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  const fetchMessages = useCallback(async () => {
    if (!user || !otherUserId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('message')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) {
        console.log('Error fetching messages:', error.message);
        setError(error.message);
      } else {
        setMessages(data || []);
        
        // Mark messages as read
        await supabase
          .from('message')
          .update({ is_read: true })
          .eq('sender_id', otherUserId)
          .eq('receiver_id', user.id)
          .eq('is_read', false);
      }
    } catch (err: any) {
      console.log('Exception fetching messages:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user, otherUserId]);

  const sendMessage = async (content: string) => {
    if (!user || !otherUserId || !content.trim()) return;

    try {
      const { data, error } = await supabase
        .from('message')
        .insert([{
          sender_id: user.id,
          receiver_id: otherUserId,
          content: content.trim(),
          is_read: false,
        }])
        .select()
        .single();

      if (error) {
        console.log('Error sending message:', error.message);
        return { error: error.message };
      }

      if (data) {
        setMessages(prev => [...prev, data]);
      }

      return { success: true };
    } catch (err: any) {
      console.log('Exception sending message:', err.message);
      return { error: err.message };
    }
  };

  useEffect(() => {
    fetchMessages();

    // Set up real-time subscription
    if (user && otherUserId) {
      const subscription = supabase
        .channel(`messages-${user.id}-${otherUserId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'message',
            filter: `or(and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id}))`,
          },
          (payload) => {
            console.log('New message in conversation:', payload);
            setMessages(prev => [...prev, payload.new as Message]);
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user, otherUserId, fetchMessages]);

  return { messages, loading, error, sendMessage, refetch: fetchMessages };
};
