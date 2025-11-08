/**
 * MessageInput Component
 * Input form for sending messages in conversation
 */

import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Textarea } from '@/shared/components/ui/textarea';

interface MessageInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

export function MessageInput({ onSend, isLoading, placeholder }: MessageInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (message.trim() && !isLoading) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Submit on Ctrl/Cmd + Enter
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <Card className="p-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || "Type your response..."}
          className="min-h-[100px] resize-y"
          disabled={isLoading}
        />

        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Press Ctrl+Enter to send
          </p>

          <Button type="submit" disabled={!message.trim() || isLoading} className="gap-2">
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Send
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}
