"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { ChatInput } from "@/components/chat-input"
import React from "react"
import { useState } from "react"

type Chat = {
  name: string;
  messages: string[]; // Adjust the type of messages if needed
  index: number;
};

export default function Home() {
  const [chats, setChats] = useState<Chat[]>([]);

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

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* left sidebar */}
      <AppSidebar createChat={createNewChat} chats={chats}/>
      
      {/* text area */}
      <ChatInput />

      {/* water popup */}
      <div className="flex-shrink-0 flex flex-col items-center justify-center bg-white h-full w-64">
        <div className="w-3/4 h-6/7 bg-gray-500"></div>
      </div>
    </div>
  )
}
