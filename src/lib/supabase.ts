import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type UserProfile = {
  id: string
  email: string
  nome_completo: string
  cpf: string
  data_nascimento: string
  telefone: string
  tipo_usuario: 'paciente' | 'atendente' | 'gerente'
  created_at: string
}