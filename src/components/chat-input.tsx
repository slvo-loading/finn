"use client"

import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Plus, ArrowUp } from "lucide-react"
import { ModelSelector } from "@/components/model-selector"

import { useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import type { UIMessage } from 'ai';

type ChatInputProps = {
  model: string;
  onNewMessage: (message: UIMessage) => void; // Define onNewMessage as a prop
};

export function ChatInput({ model, onNewMessage, setIsThinking }: ChatInputProps) {

  const { messages, input, handleInputChange, handleSubmit,  } = useChat({
    api: `/api/chat?model=${encodeURIComponent(model)}`,
    key: model,
    onResponse: () => {
      // Streaming has started
      setIsThinking(false);
    },
  }); 

  useEffect(() => {
    const last = messages.at(-1);
    if (last) onNewMessage({...last, model,}); // Send message to parent
  }, [messages, onNewMessage, model]);

  const wrappedHandleSubmit = async (e: any) => {
    setIsThinking(true); // AI starts thinking
    await handleSubmit(e);
  };
  
  
  return (
      <form className='bg-gray-100 w-2xl p-4 mb-5 flex flex-col rounded-xl' onSubmit={wrappedHandleSubmit}>
        <Textarea name="prompt" placeholder="Ask Anything" onChange={handleInputChange} value={input}/>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button><Plus/></Button>
            <ModelSelector/>
          </div>
          <Button type="submit"><ArrowUp/></Button>
        </div>
      </form>
  );
}