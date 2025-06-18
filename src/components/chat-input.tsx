"use client"

import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Plus, ArrowUp } from "lucide-react"
import { ModelSelector } from "@/components/model-selector"
import { MODEL_COST_PER_TOKEN_USD } from "@/lib/model-cost";

import { useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import type { UIMessage } from 'ai';

type ChatInputProps = {
  model: string;
  onNewMessage: (message: UIMessage) => void; // Define onNewMessage as a prop
};

export function ChatInput({ model, onNewMessage, setIsThinking, waterLevel, setWaterLevel }: ChatInputProps) {

  const { messages, input, handleInputChange, handleSubmit,  } = useChat({
    api: `/api/chat?model=${encodeURIComponent(model)}`,
    key: model,
    onResponse: () => {
      setIsThinking(false);
    },
    onFinish: (finalMessage, { usage }) => {

      console.log("usage:", usage);
      const tokensUsed = usage.totalTokens || 0;
      console.log("Tokens used:", tokensUsed);

      const costPerToken = MODEL_COST_PER_TOKEN_USD[model]; 
      const WATER_CONVERSION = 0.001; // $ per liter
  
      const costUSD = tokensUsed * costPerToken;
      const waterUsed = costUSD / WATER_CONVERSION;
      setWaterLevel(prev => Math.max(prev - waterUsed, 0));
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
          <Button type="submit" disabled={waterLevel <= 0}><ArrowUp/></Button>
          {waterLevel <= 0 && (
            <p className="text-red-500 text-xs mt-1">
              Tank empty! Watch ads or donate to refill.
            </p>
          )}
        </div>
      </form>
  );
}