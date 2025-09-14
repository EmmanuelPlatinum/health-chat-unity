import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BarChart3, 
  Users, 
  MessageSquare, 
  Clock, 
  LogOut, 
  TrendingUp, 
  UserPlus,
  Settings,
  Eye,
  AlertTriangle 
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"

export default function PainelGerente() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    getProfile()
  }, [])

  const getProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        navigate('/login')
        return
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (error) throw error

      if (profile.tipo_usuario !== 'gerente') {
        navigate('/login')
        return
      }

      setUser(profile)
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

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <BarChart3 className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold">Painel do Gerente</h1>
              <p className="text-sm text-muted-foreground">
                {user?.nome_completo} - Gestão & Supervisão
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MessageSquare className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Atendimentos Hoje</p>
                  <p className="text-2xl font-bold">127</p>
                  <p className="text-xs text-green-600">+12% vs ontem</p>
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
                  <p className="text-2xl font-bold">2m 45s</p>
                  <p className="text-xs text-green-600">-15s vs meta</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Taxa Conversão</p>
                  <p className="text-2xl font-bold">78%</p>
                  <p className="text-xs text-green-600">+5% vs meta</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-primary" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Satisfação</p>
                  <p className="text-2xl font-bold">4.8</p>
                  <p className="text-xs text-green-600">Excelente</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="atendentes">Atendentes</TabsTrigger>
            <TabsTrigger value="supervisao">Supervisão</TabsTrigger>
            <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gráfico de Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance por Canal</CardTitle>
                  <CardDescription>
                    Atendimentos dos últimos 7 dias
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                        WhatsApp
                      </span>
                      <span className="font-medium">45%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center">
                        <div className="w-3 h-3 bg-pink-500 rounded mr-2"></div>
                        Instagram
                      </span>
                      <span className="font-medium">25%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                        Facebook
                      </span>
                      <span className="font-medium">20%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center">
                        <div className="w-3 h-3 bg-gray-500 rounded mr-2"></div>
                        E-mail
                      </span>
                      <span className="font-medium">10%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Alertas */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="mr-2 h-5 w-5 text-orange-500" />
                    Alertas & Notificações
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-orange-800">SLA em risco</p>
                        <p className="text-sm text-orange-600">
                          3 conversas com tempo de resposta acima de 5min
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <Users className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-800">Pico de demanda</p>
                        <p className="text-sm text-blue-600">
                          Aumento de 25% nos atendimentos hoje
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="atendentes">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Equipe de Atendentes</CardTitle>
                    <CardDescription>
                      Gerencie e monitore a performance da equipe
                    </CardDescription>
                  </div>
                  <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Adicionar Atendente
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Atendente 1 */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">JS</span>
                      </div>
                      <div>
                        <p className="font-medium">Julia Santos</p>
                        <p className="text-sm text-muted-foreground">julia@clinica.com</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <p className="text-sm font-medium">Atendimentos</p>
                        <p className="text-lg font-bold text-green-600">23</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium">Tempo Médio</p>
                        <p className="text-lg font-bold">2m 15s</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Online</Badge>
                      <Button variant="outline" size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        Supervisionar
                      </Button>
                    </div>
                  </div>

                  {/* Atendente 2 */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">MC</span>
                      </div>
                      <div>
                        <p className="font-medium">Marcos Costa</p>
                        <p className="text-sm text-muted-foreground">marcos@clinica.com</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <p className="text-sm font-medium">Atendimentos</p>
                        <p className="text-lg font-bold text-green-600">18</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium">Tempo Médio</p>
                        <p className="text-lg font-bold">3m 20s</p>
                      </div>
                      <Badge className="bg-orange-100 text-orange-800">Ocupado</Badge>
                      <Button variant="outline" size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        Supervisionar
                      </Button>
                    </div>
                  </div>

                  {/* Atendente 3 */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                        <span className="text-muted-foreground font-medium">AS</span>
                      </div>
                      <div>
                        <p className="font-medium">Ana Silva</p>
                        <p className="text-sm text-muted-foreground">ana@clinica.com</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <p className="text-sm font-medium">Atendimentos</p>
                        <p className="text-lg font-bold text-muted-foreground">0</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium">Tempo Médio</p>
                        <p className="text-lg font-bold text-muted-foreground">--</p>
                      </div>
                      <Badge variant="secondary">Offline</Badge>
                      <Button variant="outline" size="sm" disabled>
                        <Eye className="mr-2 h-4 w-4" />
                        Supervisionar
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="supervisao">
            <Card>
              <CardHeader>
                <CardTitle>Supervisão em Tempo Real</CardTitle>
                <CardDescription>
                  Monitore conversas ativas e intervenha quando necessário
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Nenhuma conversa ativa no momento</h3>
                  <p className="text-muted-foreground">
                    As conversas em andamento aparecerão aqui para supervisão
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="configuracoes">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="mr-2 h-5 w-5" />
                    Configurações do Sistema
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    Gerenciar Usuários
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Configurar Canais
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Respostas Automáticas
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Relatórios e Exportação
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Metas e SLAs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Tempo máximo de resposta</span>
                    <Badge>5 minutos</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Taxa de conversão mínima</span>
                    <Badge>75%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Satisfação mínima</span>
                    <Badge>4.5 estrelas</Badge>
                  </div>
                  <Button className="w-full mt-4">Editar Metas</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}