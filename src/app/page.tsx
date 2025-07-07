"use client"

import React from "react"
import { useState, useEffect, useCallback } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { Button } from "@/components/ui/button"
import { Fish, ShoppingBasket, Sparkles } from "lucide-react"
import { RefillButton } from "@/components/refill-button"
import { WaterTank } from "@/components/water-tank"
import { useRouter } from "next/navigation";
import { CoinDisplay } from "@/components/coin-display"
import { ChatArea } from "@/components/chat-area"
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";
import { Chat, UIMessage, ExtendUIMessage } from "@/lib/types";
import { generateChatTitle } from "@/app/actions/generate-title";
import { ResetTutorial } from "@/components/auth/reset-tutorial";
import { GoToLogin } from "@/components/auth/goto-login";
import { GoToSignUp } from "@/components/auth/goto-signup"
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

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"

export default function Home() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string>(uuidv4());
  const [activeChatMessages, setActiveChatMessages] = useState<ExtendUIMessage[]>([]);

  const [waterLevel, setWaterLevel] = useState(0.10); // % or liters
  const fullTank = 0.10;
  const [coins, setCoins] = useState(0);
  const adRefillAmount = 0.01

  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [showTutorial, setShowTutorial] = useState(true);
  const [checkingStorage, setCheckingStorage] = useState(true);


  // fetches user from supabase
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN') {
          setUser(session?.user || null);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          // Optional: Clear any user-specific data
          setChats([]);
          setActiveChatMessages([]);
          setActiveChatId(uuidv4());
        }
      }
  );

    const getCurrentUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data.user) {
        setUser(data.user);
      }
    };

    getCurrentUser();

    // Cleanup subscription on unmount
    return () => subscription.unsubscribe();
  }, []);


  useEffect(() => {
    const hasSeen = localStorage.getItem("seenTutorial");
    if (hasSeen === "true") {
      setShowTutorial(false);
    } else {
      setShowTutorial(true);
    }

    setCheckingStorage(false);
  }, []);


  const handleCloseTutorial = () => {
    localStorage.setItem("seenTutorial", "true");
    setShowTutorial(false);
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

  useEffect(() => {
    console.log("Fetched chats:", chats);
  }, [chats]);


  // new chat functions
  const openNewChat = () => {
    console.log("Opening new chat");
    setActiveChatId(uuidv4());
    setActiveChatMessages([]);
  };


  const handleNewChat = async (message: string) => {
    if (!user) {
      console.error("User not authenticated");
      return;
    }

    const title = await generateChatTitle(message);

    const chatId = uuidv4();
    const newChat = {
      id: chatId,
      user_id: user.id,
      title: title,
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


  // selecting existing chat
  const handleSelectedChat = async (chatId: string) => {
    console.log("Selecting chat with ID:", chatId);

    setActiveChatId(chatId)
    const messages = await fetchMessages(chatId);

    if (messages.length > 0) {
      setActiveChatMessages(messages);
    } else {
      console.warn("No messages found for chat:", chatId);
    }
  };


  // loads messages for an existing chat
  const fetchMessages = async (chatId: string): Promise<ExtendUIMessage[]> => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("chat_id", chatId)
      .order("created_at", { ascending: true });
  
    if (error) {
      console.error("Error fetching messages:", error);
      return [];
    }
  
    const loadedMessages: ExtendUIMessage[] = data.map(msg => ({
      id: msg.id,
      role: msg.role,
      content: msg.content,
      model: msg.model,
      parts: msg.parts || [],
      createdAt: new Date(msg.created_at),
    }));

    return loadedMessages;
  };
  

  //updates the last messsage to stream for the ui
  const handleNewMessage = useCallback((message: UIMessage, messageModel: string) => {
    setActiveChatMessages((prevMessages) => {
      const last = prevMessages.at(-1);
      
      // If updating an existing message, preserve its model
      if (last?.id === message.id) {
        return [...prevMessages.slice(0, -1), {
          ...message,
          model: last.model || messageModel // Keep existing model or set new one
        }];
      } else {
        // New message - set the model
        return [...prevMessages, {
          ...message,
          model: messageModel // Set model for new message
        }];
      }
    });
  }, []);


  // on finish, save the final message to supabase
  const saveMessageToSupabase = async (chatId: string, messages: UIMessage[], model: string) => {
    console.log("messages recieved for saving:", messages);
    const messageRecords = messages.map(message => ({
      id: message.id,
      chat_id: chatId,
      user_id: user.id,
      role: message.role,
      content: message.content,
      parts: message.parts,
      model: model,
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
    } 
  }, [activeChatId]);


  //deletes a chat
  const deleteChat = async (chatId: string) => {
    const { error } = await supabase
      .from("chats")
      .delete()
      .eq("id", chatId);
  
    if (error) {
      console.error("Error deleting chat:", error);
    } else {
      if (activeChatId === chatId) {
        // Reset active chat if the deleted chat was active
        setActiveChatId(uuidv4());
        setActiveChatMessages([]);
      }

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


  const updateWaterLevel = (level: number) => {
    setWaterLevel(level);
    // update supabase later
  };


  if (checkingStorage) return null;


  return (
    <div className="flex h-screen w-screen overflow-hidden">

      {showTutorial && (
        <div className="fixed inset-0 z-[9999] h-full w-full bg-black/50 flex items-center justify-center">
            <div className="w-full max-w-3xl mx-auto h-full max-h-150 bg-white rounded-lg shadow-lg py-10 flex flex-col items-center justify-between">
                <div className="flex flex-col items-center justify-center gap-4">
                <img
                    src="hydralogo.png"
                    alt="Team Logo"
                    className="w-full h-auto max-w-[1.5rem] transition-all object-contain"
                />
                <span className="text-2xl font-semibold" >Welcome to Hydra!</span>
                </div>
                
                <div className="flex items-start justify-center gap-5">
                    <div className="flex flex-col items-center justify-start gap-2">
                        <div className="bg-gray-200 w-50 h-50 rounded-md">
                        </div>
                        <div className="flex flex-col items-start justify-start gap-1 w-50">
                        <span className="font-semibold">Multi-Model Chat Hub</span>
                        <span className="text-left">Talk to different AI models in one place — fast, easy, flexible.</span>
                        </div>
                    </div>
                    
                    <div className="flex flex-col items-center justify-start gap-2">
                        <div className="bg-gray-200 w-50 h-50 rounded-md">
                        </div>
                        <div className="flex flex-col items-start justify-start gap-1 w-50">
                        <span className="font-semibold">Fish Tank</span>
                        <span className="text-left">Each model uses water. Refill by watching ads that fund clean water charities.</span>
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-start gap-2">
                        <div className="bg-gray-200 w-50 h-50 rounded-md">
                        </div>
                        <div className="flex flex-col items-start justify-start gap-1 w-50">
                        <span className="font-semibold">Guppy Gacha</span>
                        <span className="text-left">Watch ads to earn coins. Spend them to unlock fish and decorate your tank.</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => {router.push('/auth'); handleCloseTutorial();}}><span>Log In</span></Button>
                  <Button size="sm" onClick={() => {router.push('/auth'); handleCloseTutorial();}}><span>Sign Up</span></Button>
                  <span>|</span>
                  <Button variant="link" size="sm" onClick={handleCloseTutorial}>
                    <span>Stay Logged Out</span>
                  </Button>
                </div>
            </div>
        </div>
      )}

      {/* left sidebar */}
      {user && (<AppSidebar openNewChat={openNewChat} handleSelectedChat={handleSelectedChat} chats={chats} deleteChat={deleteChat} renameChat={renameChat}/>
      )}

      <ResizablePanelGroup direction="horizontal" autoSaveId="resizable-panel-group">
        <ResizablePanel className="flex flex-col">
            <div className='flex-1 flex flex-col min-w-0 items-center min-h-0'>
              <div className="flex justify-between w-full px-2 pt-2 flex-shrink-0 gap-2">
                {!user && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => router.push('/auth')}><span>Log In</span></Button>
                    <Button size="sm" onClick={() => router.push('/auth')}><span>Sign Up</span></Button>
                    <ResetTutorial onReset={() => setShowTutorial(true)}/>
                  </div>
                )}
                <div className="w-full flex items-center justify-end gap-2">
                <CoinDisplay coins={coins}/>
                <RefillButton waterLevel={waterLevel} setWaterLevel={setWaterLevel} coins={coins} setCoins={setCoins} adRefillAmount={adRefillAmount} fullTank={fullTank}/>
                </div>
              </div>

              <ChatArea
                chats={chats}
                activeChatId={activeChatId}
                activeChatMessages={activeChatMessages}
                handleNewMessage={handleNewMessage}
                waterLevel={waterLevel}
                updateWaterLevel={updateWaterLevel}
                handleNewChat={handleNewChat}
                saveMessageToSupabase={saveMessageToSupabase}
              />

            </div>
            
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={25}>
          <div className="flex flex-col h-full w-full pb-5 pt-2 px-3 gap-5 items-center justify-between">
            <div className="flex justify-between w-full">
              {user && (
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => router.push('/fish-lottery')}>
                      <Fish className="w-1 h-1"/>
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent className="flex justify-center w-fit px-2 py-1 text-xs">
                      <p className="text-[8px] font-medium">Guppy Gacha</p>
                  </HoverCardContent>
                </HoverCard>
              )}

              {!user && (<Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm"><Fish/></Button>
                </DialogTrigger>
                <DialogContent className="w-sm h-80 py-12 px-12 [&>button]:hidden">
                  <DialogHeader>
                    <DialogTitle className="text-center">Want to access Guppy Gacha?</DialogTitle>
                    <DialogDescription className="text-center">
                      Sign in to unlock smarter, eco-friendly chats and unlock rare aquarium buddies.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col items-center justify-center gap-3">
                    <GoToLogin />
                    <GoToSignUp />
                    <DialogClose asChild>
                    <Button variant="link" size="sm">
                      Stay Logged Out
                    </Button>
                    </DialogClose>
                  </div>
                </DialogContent>
              </Dialog>
              )}

              <div className="flex gap-2">

              {user && (
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Sparkles className="w-1 h-1"/>
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent className="flex justify-center w-fit px-2 py-1 text-xs">
                      <p className="text-[8px] font-medium">Decorate</p>
                  </HoverCardContent>
                </HoverCard>
              )}

              {!user && (<Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm"> <Sparkles className="w-1 h-1"/></Button>
                </DialogTrigger>
                <DialogContent className="w-sm h-80 py-12 px-12 [&>button]:hidden">
                  <DialogHeader>
                    <DialogTitle className="text-center">Want to customize your tank?</DialogTitle>
                    <DialogDescription className="text-center">
                      Sign in to unlock smarter, eco-friendly chats and start decorating your aquarium.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col items-center justify-center gap-3">
                    <GoToLogin />
                    <GoToSignUp />
                    <DialogClose asChild>
                    <Button variant="link" size="sm">
                      Stay Logged Out
                    </Button>
                    </DialogClose>
                  </div>
                </DialogContent>
              </Dialog>)}

              {user && (
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button variant="outline" size="sm">
                    <ShoppingBasket className="w-1 h-1"/>
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="flex justify-center w-fit px-2 py-1 text-xs">
                    <p className="text-[8px] font-medium">Shop</p>
                </HoverCardContent>
              </HoverCard>
              )}

              {!user && (<Dialog>
                <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                      <ShoppingBasket className="w-1 h-1"/>
                    </Button>
                </DialogTrigger>
                <DialogContent className="w-sm h-80 py-12 px-12 [&>button]:hidden">
                  <DialogHeader>
                    <DialogTitle className="text-center">Want to browse the fish store?</DialogTitle>
                    <DialogDescription className="text-center">
                      Sign in to unlock smarter, eco-friendly chats and start shopping for aquarium upgrades.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col items-center justify-center gap-3">
                    <GoToLogin />
                    <GoToSignUp />
                    <DialogClose asChild>
                    <Button variant="link" size="sm">
                      Stay Logged Out
                    </Button>
                    </DialogClose>
                  </div>
                </DialogContent>
              </Dialog>)}


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
