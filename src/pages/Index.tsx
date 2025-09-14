import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  MessageCircle, 
  Users, 
  BarChart3, 
  Smartphone, 
  Mail, 
  Instagram,
  Facebook,
  PhoneCall,
  CheckCircle2,
  TrendingUp,
  Clock,
  Shield
} from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold">MediChannel</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">
                Funcionalidades
              </a>
              <a href="#benefits" className="text-sm font-medium hover:text-primary transition-colors">
                Benefícios
              </a>
              <a href="#contact" className="text-sm font-medium hover:text-primary transition-colors">
                Contato
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            Sistema Omnichannel para Clínicas
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Unifique Todos os Seus
            <br />
            Canais de Atendimento
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Centralize WhatsApp, Instagram, Facebook, e-mail e telefone em uma única plataforma. 
            Melhore a experiência dos pacientes e a produtividade da sua equipe.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:shadow-elegant transition-all duration-300" asChild>
              <Link to="/login">Começar Agora</Link>
            </Button>
            <Button variant="outline" size="lg">
              Ver Demonstração
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Funcionalidades Principais
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tudo que você precisa para gerenciar o atendimento da sua clínica de forma eficiente
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <MessageCircle className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Omnichannel Unificado</CardTitle>
                <CardDescription>
                  Integre WhatsApp, Instagram, Facebook, e-mail e telefone em uma única interface
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Gestão de Equipe</CardTitle>
                <CardDescription>
                  Monitore produtividade, distribua atendimentos e gerencie sua equipe em tempo real
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Relatórios Avançados</CardTitle>
                <CardDescription>
                  Dashboards com métricas de desempenho, SLA e indicadores de satisfação
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Automação Inteligente</CardTitle>
                <CardDescription>
                  Lembretes automáticos, respostas rápidas e fluxos personalizados
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Segurança Médica</CardTitle>
                <CardDescription>
                  Proteção de dados sensíveis seguindo padrões de segurança para área da saúde
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Integração Completa</CardTitle>
                <CardDescription>
                  Conecte com sua agenda médica, prontuário eletrônico e sistemas existentes
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Channels Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Canais Integrados
            </h2>
            <p className="text-xl text-muted-foreground">
              Todos os canais de comunicação em um só lugar
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {[
              { icon: Smartphone, name: "WhatsApp", color: "text-green-600" },
              { icon: Instagram, name: "Instagram", color: "text-pink-600" },
              { icon: Facebook, name: "Facebook", color: "text-blue-600" },
              { icon: Mail, name: "E-mail", color: "text-orange-600" },
              { icon: PhoneCall, name: "Telefone", color: "text-purple-600" },
              { icon: MessageCircle, name: "Chat Site", color: "text-primary" }
            ].map((channel, index) => (
              <div key={index} className="text-center">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-3 hover:scale-110 transition-transform duration-300">
                  <channel.icon className={`h-8 w-8 ${channel.color}`} />
                </div>
                <p className="font-medium">{channel.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Benefícios para Sua Clínica
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <CheckCircle2 className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">Aumento de 40% nas Consultas</h3>
                    <p className="text-muted-foreground">
                      Atendimento mais rápido e organizado resulta em mais agendamentos confirmados
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle2 className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">Redução de 60% no Tempo de Resposta</h3>
                    <p className="text-muted-foreground">
                      Interface unificada permite respostas mais ágeis em todos os canais
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle2 className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">Melhoria na Satisfação do Paciente</h3>
                    <p className="text-muted-foreground">
                      Atendimento consistente e histórico completo em qualquer canal
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle2 className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">Produtividade da Equipe</h3>
                    <p className="text-muted-foreground">
                      Ferramentas de gestão e automação aumentam a eficiência dos atendentes
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <Card className="text-center p-6">
                <div className="text-3xl font-bold text-primary mb-2">40%</div>
                <p className="text-sm text-muted-foreground">Aumento em consultas</p>
              </Card>
              <Card className="text-center p-6">
                <div className="text-3xl font-bold text-primary mb-2">60%</div>
                <p className="text-sm text-muted-foreground">Redução no tempo</p>
              </Card>
              <Card className="text-center p-6">
                <div className="text-3xl font-bold text-primary mb-2">95%</div>
                <p className="text-sm text-muted-foreground">Satisfação do paciente</p>
              </Card>
              <Card className="text-center p-6">
                <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                <p className="text-sm text-muted-foreground">Disponibilidade</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Card className="max-w-4xl mx-auto p-12 bg-gradient-to-r from-primary/5 to-accent/5 border-0">
            <CardHeader>
              <CardTitle className="text-3xl md:text-4xl mb-4">
                Pronto para Transformar o Atendimento da Sua Clínica?
              </CardTitle>
              <CardDescription className="text-lg mb-8">
                Junte-se a centenas de clínicas que já revolucionaram seu atendimento com nosso sistema omnichannel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:shadow-elegant transition-all duration-300" asChild>
                  <Link to="/login">Começar Teste Gratuito</Link>
                </Button>
                <Button variant="outline" size="lg">
                  Agendar Demonstração
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-primary-foreground" />
                </div>
                <h3 className="font-bold">MediChannel</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Sistema omnichannel especializado para clínicas médicas
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Funcionalidades</p>
                <p>Preços</p>
                <p>Segurança</p>
                <p>Integrações</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Documentação</p>
                <p>Help Center</p>
                <p>Contato</p>
                <p>Status</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Sobre</p>
                <p>Blog</p>
                <p>Carreiras</p>
                <p>Parcerias</p>
              </div>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 MediChannel. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;