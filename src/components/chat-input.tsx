"use client"

import { useEffect, useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { ArrowUp, CircleStop } from "lucide-react"
import { ModelSelector } from "@/components/model-selector"
import { MODEL_COST_PER_TOKEN_USD } from "@/lib/model-cost";
import { useChat } from '@ai-sdk/react';
import { UIMessage, Chat, ExtendUIMessage } from '@/lib/types';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


export function ChatInput({ 
  model,
  chats,
  handleNewChat,
  handleNewMessage,
  handleThinking, 
  waterLevel, 
  updateWaterLevel, 
  activeChatId,
  activeChatMessages,
  saveMessageToSupabase,
}: {
  model: string;
  chats: Chat[];
  handleNewChat: (message: string) => Promise<void>;
  handleNewMessage: (message: UIMessage, model: string) => void;
  handleThinking: (thinking: boolean) => void;
  waterLevel: number; 
  updateWaterLevel: (level: number) => void;
  activeChatId: string;
  activeChatMessages: ExtendUIMessage[];
  saveMessageToSupabase: (chatId: string, message: ExtendUIMessage[], model: string) => Promise<void>;
}) {

  const [save, setSave] = useState(false);


  const { messages, input, handleInputChange, handleSubmit, status, stop } = useChat({
    api: `/api/chat?model=${encodeURIComponent(model)}`,
    key: activeChatId || "new-chat",
    onFinish: async(finalMessage, { usage }) => {

      //water level management
      const tokensUsed = usage.totalTokens || 0;
      const costPerToken = MODEL_COST_PER_TOKEN_USD[model]; 
      const costUSD = tokensUsed * costPerToken;
      updateWaterLevel(Math.max(waterLevel - costUSD, 0));
    },
  }); 


  //update parent with new messages for the UI only
  useEffect(() => {
    const latestMessage = messages.at(-1);
    if (messages.length > 0 && latestMessage) {
      handleNewMessage(latestMessage, model);
    }
  }, [messages]);


  useEffect(() => {
    if (status === "ready" && messages.length >= 2 && save) {
      console.log("sending messages to be saved:", messages.slice(-2));
      saveMessageToSupabase(activeChatId, messages.slice(-2), model);
      setSave(false);
    }
  }, [messages, status, activeChatId, saveMessageToSupabase]);

  useEffect(() => {
    if (status === 'submitted') {
      handleThinking(true);
    } else {
      handleThinking(false);
    }
  }, [status, handleThinking]);

  const wrappedHandleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim() === '') {
      return;
    }
    if (!activeChatId || activeChatId === 'new-chat') {
      handleNewChat(input.trim());
    }
    setSave(true);
    handleSubmit(e);
  }

  useEffect(() => {
    console.log("ChatInput status changed:", status);
  }, [status]);



  return (
      <form className='bg-gray-100 w-2xl p-4 mb-5 flex flex-col rounded-xl' onSubmit={wrappedHandleSubmit}>
        <Textarea name="prompt" placeholder="Ask anything" onChange={handleInputChange} value={input} disabled={status !== 'ready'}/>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* <Button><Plus/></Button> */}
            <ModelSelector/>
          </div>
          
          {waterLevel > 0 ? (
            status === "submitted" || status === "streaming" ? (
              <Button type="button" onClick={() => stop()}>
              <CircleStop />
              </Button>
            ) : (
              <Button type="submit">
                <ArrowUp />
              </Button>
            )
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