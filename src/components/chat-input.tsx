"use client"

import { useEffect, useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { ArrowUp } from "lucide-react"
import { ModelSelector } from "@/components/model-selector"
import { MODEL_COST_PER_TOKEN_USD } from "@/lib/model-cost";
import { useChat } from '@ai-sdk/react';
import { ExtendedUIMessage, ActiveChat } from "@/lib/types";

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
  chats,
  handleNewChat,
  handleNewMessage, 
  model,
  handleThinking, 
  waterLevel, 
  updateWaterLevel, 
  activeChatId,
  activeChatMessages,
  saveMessageToSupabase,
}: {
  chats: Chat[];
  handleNewChat: (message: string) => Promise<void>;
  handleNewMessage: (message: UIMessage) => void;
  model: string;
  handleThinking: (thinking: boolean) => void;
  waterLevel: number; 
  updateWaterLevel: (level: number) => void;
  activeChatId: string;
  activeChatMessages: UIMessage[];
  saveMessageToSupabase: (chatId: string, message: UIMessage) => Promise<void>;
}) {

  const [save, setSave] = useState(false);

  const { messages, input, handleInputChange, handleSubmit, } = useChat({
    api: `/api/chat?model=${encodeURIComponent(model)}`,
    key: activeChatId || "new-chat",
    initialMessages: activeChatMessages || [],
    onResponse: () => {
      handleThinking(false);
    },
    onFinish: async(finalMessage, { usage }) => {
      const chatExists = chats.some(chat => chat.id === activeChatId);
      if(!chatExists) {
        await handleNewChat(finalMessage.content)
      }

      setSave(true)

      //water level management
      const tokensUsed = usage.totalTokens || 0;
      const costPerToken = MODEL_COST_PER_TOKEN_USD[model]; 
      const costUSD = tokensUsed * costPerToken;
      updateWaterLevel(Math.max(waterLevel - costUSD, 0));
    },
  }); 


  //update parent with new messages for the UI only
  useEffect(() => {
    if (messages.length > 0) {
      handleNewMessage(messages.at(-1));
    }
  }, [messages, handleNewMessage]);


  useEffect(() => {
    if (save && messages.length >= 2) {
      console.log("sending messages to be saved:", messages.slice(-2));
      saveMessageToSupabase(activeChatId, messages.slice(-2));
      setSave(false);
    }
  }, [messages, save, activeChatId, saveMessageToSupabase]);


  const wrappedHandleSubmit = async (e: React.FormEvent) => {
    handleThinking(true); // AI starts thinking
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