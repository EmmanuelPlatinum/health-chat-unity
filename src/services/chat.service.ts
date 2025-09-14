import { supabase } from '@/lib/supabase';
import { Conversation, Message, MessageForm, ApiResponse, PaginatedResponse } from '@/types';

export class ChatService {
  /**
   * Obtém conversas do usuário
   */
  static async getConversations(userId: string, limit = 50, offset = 0): Promise<ApiResponse<PaginatedResponse<Conversation>>> {
    try {
      const { data, error, count } = await supabase
        .from('conversations')
        .select(`
          *,
          messages:conversation_messages(
            id,
            content,
            timestamp,
            sender_name,
            is_read
          )
        `, { count: 'exact' })
        .or(`patient_id.eq.${userId},assigned_to.eq.${userId}`)
        .order('updated_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      return {
        data: {
          data: data || [],
          total: count || 0,
          page: Math.floor(offset / limit) + 1,
          limit,
          hasMore: (count || 0) > offset + limit
        },
        success: true
      };
    } catch (error: any) {
      return {
        data: null as any,
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Obtém mensagens de uma conversa
   */
  static async getMessages(conversationId: string, limit = 100, offset = 0): Promise<ApiResponse<PaginatedResponse<Message>>> {
    try {
      const { data, error, count } = await supabase
        .from('conversation_messages')
        .select('*', { count: 'exact' })
        .eq('conversation_id', conversationId)
        .order('timestamp', { ascending: true })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      return {
        data: {
          data: data || [],
          total: count || 0,
          page: Math.floor(offset / limit) + 1,
          limit,
          hasMore: (count || 0) > offset + limit
        },
        success: true
      };
    } catch (error: any) {
      return {
        data: null as any,
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Envia uma mensagem
   */
  static async sendMessage(conversationId: string, messageData: MessageForm, senderId: string, senderName: string): Promise<ApiResponse<Message>> {
    try {
      const { data, error } = await supabase
        .from('conversation_messages')
        .insert({
          conversation_id: conversationId,
          sender_id: senderId,
          sender_name: senderName,
          content: messageData.content,
          timestamp: new Date().toISOString(),
          is_read: false
        })
        .select()
        .single();

      if (error) throw error;

      // Atualizar timestamp da conversa
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);

      return {
        data,
        success: true,
        message: 'Mensagem enviada com sucesso!'
      };
    } catch (error: any) {
      return {
        data: null as any,
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Cria nova conversa
   */
  static async createConversation(patientId: string, patientName: string, patientPhone: string, channel: string): Promise<ApiResponse<Conversation>> {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .insert({
          patient_id: patientId,
          patient_name: patientName,
          patient_phone: patientPhone,
          channel,
          status: 'active',
          priority: 'medium',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          unread_count: 0
        })
        .select()
        .single();

      if (error) throw error;

      return {
        data,
        success: true,
        message: 'Conversa criada com sucesso!'
      };
    } catch (error: any) {
      return {
        data: null as any,
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Marca mensagens como lidas
   */
  static async markAsRead(conversationId: string, userId: string): Promise<ApiResponse<null>> {
    try {
      const { error } = await supabase
        .from('conversation_messages')
        .update({ is_read: true })
        .eq('conversation_id', conversationId)
        .neq('sender_id', userId);

      if (error) throw error;

      // Atualizar contador de não lidas
      await supabase
        .from('conversations')
        .update({ unread_count: 0 })
        .eq('id', conversationId);

      return {
        data: null,
        success: true
      };
    } catch (error: any) {
      return {
        data: null,
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Atribui conversa a um atendente
   */
  static async assignConversation(conversationId: string, attendantId: string): Promise<ApiResponse<null>> {
    try {
      const { error } = await supabase
        .from('conversations')
        .update({ 
          assigned_to: attendantId,
          updated_at: new Date().toISOString()
        })
        .eq('id', conversationId);

      if (error) throw error;

      return {
        data: null,
        success: true,
        message: 'Conversa atribuída com sucesso!'
      };
    } catch (error: any) {
      return {
        data: null,
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Atualiza status da conversa
   */
  static async updateConversationStatus(conversationId: string, status: string): Promise<ApiResponse<null>> {
    try {
      const { error } = await supabase
        .from('conversations')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', conversationId);

      if (error) throw error;

      return {
        data: null,
        success: true,
        message: 'Status atualizado com sucesso!'
      };
    } catch (error: any) {
      return {
        data: null,
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Obtém conversas não atribuídas (para atendentes)
   */
  static async getUnassignedConversations(): Promise<ApiResponse<Conversation[]>> {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          messages:conversation_messages(
            id,
            content,
            timestamp,
            sender_name
          )
        `)
        .is('assigned_to', null)
        .eq('status', 'active')
        .order('created_at', { ascending: true });

      if (error) throw error;

      return {
        data: data || [],
        success: true
      };
    } catch (error: any) {
      return {
        data: [],
        success: false,
        error: error.message
      };
    }
  }
}
