// Tipos centralizados para o sistema MediChannel

export interface User {
  id: string;
  email: string;
  nome_completo: string;
  cpf: string;
  data_nascimento: string;
  telefone: string;
  tipo_usuario: UserType;
  created_at: string;
  updated_at?: string;
}

export type UserType = 'paciente' | 'atendente' | 'gerente';

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_name: string;
  content: string;
  channel: ChannelType;
  timestamp: string;
  is_read: boolean;
  attachments?: Attachment[];
}

export type ChannelType = 'whatsapp' | 'instagram' | 'facebook' | 'email' | 'phone' | 'chat';

export interface Conversation {
  id: string;
  patient_id: string;
  patient_name: string;
  patient_phone: string;
  channel: ChannelType;
  status: ConversationStatus;
  priority: Priority;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
  last_message?: Message;
  unread_count: number;
}

export type ConversationStatus = 'active' | 'waiting' | 'closed' | 'transferred';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface Attachment {
  id: string;
  filename: string;
  url: string;
  type: 'image' | 'document' | 'audio' | 'video';
  size: number;
}

export interface QuickReply {
  id: string;
  title: string;
  content: string;
  category: string;
  created_by: string;
  created_at: string;
}

export interface Metrics {
  total_conversations: number;
  active_conversations: number;
  average_response_time: number;
  conversion_rate: number;
  satisfaction_score: number;
  today_conversations: number;
  today_resolved: number;
}

export interface DashboardData {
  metrics: Metrics;
  recent_conversations: Conversation[];
  team_performance: TeamMember[];
  channel_stats: ChannelStats[];
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  status: 'online' | 'busy' | 'offline';
  conversations_today: number;
  average_response_time: number;
  satisfaction_score: number;
}

export interface ChannelStats {
  channel: ChannelType;
  total_conversations: number;
  active_conversations: number;
  average_response_time: number;
  conversion_rate: number;
}

export interface Appointment {
  id: string;
  patient_id: string;
  patient_name: string;
  doctor_name: string;
  specialty: string;
  date: string;
  time: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  is_read: boolean;
  created_at: string;
  action_url?: string;
}

export interface SystemSettings {
  business_hours: {
    monday: { start: string; end: string; enabled: boolean };
    tuesday: { start: string; end: string; enabled: boolean };
    wednesday: { start: string; end: string; enabled: boolean };
    thursday: { start: string; end: string; enabled: boolean };
    friday: { start: string; end: string; enabled: boolean };
    saturday: { start: string; end: string; enabled: boolean };
    sunday: { start: string; end: string; enabled: boolean };
  };
  auto_responses: {
    enabled: boolean;
    message: string;
    delay_minutes: number;
  };
  sla_settings: {
    max_response_time_minutes: number;
    escalation_time_minutes: number;
  };
}

// Tipos para formulários
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  nomeCompleto: string;
  cpf: string;
  dataNascimento: string;
  telefone: string;
  email: string;
  senha: string;
  confirmarSenha: string;
  aceitarTermos: boolean;
}

export interface MessageForm {
  content: string;
  attachments?: File[];
}

// Tipos para API responses
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
