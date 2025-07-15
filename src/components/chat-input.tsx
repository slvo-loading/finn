"use client"

import { useAuth } from "@/app/context/auth-provider"
import { useChats } from "@/app/context/chat-provider"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MODEL_COST_PER_TOKEN_USD } from "@/lib/model-cost"
import { useChat } from '@ai-sdk/react'
import { ArrowUp, CircleStop } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import { Message } from "ai"
import { v4 as uuidv4 } from 'uuid'

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
  firstMessageContent,
  model,
  handleThinking, 
  waterLevel, 
  updateWaterLevel,
}: {
  firstMessageContent: string | null;
  model: string;
  handleThinking: (thinking: boolean) => void;
  waterLevel: number; 
  updateWaterLevel: (level: number) => void;
}) {

  const { handleNewMessage, handleSaveMessages, activeChatId, save, activeChatMessages } = useChats();
  const { session } = useAuth();
  const hasAppended = useRef(false);

  const { messages, input, handleInputChange, handleSubmit, status, stop, append } = useChat({
    api: `/api/chat?model=${encodeURIComponent(model)}`,
    headers: {
      'Authorization': `Bearer ${session?.access_token || ''}`,
    },
    key: activeChatId,
    initialMessages: activeChatMessages.slice(-8),
    onFinish: async(finalMessage, { usage }) => {

      //water level management
      const tokensUsed = usage.totalTokens || 0;
      const costPerToken = MODEL_COST_PER_TOKEN_USD[model]; 
      const costUSD = tokensUsed * costPerToken;
      updateWaterLevel(Math.max(waterLevel - costUSD, 0));
    },
});

useEffect(() => {
  if (firstMessageContent && !hasAppended.current) {
    // Check if we've already processed this message; could move this to db
    const processedKey = `processed-message-${activeChatId}`;
    
    if (!localStorage.getItem(processedKey)) {
      const convertedMessage: Message = {
        id: uuidv4(),
        role: 'user',
        content: firstMessageContent,
        createdAt: new Date(),
      };
      
      append(convertedMessage);
      hasAppended.current = true;
      
      // Mark as processed
      localStorage.setItem(processedKey, 'true');
    } else {
      // We've already processed this message; could move this to db
      console.log("Skipping already processed message:", firstMessageContent.substring(0, 20));
      hasAppended.current = true;
    }
  }
}, [firstMessageContent, activeChatId]);


  //update parent with new messages for the UI only
  useEffect(() => {
    const latestMessage = messages.at(-1);
    if (messages.length > 0 && latestMessage) { 
      handleNewMessage(latestMessage, model);
    }
  }, [messages]);


  //save messages to the database 
  useEffect(() => {
    if (!session ) {
      return;
    }
    console.log("can save?:", status === "ready" && messages.length >= 2 && save);
    console.log("activeChatId for save:", activeChatId);
    if (status === "ready" && messages.length >= 2 && save) {
      handleSaveMessages(activeChatId);
    }
  }, [status, save]);


  //handle thinking state for UI
  useEffect(() => {
    if (status === 'submitted') {
      handleThinking(true);
    } else {
      handleThinking(false);
    }
  }, [status, handleThinking]);


  useEffect(() => {
    console.log("status changed:", status);
  }, [status]);

  const wrappedHandleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(e);
  }

  return (
      <form className='bg-gray-100 w-2xl p-4 mb-5 flex flex-col rounded-xl' onSubmit={wrappedHandleSubmit}>
        <Textarea name="prompt" placeholder="Ask anything" onChange={handleInputChange} value={input} disabled={status !== 'ready'}/>
        <div className="flex items-center justify-between">
          
          {/* {waterLevel > 0 ? ( */}
            {/* status === "submitted" || status === "streaming" ? (
              <Button type="button" onClick={() => stop()}>
              <CircleStop />
              </Button>
            ) : ( */}
              <Button type="submit">
                <ArrowUp />
              </Button>
            {/* )
          ) : ( */}
            {/* <AlertDialog>
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
          )} */}
        </div>
      </form>
  );
}