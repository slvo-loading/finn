"use client"

import { useAuth } from "@/app/context/auth-provider"
import { useChats } from "@/app/context/chat-provider"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MODEL_COST_PER_TOKEN_USD } from "@/lib/model-cost"
import { useChat } from '@ai-sdk/react'
import { ArrowUp, CircleStop } from "lucide-react"
import { useEffect, useState } from "react"
import { Message } from "ai"

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
  chatId,
  isNewChat,
  model,
  handleThinking, 
  waterLevel, 
}: {
  chatId: string;
  isNewChat: boolean;
  model: string;
  handleThinking: (thinking: boolean) => void;
  waterLevel: number; 
}) {

  const [save, setSave] = useState(false);
  const { handleNewMessage, handleSaveMessages, activeChatMessages } = useChats();
  const { session } = useAuth();
  const [hasAppended, setHasAppended] = useState(false);

  const { messages, input, handleInputChange, handleSubmit, status, stop, append } = useChat({
    api: `/api/chat?model=${encodeURIComponent(model)}`,
    key: chatId,
    onFinish: async(finalMessage, { usage }) => {

      //water level management
      const tokensUsed = usage.totalTokens || 0;
      const costPerToken = MODEL_COST_PER_TOKEN_USD[model]; 
      const costUSD = tokensUsed * costPerToken;
      // updateWaterLevel(Math.max(waterLevel - costUSD, 0));
    },
});

  useEffect(() => {
    if(isNewChat && messages.length === 0 && activeChatMessages.length > 0) {
      const firstMessage = activeChatMessages[0];
      if (!firstMessage) return;
      const convertedMessage: Message = {
        id: firstMessage.id,
        role: firstMessage.role,
        content: firstMessage.content,
        createdAt: firstMessage.createdAt,
      };
      append(convertedMessage)
      setHasAppended(true);
    }
  }, [])

  //update parent with new messages for the UI only
  useEffect(() => {
    const latestMessage = messages.at(-1);
    if (messages.length > 1 && latestMessage && hasAppended) {
      handleNewMessage(latestMessage, model);
    }
  }, [messages]);


  //save messages to the database 
  useEffect(() => {
    if ( !chatId || !session ) {
      return;
    }

    if (status === "ready" && messages.length >= 2 && save) {
      console.log("sending messages to be saved:", messages.slice(-2));
      handleSaveMessages( chatId);
      setSave(false);
    }
  }, [messages, status, chatId, handleSaveMessages]);


  //handle thinking state for UI
  useEffect(() => {
    if (status === 'submitted') {
      handleThinking(true);
    } else {
      handleThinking(false);
    }
  }, [status, handleThinking]);


  useEffect(() => {
    console.log("ChatInput status changed:", status);
  }, [status]);

  useEffect(() => {
    console.log("ai sdk's messages:", messages);
  }, [messages.length]);


  return (
      <form className='bg-gray-100 w-2xl p-4 mb-5 flex flex-col rounded-xl' onSubmit={handleSubmit}>
        <Textarea name="prompt" placeholder="Ask anything" onChange={handleInputChange} value={input} disabled={status !== 'ready'}/>
        <div className="flex items-center justify-between">
          
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