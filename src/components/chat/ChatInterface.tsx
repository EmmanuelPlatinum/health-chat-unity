import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Paperclip, Smile, Phone, Video, MoreVertical } from 'lucide-react';
import { Message, Conversation, MessageForm } from '@/types';
import { useChat } from '@/hooks/use-chat';

interface ChatInterfaceProps {
  conversation: Conversation;
  currentUserId: string;
  currentUserName: string;
  onSendMessage: (messageData: MessageForm) => void;
  messages: Message[];
  loading: boolean;
}

export const ChatInterface = ({
  conversation,
  currentUserId,
  currentUserName,
  onSendMessage,
  messages,
  loading
}: ChatInterfaceProps) => {
  const [messageText, setMessageText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll para última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focar no input quando a conversa mudar
  useEffect(() => {
    inputRef.current?.focus();
  }, [conversation.id]);

  const handleSendMessage = () => {
    if (!messageText.trim()) return;

    const messageData: MessageForm = {
      content: messageText.trim()
    };

    onSendMessage(messageData);
    setMessageText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getChannelColor = (channel: string) => {
    const colors = {
      whatsapp: 'bg-green-500',
      instagram: 'bg-pink-500',
      facebook: 'bg-blue-500',
      email: 'bg-orange-500',
      phone: 'bg-purple-500',
      chat: 'bg-gray-500'
    };
    return colors[channel as keyof typeof colors] || 'bg-gray-500';
  };

  const getChannelIcon = (channel: string) => {
    // Implementar ícones específicos para cada canal
    return '💬';
  };

  return (
    <Card className="h-[600px] flex flex-col">
      {/* Header da Conversa */}
      <CardHeader className="border-b pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarFallback>
                {conversation.patient_name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{conversation.patient_name}</CardTitle>
              <div className="flex items-center space-x-2">
                <Badge 
                  variant="outline" 
                  className={`${getChannelColor(conversation.channel)} text-white border-0`}
                >
                  {getChannelIcon(conversation.channel)} {conversation.channel.toUpperCase()}
                </Badge>
                <Badge variant={conversation.status === 'active' ? 'default' : 'secondary'}>
                  {conversation.status}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Video className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Área de Mensagens */}
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-[400px] p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender_id === currentUserId ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-2 ${
                    message.sender_id === currentUserId
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-medium">
                      {message.sender_id === currentUserId ? 'Você' : message.sender_name}
                    </span>
                    <span className="text-xs opacity-70">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg px-4 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>

      {/* Área de Input */}
      <div className="border-t p-4">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Paperclip className="h-4 w-4" />
          </Button>
          <Input
            ref={inputRef}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua mensagem..."
            disabled={loading}
            className="flex-1"
          />
          <Button variant="outline" size="sm">
            <Smile className="h-4 w-4" />
          </Button>
          <Button 
            onClick={handleSendMessage}
            disabled={!messageText.trim() || loading}
            size="sm"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
