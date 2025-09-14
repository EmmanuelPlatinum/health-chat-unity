import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Plus, Edit, Trash2, MessageSquare } from 'lucide-react';
import { QuickReply } from '@/types';

interface QuickRepliesProps {
  onSelectReply: (content: string) => void;
  userType: string;
}

export const QuickReplies = ({ onSelectReply, userType }: QuickRepliesProps) => {
  const [replies, setReplies] = useState<QuickReply[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Respostas rápidas padrão
  const defaultReplies: QuickReply[] = [
    {
      id: '1',
      title: 'Saudação',
      content: 'Olá! Como posso ajudá-lo hoje?',
      category: 'saudacao',
      created_by: 'system',
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Horários de Funcionamento',
      content: 'Nosso funcionamento é de segunda a sexta das 8h às 18h e sábado das 8h às 12h. Estamos fechados aos domingos.',
      category: 'horarios',
      created_by: 'system',
      created_at: new Date().toISOString()
    },
    {
      id: '3',
      title: 'Agendamento',
      content: 'Para agendar uma consulta, preciso de alguns dados: nome completo, CPF, telefone e especialidade desejada.',
      category: 'agendamento',
      created_by: 'system',
      created_at: new Date().toISOString()
    },
    {
      id: '4',
      title: 'Confirmação de Consulta',
      content: 'Sua consulta foi confirmada! Você receberá um lembrete 24h antes do horário agendado.',
      category: 'confirmacao',
      created_by: 'system',
      created_at: new Date().toISOString()
    },
    {
      id: '5',
      title: 'Resultados de Exame',
      content: 'Os resultados do seu exame estão disponíveis. Você pode retirar na clínica ou solicitar o envio por e-mail.',
      category: 'exames',
      created_by: 'system',
      created_at: new Date().toISOString()
    },
    {
      id: '6',
      title: 'Cancelamento',
      content: 'Para cancelar sua consulta, entre em contato conosco com pelo menos 24h de antecedência.',
      category: 'cancelamento',
      created_by: 'system',
      created_at: new Date().toISOString()
    },
    {
      id: '7',
      title: 'Finalização',
      content: 'Obrigado pelo contato! Estamos à disposição para qualquer dúvida. Tenha um ótimo dia!',
      category: 'finalizacao',
      created_by: 'system',
      created_at: new Date().toISOString()
    },
    {
      id: '8',
      title: 'Transferência',
      content: 'Vou transferir você para um especialista que poderá ajudá-lo melhor com sua solicitação.',
      category: 'transferencia',
      created_by: 'system',
      created_at: new Date().toISOString()
    }
  ];

  useEffect(() => {
    setReplies(defaultReplies);
  }, []);

  const categories = [
    { id: 'all', name: 'Todas', count: replies.length },
    { id: 'saudacao', name: 'Saudação', count: replies.filter(r => r.category === 'saudacao').length },
    { id: 'horarios', name: 'Horários', count: replies.filter(r => r.category === 'horarios').length },
    { id: 'agendamento', name: 'Agendamento', count: replies.filter(r => r.category === 'agendamento').length },
    { id: 'confirmacao', name: 'Confirmação', count: replies.filter(r => r.category === 'confirmacao').length },
    { id: 'exames', name: 'Exames', count: replies.filter(r => r.category === 'exames').length },
    { id: 'cancelamento', name: 'Cancelamento', count: replies.filter(r => r.category === 'cancelamento').length },
    { id: 'finalizacao', name: 'Finalização', count: replies.filter(r => r.category === 'finalizacao').length },
    { id: 'transferencia', name: 'Transferência', count: replies.filter(r => r.category === 'transferencia').length }
  ];

  const filteredReplies = replies.filter(reply => {
    const matchesSearch = reply.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reply.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || reply.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    const colors = {
      saudacao: 'bg-blue-100 text-blue-800',
      horarios: 'bg-green-100 text-green-800',
      agendamento: 'bg-purple-100 text-purple-800',
      confirmacao: 'bg-yellow-100 text-yellow-800',
      exames: 'bg-orange-100 text-orange-800',
      cancelamento: 'bg-red-100 text-red-800',
      finalizacao: 'bg-gray-100 text-gray-800',
      transferencia: 'bg-indigo-100 text-indigo-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="h-[400px] flex flex-col">
      <CardHeader className="border-b pb-4">
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>Respostas Rápidas</span>
          </CardTitle>
          {userType === 'atendente' && (
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Nova
            </Button>
          )}
        </div>

        {/* Busca */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar respostas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0">
        {/* Categorias */}
        <div className="p-4 border-b">
          <ScrollArea className="h-12">
            <div className="flex space-x-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="whitespace-nowrap"
                >
                  {category.name}
                  {category.count > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {category.count}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Lista de Respostas */}
        <ScrollArea className="h-[200px]">
          <div className="p-4 space-y-3">
            {filteredReplies.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma resposta encontrada</p>
              </div>
            ) : (
              filteredReplies.map((reply) => (
                <div
                  key={reply.id}
                  className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => onSelectReply(reply.content)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm">{reply.title}</h4>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getCategoryColor(reply.category)}`}
                      >
                        {categories.find(c => c.id === reply.category)?.name}
                      </Badge>
                      {userType === 'atendente' && (
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {reply.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
