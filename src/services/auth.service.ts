import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { User, LoginForm, RegisterForm, ApiResponse } from '@/types';

// Dados mockados para demonstração
const mockUsers: User[] = [
  {
    id: '1',
    email: 'paciente@teste.com',
    nome_completo: 'João Silva',
    cpf: '12345678901',
    data_nascimento: '1990-01-01',
    telefone: '11999999999',
    tipo_usuario: 'paciente',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    email: 'atendente@teste.com',
    nome_completo: 'Maria Santos',
    cpf: '98765432102',
    data_nascimento: '1985-05-15',
    telefone: '11888888888',
    tipo_usuario: 'atendente',
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    email: 'gerente@teste.com',
    nome_completo: 'Carlos Oliveira',
    cpf: '45678912303',
    data_nascimento: '1980-12-10',
    telefone: '11777777777',
    tipo_usuario: 'gerente',
    created_at: new Date().toISOString()
  }
];

export class AuthService {
  /**
   * Realiza login do usuário por CPF
   */
  static async login(credentials: LoginForm): Promise<ApiResponse<User>> {
    try {
      // Se Supabase não estiver configurado, usar dados mockados
      if (!isSupabaseConfigured()) {
        const cpfLimpo = credentials.email.replace(/\D/g, '');
        const user = mockUsers.find(u => u.cpf === cpfLimpo);
        
        if (!user) {
          return {
            data: null as any,
            success: false,
            error: 'CPF não encontrado'
          };
        }

        if (credentials.password !== '12345678') {
          return {
            data: null as any,
            success: false,
            error: 'Senha incorreta'
          };
        }

        // Salvar no localStorage para simular sessão
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('isAuthenticated', 'true');

        return {
          data: user,
          success: true,
          message: 'Login realizado com sucesso!'
        };
      }

      // Código original do Supabase
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('cpf', credentials.email.replace(/\D/g, ''))
        .single();

      if (profileError || !profile) {
        return {
          data: null as any,
          success: false,
          error: 'CPF não encontrado'
        };
      }

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
      if (!isSupabaseConfigured()) {
        // Limpar dados do localStorage
        localStorage.removeItem('currentUser');
        localStorage.removeItem('isAuthenticated');
        
        return {
          data: null,
          success: true,
          message: 'Logout realizado com sucesso!'
        };
      }

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
      if (!isSupabaseConfigured()) {
        const userStr = localStorage.getItem('currentUser');
        if (!userStr) {
          return {
            data: null as any,
            success: false,
            error: 'Usuário não autenticado'
          };
        }
        
        const user = JSON.parse(userStr);
        return {
          data: user,
          success: true
        };
      }

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
      if (!isSupabaseConfigured()) {
        return localStorage.getItem('isAuthenticated') === 'true';
      }

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
