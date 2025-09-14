import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MessageSquare, User, LogOut, Clock, Phone, Mail } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"

export default function PainelPaciente() {
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

      if (profile.tipo_usuario !== 'paciente') {
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
            <User className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold">Painel do Paciente</h1>
              <p className="text-sm text-muted-foreground">
                Bem-vindo, {user?.nome_completo}
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
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