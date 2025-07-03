"use client"

import React from "react"
import { useState, useEffect, useCallback } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { useModelSelector } from "@/hooks/useModelSelector"
import { Button } from "@/components/ui/button"
import { Fish, ShoppingBasket, Sparkles } from "lucide-react"
import { RefillButton } from "@/components/refill-button"
import { WaterTank } from "@/components/water-tank"
import { useRouter } from "next/navigation";
import { CoinDisplay } from "@/components/coin-display"
import { ChatArea } from "@/components/chat-area"
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";
import { Chat, UIMessage } from "@/lib/types";
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


export default function Home() {
  const model = useModelSelector((state) => state.model);
  const [chats, setChats] = useState<Chat[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [firstMessage, setFirstMessage] = useState<string | null>(null);
  const [activeChatId, setActiveChatId] = useState<string>(uuidv4());
  const [activeChatMessages, setActiveChatMessages] = useState<UIMessage[]>([]);

  const [waterLevel, setWaterLevel] = useState(0.10); // % or liters
  const fullTank = 0.10;
  const [coins, setCoins] = useState(0);
  const adRefillAmount = 0.01

  const router = useRouter();
  const [user, setUser] = useState<any>(null);


  // fetches user from supabase
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error);
      } else {
        setUser(data.user);
      }
    };

    fetchUser();
  }, []);


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

  useEffect(() => {
    console.log("Fetched chats:", chats);
  }, [chats]);


  // new chat functions
  const openNewChat = () => {
    console.log("Opening new chat");
    setActiveChatId(uuidv4());
    setActiveChatMessages([]);

    console.log("New Chat", activeChatId);
    console.log("New Messages", activeChatMessages);
  };


  const handleNewChat = async (message: string) => {
    if (!user) {
      console.error("User not authenticated");
      return;
    }

    const chatId = uuidv4();
    const newChat = {
      id: chatId,
      user_id: user.id,
      title: generateTitle(message),
    };
    console.log("New chat object:", newChat);

    try {
      const { data, error } = await supabase
        .from("chats")
        .insert([newChat])
        .select()
        .single();

      if (error) throw error;

      setActiveChatId(chatId);
      console.log("New chat created:", activeChatId);

      fetchChats();
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };


  const generateTitle = (message: string) => {
    return message.split(" ").slice(0, 5).join(" ").substring(0, 50);
  };


  // selecting existing chat
  const handleSelectedChat = async (chatId: string) => {
    console.log("Selecting chat with ID:", chatId);

    const { data , error } = await supabase
    .from("chats")
    .select("id")
    .eq("id", chatId)
    .single();

    if (error) {
      console.error("Error fetching chat:", error);
      return;
    }

    setActiveChatId(chatId)
    console.log("Selected Chat:", activeChatId);

    const messages = await fetchMessages(chatId);
    setActiveChatMessages(messages)
    console.log("Fetched messages for chat:", activeChatMessages);
    
  };


  // loads messages for an existing chat
  const fetchMessages = async (chatId: string): Promise<UIMessage[]> => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("chat_id", chatId)
      .order("created_at", { ascending: true });
  
    if (error) {
      console.error("Error fetching messages:", error);
      return [];
    }
  
    return data.map((msg) => ({
      id: msg.id,
      role: msg.role,
      content: msg.content,
      parts: msg.parts,
      model: msg.model,
      createdAt: msg.created_at,
    }));
  };
  

  //updates the last messsage to stream for the ui
  const handleNewMessage = useCallback((message: UIMessage) => {
    setActiveChatMessages((prevMessages) => {
      const last = prevMessages.at(-1);
  
      if (last?.id === message.id) {
        // Streaming continuation — replace the last message
        return [...prevMessages.slice(0, -1), message];
      } else {
        // New message — append it
        return [...prevMessages, message];
      }
    });
  }, []);


  // on finish, save the final message to supabase
  const saveMessageToSupabase = async (chatId: string, messages: UIMessage[]) => {
    console.log("messages recieved for saving:", messages);
    const messageRecords = messages.map(message => ({
      id: message.id,
      chat_id: chatId,
      user_id: user.id,
      role: message.role,
      content: message.content,
      parts: message.parts,
      model: "deepseek",
      // model: message.model,
      created_at: message.createdAt
    }));
    
    const { data, error } = await supabase
    .from("messages")
    .insert(messageRecords);

    if (error) {
      console.error("Error saving message:", error);
    } else {
      console.log("Message saved successfully:", data);
    }
  };

  // checks for when activeChat changes
  useEffect(() => {
    if (activeChatId) {
      console.log("✅ Active chat has been updated:", activeChatId);
    } else {
      console.log("🕳️ No active chat id selected.");
    }
  }, [activeChatId]);

  useEffect(() => {
    console.log("activeChatMessages updated:", activeChatMessages);
  }, [activeChatMessages]);
  

  //deletes a chat
  const deleteChat = async (chatId: string) => {
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
  const renameChat = async (chatId: string, newTitle: string) => {
    const { error } = await supabase
      .from("chats")
      .update({ title: newTitle })
      .eq("id", chatId);
  
    if (error) {
      console.error("Error renaming chat:", error);
    } else {
      // Update local state for immediate UI refresh
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === chatId ? { ...chat, title: newTitle } : chat
        )
      );
    }
  };


  const handleThinking = (thinking: boolean) => {
    setIsThinking(thinking);
  }


  const updateWaterLevel = (level: number) => {
    setWaterLevel(level);
    // update supabase later
  };


  const clearFirstMessage = () => {
    console.log("Clearing first message");
    setFirstMessage(null);
  };


  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* left sidebar */}
      <AppSidebar openNewChat={openNewChat} handleSelectedChat={handleSelectedChat} chats={chats} deleteChat={deleteChat} renameChat={renameChat}/>

      <ResizablePanelGroup direction="horizontal" autoSaveId="resizable-panel-group">
        <ResizablePanel className="flex flex-col">
            <div className='flex-1 flex flex-col min-w-0 items-center min-h-0'>
              <div className="flex justify-end w-full px-2 pt-2 flex-shrink-0 gap-2">
                <CoinDisplay coins={coins}/>
                <RefillButton waterLevel={waterLevel} setWaterLevel={setWaterLevel} coins={coins} setCoins={setCoins} adRefillAmount={adRefillAmount} fullTank={fullTank}/>
              </div>

              {/* text area
              { activeChat ? (
              <div>
                <div ref={chatContainer} className="flex-1 w-full max-w-2xl overflow-y-auto px-4 py-6 min-h-0 hide-scrollbar">
                  <RenderResponse messages={allMessages} isThinking={isThinking} />
                </div>
                <div className="flex-shrink-0">
                <ChatInput model={model} setIsThinking={setIsThinking} waterLevel={waterLevel} setWaterLevel={setWaterLevel}/>
                </div>
              </div>
              ) : (
              <div ref={chatContainer} className="flex-1 w-full max-w-2xl overflow-y-auto px-4 py-6 min-h-0 hide-scrollbar">
                <Button onClick={() => handleNewChat("Hi!", "gpt-4o")}></Button>
                </div>
              )} */}

              <ChatArea
                chats={chats}
                activeChatId={activeChatId}
                activeChatMessages={activeChatMessages}
                handleNewMessage={handleNewMessage}
                model={model}
                isThinking={isThinking}
                handleThinking={handleThinking}
                waterLevel={waterLevel}
                updateWaterLevel={updateWaterLevel}
                handleNewChat={handleNewChat}
                saveMessageToSupabase={saveMessageToSupabase}
                firstMessage={firstMessage}
                clearFirstMessage={clearFirstMessage}
              />

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
