"use client"

import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Plus, ArrowUp } from "lucide-react"
import { ModelSelector } from "@/components/model-selector"
import { MODEL_COST_PER_TOKEN_USD } from "@/lib/model-cost";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import type { UIMessage } from 'ai';

type ChatInputProps = {
  model: string;
  onNewMessage: (message: UIMessage) => void; 
  setIsThinking: (value: boolean) => void;
  waterLevel: number; 
  setWaterLevel: (value: number) => void;
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
  
      const costUSD = tokensUsed * costPerToken;
      setWaterLevel(prev => Math.max(prev - costUSD, 0));
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
        <Textarea name="prompt" placeholder="Ask anything" onChange={handleInputChange} value={input}/>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* <Button><Plus/></Button> */}
            <ModelSelector/>
          </div>
          
          {waterLevel > 0 ? (
            <Button type="submit">
              <ArrowUp />
            </Button>
          ) : (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button">
                  <ArrowUp />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Your tank is empty!</AlertDialogTitle>
                  <AlertDialogDescription>
                    Watch ads or donate to refill your tank and continue chatting.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Close</AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

        </div>
      </form>
  );
}