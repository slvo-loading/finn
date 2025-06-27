"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { ChatInput } from "@/components/chat-input"
import React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { useModelSelector } from "@/hooks/useModelSelector"
import { RenderResponse } from "@/components/render-response"
import type { UIMessage } from 'ai';
import { Button } from "@/components/ui/button"
import { Fish, ShoppingBasket, Shell, Sparkles } from "lucide-react"
import { RefillButton } from "@/components/refill-button"
import { WaterTank } from "@/components/water-tank"
import { useRouter } from "next/navigation";
import { CoinDisplay } from "@/components/coin-display"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from 'uuid';

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

  const router = useRouter();


  // creates a new chat in supabase
  const createNewChat = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    console.log("Session access token:", sessionData?.session?.access_token);

  
    // 🔑 Use getUser instead of getSession for clarity
    const { data: userData, error: userError } = await supabase.auth.getUser();
  
    console.log("User data:", userData);
    if (userError) {
      console.error("User error:", userError);
      return null;
    }

    console.log("Creating new chat...");
  
    const user_id = userData?.user?.id;
    if (!user_id) {
      console.error("No user found.");
      return null;
    }
    console.log("User ID:", user_id);
  
    const { data, error } = await supabase
      .from("chats")
      .insert([
        {
          id: uuidv4(),
          user_id: user_id,
          title: "Untitled Chat",
          messages: [],
        },
      ])
      .select()
      .single();
  
    if (error) {
      console.error("Error creating new chat:", error);
      return null;
    }
  
    console.log("New chat created:", data);
    return data;
  };

  // fetches all chats from supabase
  useEffect(() => {
    fetchChats();
  }, []);
  
  const fetchChats = async () => {
    const { data, error } = await supabase
      .from("chats")
      .select("*")
      .order("updated_at", { ascending: false });
  
    if (error) {
      console.error("Error fetching chats:", error);
    } else {
      setChats(data);
    }
  };
  
  //creates and fetches chats
  const handleNewChat = async () => {
    const newChat = await createNewChat();
    if (newChat) {
      console.log("New chat created:", newChat);
      setChats((prev) => [newChat, ...prev]);
      fetchChats(); 
      console.log("Chats after creation:", chats);
    }
  };

  //deletes a chat
  const deleteChat = async (chatId) => {
    const { error } = await supabase
      .from("chats")
      .delete()
      .eq("id", chatId);
  
    if (error) {
      console.error("Error deleting chat:", error);
    } else {
      // Remove from local state for instant UI update
      setChats((prev) => prev.filter((chat) => chat.id !== chatId));
    }
  };

  // renames a chat
  // const renameChat = async (chatId, newTitle) => {
  //   const { error } = await supabase
  //     .from("chats")
  //     .update({ title: newTitle, updated_at: new Date().toISOString() })
  //     .eq("id", chatId);
  
  //   if (error) {
  //     console.error("Error renaming chat:", error);
  //   } else {
  //     // Update local state for immediate UI refresh
  //     setChats((prev) =>
  //       prev.map((chat) =>
  //         chat.id === chatId ? { ...chat, title: newTitle } : chat
  //       )
  //     );
  //   }
  // };
  
  
  //scroll feature
  const chatContainer = useRef<HTMLDivElement>(null);
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
      <AppSidebar createChat={handleNewChat} chats={chats} deleteChat={deleteChat}/>

      {/* water popup */}
      {/* <div className="flex-shrink-0 flex items-center justify-center bg-white h-full w-64">
        <div className="w-3/4 h-full my-5 border-2 border-gray-200"></div>
      </div> */}
      <ResizablePanelGroup direction="horizontal" autoSaveId="resizable-panel-group">
        <ResizablePanel className="flex flex-col">
                {/* text area */}
            <div className='flex-1 flex flex-col min-w-0 items-center min-h-0'>
              <div className="flex justify-end w-full px-2 pt-2 flex-shrink-0 gap-2">
                <CoinDisplay coins={coins}/>
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
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button variant="outline" size="icon" className=" w-7 h-7" onClick={() => router.push('/fish-lottery')}>
                    <Fish className="w-1 h-1"/>
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="flex justify-center w-fit px-2 py-1 text-xs">
                    <p className="text-[8px] font-medium">Guppy Gacha</p>
                </HoverCardContent>
              </HoverCard>
              <div className="flex gap-2">

              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button variant="outline" size="icon" className=" w-7 h-7">
                    <Sparkles className="w-1 h-1"/>
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="flex justify-center w-fit px-2 py-1 text-xs">
                    <p className="text-[8px] font-medium">Decorate</p>
                </HoverCardContent>
              </HoverCard>

              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button variant="outline" size="icon" className=" w-7 h-7">
                    <ShoppingBasket className="w-1 h-1"/>
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="flex justify-center w-fit px-2 py-1 text-xs">
                    <p className="text-[8px] font-medium">Shop</p>
                </HoverCardContent>
              </HoverCard>
              </div>
            </div>
            <WaterTank waterLevel={waterLevel} fullTank={fullTank}/>
            <div>
              <p>{Math.round(waterLevel / fullTank * 100)}%</p>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
    
  )
}
