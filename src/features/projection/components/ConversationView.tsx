/**
 * ConversationView Component
 * Display conversation history with message bubbles
 */

import { useEffect, useRef } from 'react';
import { User, Bot } from 'lucide-react';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { Card } from '@/shared/components/ui/card';
import type { ConversationMessage } from '../types';

interface ConversationViewProps {
  messages: ConversationMessage[];
  participantRole: string;
  isLoading?: boolean;
}

export function ConversationView({ messages, participantRole, isLoading }: ConversationViewProps) {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  if (messages.length === 0 && !isLoading) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">
          The conversation will appear here. Start by responding to the opening message below.
        </p>
      </Card>
    );
  }

  return (
    <ScrollArea className="h-[500px]">
      <div className="space-y-4 pr-4">
        {messages.map((message) => {
          const isUser = message.role === 'user';
          const timestamp = new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          });

          return (
            <div
              key={message.id}
              className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'
                }`}
              >
                {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>

              {/* Message Bubble */}
              <div className={`flex-1 max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium">
                    {isUser ? 'You' : participantRole}
                  </span>
                  <span className="text-xs text-muted-foreground">{timestamp}</span>
                </div>

                <div
                  className={`p-3 rounded-lg ${
                    isUser
                      ? 'bg-primary text-primary-foreground rounded-tr-none'
                      : 'bg-muted rounded-tl-none'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <Bot className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium">{participantRole}</span>
              </div>
              <div className="p-3 rounded-lg bg-muted rounded-tl-none">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Auto-scroll anchor */}
        <div ref={endOfMessagesRef} />
      </div>
    </ScrollArea>
  );
}
