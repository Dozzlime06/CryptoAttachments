import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Send, X, Loader2, MessageCircle } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [position, setPosition] = useState({ x: window.innerWidth - 100, y: window.innerHeight / 2 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const chatMutation = useMutation({
    mutationFn: async ({ userMessage, conversationHistory }: { userMessage: string; conversationHistory: Message[] }) => {
      const newMessages = [...conversationHistory, { role: 'user' as const, content: userMessage }];
      const response = await apiRequest('POST', '/api/support/chat', { messages: newMessages });
      const data = await response.json();
      return data as { message: string };
    },
    onSuccess: (data) => {
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
    },
  });

  const handleSend = () => {
    if (!input.trim() || chatMutation.isPending) return;

    const userMessage = input.trim();
    const conversationHistory = messages;
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    chatMutation.mutate({ userMessage, conversationHistory });
  };

  const handleClear = () => {
    setMessages([]);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart.x, dragStart.y]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!open) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleButtonClick = () => {
    if (!isDragging) {
      setOpen(true);
    }
  };

  return (
    <>
      <Button
        size="icon"
        className="h-14 w-14 rounded-full shadow-lg z-50 bg-primary hover:bg-primary/90 text-primary-foreground"
        style={{
          position: 'fixed',
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: 'translate(-50%, -50%)',
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
        onMouseDown={handleMouseDown}
        onClick={handleButtonClick}
        data-testid="button-open-chat"
      >
        <Bot className="w-6 h-6 text-primary-foreground" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col p-0">
          <DialogHeader className="p-6 pb-4 border-b">
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              Liminal Dreams Support
            </DialogTitle>
            <DialogDescription>
              Ask me anything about the Liminal Dreams NFT project
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-1 p-6" data-testid="chat-messages">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-12">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">Start a conversation!</p>
                <p className="text-xs mt-2">Ask about NFT minting, pricing, or AI agents</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    data-testid={`message-${message.role}-${index}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))}
                {chatMutation.isPending && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg px-4 py-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>

          <div className="p-4 border-t">
            {messages.length > 0 && (
              <div className="mb-3 flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                  data-testid="button-clear-chat"
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear Chat
                </Button>
              </div>
            )}
            <div className="flex gap-2">
              <Input
                placeholder="Type your question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                disabled={chatMutation.isPending}
                data-testid="input-chat-message"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || chatMutation.isPending}
                size="icon"
                data-testid="button-send-message"
              >
                {chatMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
