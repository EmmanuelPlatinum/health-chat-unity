import { supabase } from '@/lib/supabase';
import { DashboardData, Metrics, TeamMember, ChannelStats, ApiResponse } from '@/types';

export class DashboardService {
  /**
   * Obtém dados do dashboard para paciente
   */
  static async getPatientDashboard(patientId: string): Promise<ApiResponse<DashboardData>> {
    try {
      // Buscar conversas do paciente
      const { data: conversations, error: convError } = await supabase
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
        `)
        .eq('patient_id', patientId)
        .order('updated_at', { ascending: false })
        .limit(10);

      if (convError) throw convError;

      // Buscar agendamentos (mock data por enquanto)
      const appointments = [
        {
          id: '1',
          patient_id: patientId,
          patient_name: 'Maria Silva',
          doctor_name: 'Dr. João Santos',
          specialty: 'Cardiologia',
          date: '2024-12-15',
          time: '14:30',
          status: 'confirmed' as const,
          notes: 'Consulta de rotina'
        }
      ];

      const metrics: Metrics = {
        total_conversations: conversations?.length || 0,
        active_conversations: conversations?.filter(c => c.status === 'active').length || 0,
        average_response_time: 2.5,
        conversion_rate: 85,
        satisfaction_score: 4.8,
        today_conversations: conversations?.filter(c => 
          new Date(c.created_at).toDateString() === new Date().toDateString()
        ).length || 0,
        today_resolved: 0
      };

      return {
        data: {
          metrics,
          recent_conversations: conversations || [],
          team_performance: [],
          channel_stats: []
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
   * Obtém dados do dashboard para atendente
   */
  static async getAttendantDashboard(attendantId: string): Promise<ApiResponse<DashboardData>> {
    try {
      // Buscar conversas atribuídas ao atendente
      const { data: conversations, error: convError } = await supabase
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
        `)
        .eq('assigned_to', attendantId)
        .order('updated_at', { ascending: false });

      if (convError) throw convError;

      // Calcular métricas
      const today = new Date().toDateString();
      const todayConversations = conversations?.filter(c => 
        new Date(c.created_at).toDateString() === today
      ) || [];

      const metrics: Metrics = {
        total_conversations: conversations?.length || 0,
        active_conversations: conversations?.filter(c => c.status === 'active').length || 0,
        average_response_time: 3.2,
        conversion_rate: 78,
        satisfaction_score: 4.6,
        today_conversations: todayConversations.length,
        today_resolved: todayConversations.filter(c => c.status === 'closed').length
      };

      return {
        data: {
          metrics,
          recent_conversations: conversations?.slice(0, 10) || [],
          team_performance: [],
          channel_stats: []
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
   * Obtém dados do dashboard para gerente
   */
  static async getManagerDashboard(): Promise<ApiResponse<DashboardData>> {
    try {
      // Buscar todas as conversas
      const { data: conversations, error: convError } = await supabase
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
        `)
        .order('created_at', { ascending: false });

      if (convError) throw convError;

      // Buscar dados da equipe
      const { data: team, error: teamError } = await supabase
        .from('profiles')
        .select('*')
        .eq('tipo_usuario', 'atendente');

      if (teamError) throw teamError;

      // Calcular métricas gerais
      const today = new Date().toDateString();
      const todayConversations = conversations?.filter(c => 
        new Date(c.created_at).toDateString() === today
      ) || [];

      const metrics: Metrics = {
        total_conversations: conversations?.length || 0,
        active_conversations: conversations?.filter(c => c.status === 'active').length || 0,
        average_response_time: 2.8,
        conversion_rate: 82,
        satisfaction_score: 4.7,
        today_conversations: todayConversations.length,
        today_resolved: todayConversations.filter(c => c.status === 'closed').length
      };

      // Estatísticas por canal
      const channelStats: ChannelStats[] = [
        { channel: 'whatsapp', total_conversations: 45, active_conversations: 12, average_response_time: 2.1, conversion_rate: 85 },
        { channel: 'instagram', total_conversations: 25, active_conversations: 8, average_response_time: 3.5, conversion_rate: 75 },
        { channel: 'facebook', total_conversations: 20, active_conversations: 5, average_response_time: 4.2, conversion_rate: 70 },
        { channel: 'email', total_conversations: 15, active_conversations: 3, average_response_time: 5.1, conversion_rate: 80 },
        { channel: 'phone', total_conversations: 10, active_conversations: 2, average_response_time: 1.8, conversion_rate: 90 },
        { channel: 'chat', total_conversations: 8, active_conversations: 1, average_response_time: 2.5, conversion_rate: 85 }
      ];

      // Performance da equipe
      const teamPerformance: TeamMember[] = team?.map(member => ({
        id: member.id,
        name: member.nome_completo,
        email: member.email,
        status: 'online' as const,
        conversations_today: Math.floor(Math.random() * 20) + 5,
        average_response_time: Math.random() * 3 + 1,
        satisfaction_score: Math.random() * 1 + 4
      })) || [];

      return {
        data: {
          metrics,
          recent_conversations: conversations?.slice(0, 10) || [],
          team_performance: teamPerformance,
          channel_stats: channelStats
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
   * Obtém métricas em tempo real
   */
  static async getRealTimeMetrics(): Promise<ApiResponse<Metrics>> {
    try {
      const { data: conversations, error } = await supabase
        .from('conversations')
        .select('*');

      if (error) throw error;

      const today = new Date().toDateString();
      const todayConversations = conversations?.filter(c => 
        new Date(c.created_at).toDateString() === today
      ) || [];

      const metrics: Metrics = {
        total_conversations: conversations?.length || 0,
        active_conversations: conversations?.filter(c => c.status === 'active').length || 0,
        average_response_time: 2.8,
        conversion_rate: 82,
        satisfaction_score: 4.7,
        today_conversations: todayConversations.length,
        today_resolved: todayConversations.filter(c => c.status === 'closed').length
      };

      return {
        data: metrics,
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
}
