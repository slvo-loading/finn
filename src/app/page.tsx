"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { ChatInput } from "@/components/chat-input"
import React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { useModelSelector } from "@/hooks/useModelSelector"
import { RenderResponse } from "@/components/render-response"
import type { UIMessage } from 'ai';
import { Button } from "@/components/ui/button"
import { Fish, ShoppingCart, Palette, Shell, SquarePlay } from "lucide-react"
import { RefillButton } from "@/components/refill-button"
import { WaterTank } from "@/components/water-tank"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

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

  const [waterLevel, setWaterLevel] = useState(0.10); // % or liters
  const fullTank = 0.10;
  const [coins, setCoins] = useState(0);
  const adRefillAmount = 0.01


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

  useEffect(() => {
    const interval = setInterval(() => {
      setCoins((c) => c + 1); // +1 coin every 10 sec
    }, 10000);
  
    return () => clearInterval(interval);
  }, []);
  
  

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* left sidebar */}
      <AppSidebar createChat={createNewChat} chats={chats}/>

      {/* water popup */}
      {/* <div className="flex-shrink-0 flex items-center justify-center bg-white h-full w-64">
        <div className="w-3/4 h-full my-5 border-2 border-gray-200"></div>
      </div> */}
      <ResizablePanelGroup direction="horizontal" autoSaveId="resizable-panel-group">
        <ResizablePanel className="flex flex-col">
                {/* text area */}
            <div className='flex-1 flex flex-col min-w-0 items-center min-h-0'>
              <div className="flex justify-end w-full px-2 pt-2 flex-shrink-0">
                <Button variant="ghost" size="sm">{coins} <Shell/></Button>
                <RefillButton waterLevel={waterLevel} setWaterLevel={setWaterLevel} coins={coins} setCoins={setCoins} adRefillAmount={adRefillAmount} fullTank={fullTank}/>
              </div>
              <div ref={chatContainer} className="flex-1 w-full max-w-2xl overflow-y-auto px-4 py-6 min-h-0 hide-scrollbar">
                <RenderResponse messages={allMessages} isThinking={isThinking} />
              </div>
              <div className="flex-shrink-0">
              <ChatInput model={model} onNewMessage={handleNewMessage} setIsThinking={setIsThinking} waterLevel={waterLevel} setWaterLevel={setWaterLevel}/>
              </div>
            </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={25}>
          <div className="flex flex-col h-full w-full pb-5 pt-2 px-3 gap-5 items-center justify-between">
            <div className="flex justify-between w-full">
                <Button variant="ghost" size="icon"><Fish/></Button>
              <div className="flex">
                <Button variant="ghost" size="icon"><Palette /></Button>
                <Button variant="ghost" size="icon"><ShoppingCart /></Button>
              </div>
            </div>
            <WaterTank waterLevel={waterLevel} fullTank={fullTank}/>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
    
  )
}
