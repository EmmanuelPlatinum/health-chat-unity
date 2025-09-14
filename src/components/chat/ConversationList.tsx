import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Filter, Plus, MessageSquare, Phone, Mail, Instagram, Facebook } from 'lucide-react';
import { Conversation, ChannelType } from '@/types';

interface ConversationListProps {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  onSelectConversation: (conversation: Conversation) => void;
  onCreateConversation: () => void;
  userType: string;
}

export const ConversationList = ({
  conversations,
  activeConversation,
  onSelectConversation,
  onCreateConversation,
  userType
}: ConversationListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterChannel, setFilterChannel] = useState<ChannelType | 'all'>('all');

  const getChannelIcon = (channel: ChannelType) => {
    const icons = {
      whatsapp: '📱',
      instagram: '📷',
      facebook: '👥',
      email: '📧',
      phone: '📞',
      chat: '💬'
    };
    return icons[channel] || '💬';
  };

  const getChannelColor = (channel: ChannelType) => {
    const colors = {
      whatsapp: 'text-green-600',
      instagram: 'text-pink-600',
      facebook: 'text-blue-600',
      email: 'text-orange-600',
      phone: 'text-purple-600',
      chat: 'text-gray-600'
    };
    return colors[channel] || 'text-gray-600';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      waiting: 'bg-yellow-100 text-yellow-800',
      closed: 'bg-gray-100 text-gray-800',
      transferred: 'bg-blue-100 text-blue-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Agora';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h`;
    } else {
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    }
  };

  const filteredConversations = conversations.filter(conversation => {
    const matchesSearch = conversation.patient_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
      conversation.patient_phone.includes(searchTerm);
    
    const matchesChannel = filterChannel === 'all' || conversation.channel === filterChannel;
    
    return matchesSearch && matchesChannel;
  });

  const getUnreadCount = () => {
    return conversations.reduce((total, conv) => total + conv.unread_count, 0);
  };

  return (
    <Card className="h-[600px] flex flex-col">
      {/* Header */}
      <CardHeader className="border-b pb-4">
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>Conversas</span>
            {getUnreadCount() > 0 && (
              <Badge variant="destructive">{getUnreadCount()}</Badge>
            )}
          </CardTitle>
          {userType === 'paciente' && (
            <Button onClick={onCreateConversation} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Nova
            </Button>
          )}
        </div>

        {/* Busca */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar conversas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filtros por Canal */}
        <div className="flex space-x-2 mt-3">
          <Button
            variant={filterChannel === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterChannel('all')}
          >
            Todos
          </Button>
          <Button
            variant={filterChannel === 'whatsapp' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterChannel('whatsapp')}
          >
            📱 WhatsApp
          </Button>
          <Button
            variant={filterChannel === 'instagram' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterChannel('instagram')}
          >
            📷 Instagram
          </Button>
          <Button
            variant={filterChannel === 'email' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterChannel('email')}
          >
            📧 E-mail
          </Button>
        </div>
      </CardHeader>

      {/* Lista de Conversas */}
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full">
          <div className="space-y-1 p-2">
            {filteredConversations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma conversa encontrada</p>
                {userType === 'paciente' && (
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={onCreateConversation}
                  >
                    Iniciar nova conversa
                  </Button>
                )}
              </div>
            ) : (
              filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                    activeConversation?.id === conversation.id ? 'bg-muted' : ''
                  }`}
                  onClick={() => onSelectConversation(conversation)}
                >
                  <div className="flex items-start space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {conversation.patient_name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium truncate">
                          {conversation.patient_name}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-muted-foreground">
                            {formatTime(conversation.updated_at)}
                          </span>
                          {conversation.unread_count > 0 && (
                            <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                              {conversation.unread_count}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`text-sm ${getChannelColor(conversation.channel)}`}>
                          {getChannelIcon(conversation.channel)}
                        </span>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getStatusColor(conversation.status)}`}
                        >
                          {conversation.status}
                        </Badge>
                        {conversation.priority === 'urgent' && (
                          <Badge variant="destructive" className="text-xs">
                            Urgente
                          </Badge>
                        )}
                      </div>
                      
                      {conversation.last_message && (
                        <p className="text-sm text-muted-foreground truncate">
                          {conversation.last_message.sender_name}: {conversation.last_message.content}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
