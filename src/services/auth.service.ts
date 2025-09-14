import { supabase } from '@/lib/supabase';
import { User, LoginForm, RegisterForm, ApiResponse } from '@/types';

export class AuthService {
  /**
   * Realiza login do usuário por CPF
   */
  static async login(credentials: LoginForm): Promise<ApiResponse<User>> {
    try {
      // Primeiro, buscar o usuário pelo CPF
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('cpf', credentials.email.replace(/\D/g, '')) // Remove formatação do CPF
        .single();

      if (profileError || !profile) {
        return {
          data: null as any,
          success: false,
          error: 'CPF não encontrado'
        };
      }

      // Agora fazer login com o email do perfil
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: profile.email,
        password: credentials.password,
      });

      if (authError) {
        return {
          data: null as any,
          success: false,
          error: 'Senha incorreta'
        };
      }

      return {
        data: profile,
        success: true,
        message: 'Login realizado com sucesso!'
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
   * Registra novo usuário
   */
  static async register(userData: RegisterForm): Promise<ApiResponse<User>> {
    try {
      // Criar conta no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.senha,
      });

      if (authError) throw authError;

      // Criar perfil do usuário
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user?.id,
          email: userData.email,
          nome_completo: userData.nomeCompleto,
          cpf: userData.cpf.replace(/\D/g, ''),
          data_nascimento: userData.dataNascimento,
          telefone: userData.telefone.replace(/\D/g, ''),
          tipo_usuario: 'paciente'
        })
        .select()
        .single();

      if (profileError) throw profileError;

      return {
        data: profile,
        success: true,
        message: 'Cadastro realizado com sucesso!'
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
   * Realiza logout do usuário
   */
  static async logout(): Promise<ApiResponse<null>> {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;

      return {
        data: null,
        success: true,
        message: 'Logout realizado com sucesso!'
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
   * Obtém usuário atual
   */
  static async getCurrentUser(): Promise<ApiResponse<User>> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        return {
          data: null as any,
          success: false,
          error: 'Usuário não autenticado'
        };
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;

      return {
        data: profile,
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
   * Verifica se usuário está autenticado
   */
  static async isAuthenticated(): Promise<boolean> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return !!session;
    } catch {
      return false;
    }
  }

  /**
   * Atualiza perfil do usuário
   */
  static async updateProfile(userId: string, updates: Partial<User>): Promise<ApiResponse<User>> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      return {
        data,
        success: true,
        message: 'Perfil atualizado com sucesso!'
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
