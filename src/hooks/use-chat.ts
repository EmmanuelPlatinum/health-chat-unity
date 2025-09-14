import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Conversation, Message, MessageForm } from '@/types';
import { ChatService } from '@/services/chat.service';

export const useChat = (userId: string, userType: string) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar conversas
  const loadConversations = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await ChatService.getConversations(userId);
      if (response.success) {
        setConversations(response.data.data);
      } else {
        setError(response.error || 'Erro ao carregar conversas');
      }
    } catch (err) {
      setError('Erro inesperado ao carregar conversas');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Carregar mensagens de uma conversa
  const loadMessages = useCallback(async (conversationId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await ChatService.getMessages(conversationId);
      if (response.success) {
        setMessages(response.data.data);
      } else {
        setError(response.error || 'Erro ao carregar mensagens');
      }
    } catch (err) {
      setError('Erro inesperado ao carregar mensagens');
    } finally {
      setLoading(false);
    }
  }, []);

  // Enviar mensagem
  const sendMessage = useCallback(async (messageData: MessageForm) => {
    if (!activeConversation) return;

    setLoading(true);
    setError(null);
    
    try {
      const response = await ChatService.sendMessage(
        activeConversation.id,
        messageData,
        userId,
        'Você' // Nome do usuário atual
      );
      
      if (response.success) {
        setMessages(prev => [...prev, response.data]);
        // Atualizar conversa na lista
        setConversations(prev => 
          prev.map(conv => 
            conv.id === activeConversation.id 
              ? { ...conv, updated_at: new Date().toISOString() }
              : conv
          )
        );
      } else {
        setError(response.error || 'Erro ao enviar mensagem');
      }
    } catch (err) {
      setError('Erro inesperado ao enviar mensagem');
    } finally {
      setLoading(false);
    }
  }, [activeConversation, userId]);

  // Selecionar conversa
  const selectConversation = useCallback(async (conversation: Conversation) => {
    setActiveConversation(conversation);
    await loadMessages(conversation.id);
    
    // Marcar como lida se for atendente/gerente
    if (userType !== 'paciente') {
      await ChatService.markAsRead(conversation.id, userId);
    }
  }, [loadMessages, userType, userId]);

  // Criar nova conversa
  const createConversation = useCallback(async (
    patientName: string,
    patientPhone: string,
    channel: string
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await ChatService.createConversation(
        userId,
        patientName,
        patientPhone,
        channel
      );
      
      if (response.success) {
        setConversations(prev => [response.data, ...prev]);
        setActiveConversation(response.data);
        setMessages([]);
      } else {
        setError(response.error || 'Erro ao criar conversa');
      }
    } catch (err) {
      setError('Erro inesperado ao criar conversa');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Atribuir conversa (para gerentes)
  const assignConversation = useCallback(async (conversationId: string, attendantId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await ChatService.assignConversation(conversationId, attendantId);
      
      if (response.success) {
        setConversations(prev => 
          prev.map(conv => 
            conv.id === conversationId 
              ? { ...conv, assigned_to: attendantId }
              : conv
          )
        );
      } else {
        setError(response.error || 'Erro ao atribuir conversa');
      }
    } catch (err) {
      setError('Erro inesperado ao atribuir conversa');
    } finally {
      setLoading(false);
    }
  }, []);

  // Atualizar status da conversa
  const updateConversationStatus = useCallback(async (conversationId: string, status: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await ChatService.updateConversationStatus(conversationId, status);
      
      if (response.success) {
        setConversations(prev => 
          prev.map(conv => 
            conv.id === conversationId 
              ? { ...conv, status }
              : conv
          )
        );
      } else {
        setError(response.error || 'Erro ao atualizar status');
      }
    } catch (err) {
      setError('Erro inesperado ao atualizar status');
    } finally {
      setLoading(false);
    }
  }, []);

  // Configurar real-time para mensagens
  useEffect(() => {
    if (!activeConversation) return;

    const channel = supabase
      .channel(`conversation:${activeConversation.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'conversation_messages',
          filter: `conversation_id=eq.${activeConversation.id}`
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages(prev => [...prev, newMessage]);
          
          // Atualizar timestamp da conversa
          setConversations(prev => 
            prev.map(conv => 
              conv.id === activeConversation.id 
                ? { ...conv, updated_at: new Date().toISOString() }
                : conv
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeConversation]);

  // Configurar real-time para conversas
  useEffect(() => {
    const channel = supabase
      .channel('conversations')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations'
        },
        () => {
          loadConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadConversations]);

  // Carregar conversas na inicialização
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  return {
    conversations,
    activeConversation,
    messages,
    loading,
    error,
    selectConversation,
    sendMessage,
    createConversation,
    assignConversation,
    updateConversationStatus,
    loadConversations,
    clearError: () => setError(null)
  };
};
