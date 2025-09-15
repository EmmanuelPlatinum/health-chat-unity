# 👥 USUÁRIOS DE TESTE - MEDICHANNEL

## 🔐 Credenciais para Teste

### 👤 **PACIENTE**
- **Nome**: Maria Silva (Paciente)
- **CPF**: 123.456.789-01
- **Senha**: 12345678
- **Função**: Paciente - Acesso ao painel com agendamentos, mensagens e histórico

### 👨‍💼 **ATENDENTE**
- **Nome**: João Atendente (Atendente)
- **CPF**: 987.654.321-02
- **Senha**: 12345678
- **Função**: Atendente - Acesso à fila de atendimento, métricas e respostas rápidas

### 👨‍💻 **GERENTE**
- **Nome**: Ana Gerente (Gerente)
- **CPF**: 456.789.123-03
- **Senha**: 12345678
- **Função**: Gerente - Acesso ao dashboard, supervisão e gestão de equipe

## 📝 **INSTRUÇÕES DE USO**

1. **Acesse**: http://localhost:8080/login
2. **Use qualquer uma das credenciais acima**
3. **Teste as funcionalidades específicas de cada perfil**

## 🎯 **O QUE TESTAR POR PERFIL**

### 👤 **Como Paciente (Maria Silva)**:
- ✅ Visualizar agendamentos
- ✅ Acessar histórico de conversas
- ✅ Ver horários de funcionamento
- ✅ Usar ações rápidas (agendar, WhatsApp, e-mail)

### 👨‍💼 **Como Atendente (João Atendente)**:
- ✅ Ver métricas de atendimento
- ✅ Acessar fila de conversas
- ✅ Usar respostas rápidas
- ✅ Filtrar por canal (WhatsApp, Instagram, etc.)

### 👨‍💻 **Como Gerente (Ana Gerente)**:
- ✅ Visualizar dashboard com métricas gerais
- ✅ Monitorar performance da equipe
- ✅ Acessar supervisão em tempo real
- ✅ Gerenciar configurações do sistema

## ⚠️ **NOTA IMPORTANTE**

✅ **SISTEMA FUNCIONA SEM SUPABASE!**
- O sistema usa dados mockados para demonstração
- Login funciona com as credenciais acima
- Todas as funcionalidades estão disponíveis

Estes usuários são para **TESTE APENAS**. Em produção, você deve:
1. Configurar o Supabase com credenciais reais
2. Criar usuários reais através do sistema de cadastro
3. Implementar as integrações com APIs externas
4. Configurar autenticação segura

## 🔧 **CONFIGURAÇÃO NO SUPABASE**

Para usar estes usuários, você precisa:

1. **Configurar o Supabase**:
   - Criar projeto no Supabase
   - Configurar tabela `profiles`
   - Atualizar variáveis no `.env`

2. **Estrutura da Tabela `profiles`**:
   ```sql
   CREATE TABLE profiles (
     id UUID REFERENCES auth.users(id) PRIMARY KEY,
     email TEXT,
     nome_completo TEXT,
     cpf TEXT,
     data_nascimento DATE,
     telefone TEXT,
     tipo_usuario TEXT CHECK (tipo_usuario IN ('paciente', 'atendente', 'gerente')),
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

3. **Inserir usuários de teste**:
   ```sql
   -- Usuários serão criados automaticamente via interface de cadastro
   -- ou você pode inserir manualmente após criar as contas de auth
   ```
