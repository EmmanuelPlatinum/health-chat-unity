import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { MessageSquare, Users, Clock, LogOut, Search, Filter, Phone, Mail, MessageCircle } from "lucide-react"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { AuthService } from "@/services/auth.service"
import { DashboardService } from "@/services/dashboard.service"
import { useChat } from "@/hooks/use-chat"
import { ConversationList } from "@/components/chat/ConversationList"
import { ChatInterface } from "@/components/chat/ChatInterface"
import { QuickReplies } from "@/components/chat/QuickReplies"
import { User as UserType, DashboardData } from "@/types"

export default function PainelAtendente() {
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
    assignConversation,
    updateConversationStatus
  } = useChat(user?.id || '', 'atendente')

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
        if (user.tipo_usuario !== 'atendente') {
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

      if (response.data.tipo_usuario !== 'atendente') {
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
      const response = await DashboardService.getAttendantDashboard(userId)
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

  const handleSelectReply = (content: string) => {
    if (activeConversation) {
      sendMessage({ content })
    }
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
              <MessageSquare className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold">Central de Atendimento</h1>
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
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <ConversationList
                conversations={conversations}
                activeConversation={activeConversation}
                onSelectConversation={selectConversation}
                onCreateConversation={() => {}}
                userType="atendente"
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
                    <p className="text-muted-foreground">
                      Escolha uma conversa da lista para começar o atendimento
                    </p>
                  </div>
                </Card>
              )}
            </div>
            <div className="lg:col-span-1">
              <QuickReplies
                onSelectReply={handleSelectReply}
                userType="atendente"
              />
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
            <MessageSquare className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold">Painel do Atendente</h1>
              <p className="text-sm text-muted-foreground">
                {user?.nome_completo} - Central de Atendimento
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

      <div className="container mx-auto px-4 py-6">
        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MessageSquare className="h-8 w-8 text-primary" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Pendentes</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Atendidos Hoje</p>
                  <p className="text-2xl font-bold">45</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Tempo Médio</p>
                  <p className="text-2xl font-bold">3m</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MessageCircle className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Em Andamento</p>
                  <p className="text-2xl font-bold">8</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros e Busca */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Fila de Atendimento</CardTitle>
            <CardDescription>
              Gerencie suas conversas em todos os canais
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4 mb-4">
              <div className="flex-1">
                <Input
                  placeholder="Buscar por nome, CPF ou telefone..."
                  className="w-full"
                />
              </div>
              <Button variant="outline">
                <Search className="mr-2 h-4 w-4" />
                Buscar
              </Button>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filtros
              </Button>
            </div>
            
            <div className="flex space-x-2">
              <Badge variant="secondary" className="cursor-pointer">Todos (20)</Badge>
              <Badge className="cursor-pointer">WhatsApp (8)</Badge>
              <Badge variant="outline" className="cursor-pointer">Instagram (4)</Badge>
              <Badge variant="outline" className="cursor-pointer">Facebook (3)</Badge>
              <Badge variant="outline" className="cursor-pointer">E-mail (5)</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Conversas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Conversas Ativas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Conversa 1 */}
                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <Phone className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">Maria Silva</p>
                        <p className="text-sm text-muted-foreground truncate">
                          Gostaria de agendar uma consulta para amanhã...
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant="destructive" className="mb-1">Urgente</Badge>
                        <p className="text-xs text-muted-foreground">2 min</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Conversa 2 */}
                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
                      <MessageCircle className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">João Santos</p>
                        <p className="text-sm text-muted-foreground truncate">
                          Preciso remarcar minha consulta...
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge className="mb-1">Instagram</Badge>
                        <p className="text-xs text-muted-foreground">5 min</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Conversa 3 */}
                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <Mail className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">Ana Costa</p>
                        <p className="text-sm text-muted-foreground truncate">
                          Resultados do exame estão prontos?
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="mb-1">E-mail</Badge>
                        <p className="text-xs text-muted-foreground">12 min</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Respostas Rápidas */}
          <Card>
            <CardHeader>
              <CardTitle>Respostas Rápidas</CardTitle>
              <CardDescription>
                Templates para agilizar o atendimento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start text-left h-auto p-4">
                  <div>
                    <p className="font-medium">Saudação</p>
                    <p className="text-sm text-muted-foreground">
                      Olá! Como posso ajudá-lo hoje?
                    </p>
                  </div>
                </Button>
                
                <Button variant="outline" className="w-full justify-start text-left h-auto p-4">
                  <div>
                    <p className="font-medium">Horários</p>
                    <p className="text-sm text-muted-foreground">
                      Nosso funcionamento é de seg a sex das 8h às 18h...
                    </p>
                  </div>
                </Button>
                
                <Button variant="outline" className="w-full justify-start text-left h-auto p-4">
                  <div>
                    <p className="font-medium">Agendamento</p>
                    <p className="text-sm text-muted-foreground">
                      Para agendar, preciso de alguns dados...
                    </p>
                  </div>
                </Button>
                
                <Button variant="outline" className="w-full justify-start text-left h-auto p-4">
                  <div>
                    <p className="font-medium">Finalização</p>
                    <p className="text-sm text-muted-foreground">
                      Obrigado pelo contato! Estamos à disposição.
                    </p>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}