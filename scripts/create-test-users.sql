-- Script para criar usuários de teste no Supabase
-- Execute este script no SQL Editor do Supabase

-- 1. Criar tabela profiles se não existir
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  nome_completo TEXT,
  cpf TEXT,
  data_nascimento DATE,
  telefone TEXT,
  tipo_usuario TEXT CHECK (tipo_usuario IN ('paciente', 'atendente', 'gerente')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Habilitar RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 3. Criar políticas de segurança
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- 4. Função para criar perfil automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, nome_completo, tipo_usuario)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'nome_completo', NEW.raw_user_meta_data->>'tipo_usuario');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Trigger para criar perfil automaticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Inserir usuários de teste
-- Execute estes comandos no SQL Editor do Supabase

-- Inserir usuários de teste
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data
) VALUES 
(
  '11111111-1111-1111-1111-111111111111',
  'maria.paciente@teste.com',
  crypt('12345678', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"nome_completo": "Maria Silva (Paciente)", "tipo_usuario": "paciente"}'::jsonb
),
(
  '22222222-2222-2222-2222-222222222222',
  'joao.atendente@teste.com',
  crypt('12345678', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"nome_completo": "João Atendente (Atendente)", "tipo_usuario": "atendente"}'::jsonb
),
(
  '33333333-3333-3333-3333-333333333333',
  'ana.gerente@teste.com',
  crypt('12345678', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"nome_completo": "Ana Gerente (Gerente)", "tipo_usuario": "gerente"}'::jsonb
);

-- Inserir perfis dos usuários
INSERT INTO profiles (
  id,
  email,
  nome_completo,
  cpf,
  data_nascimento,
  telefone,
  tipo_usuario,
  created_at
) VALUES 
(
  '11111111-1111-1111-1111-111111111111',
  'maria.paciente@teste.com',
  'Maria Silva (Paciente)',
  '12345678901',
  '1990-01-15',
  '11999999999',
  'paciente',
  NOW()
),
(
  '22222222-2222-2222-2222-222222222222',
  'joao.atendente@teste.com',
  'João Atendente (Atendente)',
  '98765432102',
  '1985-05-20',
  '11888888888',
  'atendente',
  NOW()
),
(
  '33333333-3333-3333-3333-333333333333',
  'ana.gerente@teste.com',
  'Ana Gerente (Gerente)',
  '45678912303',
  '1980-12-10',
  '11777777777',
  'gerente',
  NOW()
);
