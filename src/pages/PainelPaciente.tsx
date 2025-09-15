import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MessageSquare, User, LogOut, Clock, Phone, Mail } from "lucide-react"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { AuthService } from "@/services/auth.service"
import { DashboardService } from "@/services/dashboard.service"
import { useChat } from "@/hooks/use-chat"
import { ConversationList } from "@/components/chat/ConversationList"
import { ChatInterface } from "@/components/chat/ChatInterface"
import { User as UserType, DashboardData } from "@/types"

export default function PainelPaciente() {
  const [user, setUser] = useState<UserType | null>(null)
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showChat, setShowChat] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  // Hook do chat
  const {
    conversations,
    activeConversation,
    messages,
    loading: chatLoading,
    selectConversation,
    sendMessage,
    createConversation
  } = useChat(user?.id || '', 'paciente')

  useEffect(() => {
    getProfile()
  }, [])

  const getProfile = async () => {
    try {
      if (!isSupabaseConfigured()) {
        // Usar dados do localStorage para demonstração
        const userStr = localStorage.getItem('currentUser')
        if (!userStr) {
          navigate('/login')
          return
        }
        
        const user = JSON.parse(userStr)
        if (user.tipo_usuario !== 'paciente') {
          navigate('/login')
          return
        }
        
        setUser(user)
        setLoading(false)
        return
      }

      const response = await AuthService.getCurrentUser()
      
      if (!response.success || !response.data) {
        navigate('/login')
        return
      }

      if (response.data.tipo_usuario !== 'paciente') {
        navigate('/login')
        return
      }

      setUser(response.data)
      await loadDashboardData(response.data.id)
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadDashboardData = async (userId: string) => {
    try {
      const response = await DashboardService.getPatientDashboard(userId)
      if (response.success) {
        setDashboardData(response.data)
      }
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error)
    }
  }

  const handleLogout = async () => {
    await AuthService.logout()
    navigate('/')
  }

  const handleCreateConversation = async () => {
    if (!user) return
    
    await createConversation(
      user.nome_completo,
      user.telefone,
      'chat'
    )
    setShowChat(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Carregando...</p>
        </div>
      </div>
    )
  }

  if (showChat) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-background/80">
        {/* Header */}
        <header className="border-b bg-background/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <User className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold">Chat com a Clínica</h1>
                <p className="text-sm text-muted-foreground">
                  {user?.nome_completo}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={() => setShowChat(false)}>
                Voltar ao Painel
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </Button>
            </div>
          </div>
        </header>

        {/* Interface de Chat */}
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <ConversationList
                conversations={conversations}
                activeConversation={activeConversation}
                onSelectConversation={selectConversation}
                onCreateConversation={handleCreateConversation}
                userType="paciente"
              />
            </div>
            <div className="lg:col-span-2">
              {activeConversation ? (
                <ChatInterface
                  conversation={activeConversation}
                  currentUserId={user?.id || ''}
                  currentUserName={user?.nome_completo || ''}
                  onSendMessage={sendMessage}
                  messages={messages}
                  loading={chatLoading}
                />
              ) : (
                <Card className="h-[600px] flex items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Selecione uma conversa</h3>
                    <p className="text-muted-foreground mb-4">
                      Escolha uma conversa da lista ou inicie uma nova
                    </p>
                    <Button onClick={handleCreateConversation}>
                      Iniciar Nova Conversa
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <User className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold">Painel do Paciente</h1>
              <p className="text-sm text-muted-foreground">
                Bem-vindo, {user?.nome_completo}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={() => setShowChat(true)}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Chat
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Agendamentos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Agendamentos
              </CardTitle>
              <CardDescription>
                Gerencie suas consultas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">Próxima consulta</p>
                    <p className="text-sm text-muted-foreground">15/12/2024 - 14:30</p>
                  </div>
                  <Badge>Confirmada</Badge>
                </div>
                <Button className="w-full" variant="outline">
                  Ver todos os agendamentos
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Mensagens */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="mr-2 h-5 w-5" />
                Mensagens
              </CardTitle>
              <CardDescription>
                Conversas com a clínica
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">Atendimento</p>
                    <p className="text-sm text-muted-foreground">Última mensagem há 2h</p>
                  </div>
                  <Badge variant="secondary">2</Badge>
                </div>
                <Button className="w-full" variant="outline">
                  Abrir chat
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Horários */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                Horários
              </CardTitle>
              <CardDescription>
                Funcionamento da clínica
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Segunda - Sexta:</span>
                  <span>8h às 18h</span>
                </div>
                <div className="flex justify-between">
                  <span>Sábado:</span>
                  <span>8h às 12h</span>
                </div>
                <div className="flex justify-between">
                  <span>Domingo:</span>
                  <span>Fechado</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ações Rápidas */}
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>
              Acesso direto às principais funcionalidades
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button className="h-20 flex-col">
                <Calendar className="mb-2 h-6 w-6" />
                Agendar Consulta
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Phone className="mb-2 h-6 w-6" />
                Falar no WhatsApp
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Mail className="mb-2 h-6 w-6" />
                Enviar E-mail
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Histórico */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Histórico de Conversas</CardTitle>
            <CardDescription>
              Suas últimas interações com a clínica
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-4 border rounded-lg">
                <MessageSquare className="h-5 w-5 mt-1 text-primary" />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">Confirmação de Consulta</p>
                      <p className="text-sm text-muted-foreground">
                        Sua consulta foi confirmada para amanhã às 14:30
                      </p>
                    </div>
                    <Badge variant="outline">WhatsApp</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Hoje, 10:30</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-4 border rounded-lg">
                <Mail className="h-5 w-5 mt-1 text-primary" />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">Resultados de Exame</p>
                      <p className="text-sm text-muted-foreground">
                        Seus resultados estão disponíveis
                      </p>
                    </div>
                    <Badge variant="outline">E-mail</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Ontem, 16:45</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}