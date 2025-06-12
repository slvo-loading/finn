"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { ChatInput } from "@/components/chat-input"
import React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { useModelSelector } from "@/hooks/useModelSelector"
import { RenderResponse } from "@/components/render-response"
import type { UIMessage } from 'ai';

type Chat = {
  name: string;
  messages: string[]; // Adjust the type of messages if needed
  index: number;
};

export default function Home() {
  const model = useModelSelector((state) => state.model);
  const [chats, setChats] = useState<Chat[]>([]);

  const [allMessages, setAllMessages] = useState<UIMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);

  const createNewChat = () => {
    console.log("Creating new chat...")
    const newChat = {
      name: `Chat ${chats.length + 1}`,
      messages: [],
      index: chats.length + 1,
    }
    console.log("New chat created:", newChat)
    setChats((prev) => [...prev, newChat])
  }

  const chatContainer = useRef<HTMLDivElement>(null);

  //scroll feature
  const scroll = () => {
    const {offsetHeight, scrollHeight, scrollTop } = chatContainer.current as HTMLDivElement;
    if (scrollHeight >= scrollTop + offsetHeight) {
      chatContainer.current?.scrollTo(0, scrollHeight + 200)
    } 
  }

  useEffect(() => {
    scroll();
  }, [allMessages]);

  const handleNewMessage = useCallback((message: UIMessage) => {
    setAllMessages((prev) => {
      const last = prev.at(-1);
  
      if (last?.id === message.id) {
        // streaming continuation — replace last
        return [...prev.slice(0, -1), message];
      }
  
      // new user message or new assistant message
      return [...prev, message];
    });
  }, []);
  

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* left sidebar */}
      <AppSidebar createChat={createNewChat} chats={chats}/>
      
      {/* text area */}
      <div className='flex-1 flex flex-col bg-white min-w-0 items-center'>
      <div ref={chatContainer} className="h-full w-2xl bg-white flex flex-col overflow-y-auto py-6">
        <RenderResponse messages={allMessages} isThinking={isThinking} />
      </div>
      <ChatInput model={model} onNewMessage={handleNewMessage} setIsThinking={setIsThinking}/>
      </div>

      {/* water popup */}
      <div className="flex-shrink-0 flex flex-col items-center justify-center bg-white h-full w-64">
        <div className="w-3/4 h-6/7 bg-gray-500"></div>
      </div>
    </div>
  )
}
