"use client"

import { ChatInput } from "@/components/chat-input"
import React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { useModelSelector } from "@/hooks/useModelSelector"
import { RenderResponse } from "@/components/render-response"
import type { UIMessage } from 'ai';
import { Button } from "@/components/ui/button"
import { Fish, ShoppingBasket, Sparkles } from "lucide-react"
import { RefillButton } from "@/components/refill-button"
import { WaterTank } from "@/components/water-tank"
import { useRouter } from "next/navigation";
import { CoinDisplay } from "@/components/coin-display"
import { GoToLogin } from "@/components/auth/goto-login"
import { GoToSignUp } from "@/components/auth/goto-signup"

//for testing
import { ResetTutorial } from "@/components/auth/reset-tutorial"

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
  const model = useModelSelector((state) => state.model);

  const [allMessages, setAllMessages] = useState<UIMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);
  const [checkingStorage, setCheckingStorage] = useState(true);

  const [waterLevel, setWaterLevel] = useState(0.03); // % or liters
  const fullTank = 0.10;
  const [coins, setCoins] = useState(0);
  const adRefillAmount = 0.01

  const router = useRouter();


  const chatContainer = useRef<HTMLDivElement>(null);

  //scroll feature
  const scroll = () => {
    const el = chatContainer.current;
    if (!el) return; // ❗ Prevent error if ref is not yet attached
  
    const { offsetHeight, scrollHeight, scrollTop } = el;
    
    if (scrollHeight >= scrollTop + offsetHeight) {
      el.scrollTo(0, scrollHeight + 200);
    }
  };
  

  useEffect(() => {
    scroll();
  }, [allMessages]);


//for streaming messages
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

  //only show tutorial on the first visit
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

  if (checkingStorage) return null;
  

  return (
        <div className="flex h-screen w-screen overflow-hidden">
          {showTutorial && (
            <div className="fixed inset-0 z-[9999] h-full w-full bg-black/50 flex items-center justify-center">
                {/* <Tutorial setShowTutorial={setShowTutorial}/> */}
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
                      <Button variant="outline" size="sm" onClick={() => router.push('/auth')}><span>Log In</span></Button>
                      <Button size="sm" onClick={() => router.push('/auth')}><span>Sign Up</span></Button>
                      <span>|</span>
                      <Button variant="link" size="sm" onClick={handleCloseTutorial}>
                        <span>Stay Logged Out</span>
                      </Button>
                    </div>
                </div>
            </div>
          )} 

        <ResizablePanelGroup direction="horizontal" autoSaveId="resizable-panel-group">
          <ResizablePanel className="flex flex-col">
                  {/* text area */}
              <div className='flex-1 flex flex-col min-w-0 items-center min-h-0'>
                <div className="flex justify-between w-full px-2 pt-2 flex-shrink-0">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => router.push('/auth')}><span>Log In</span></Button>
                    <Button size="sm" onClick={() => router.push('/auth')}><span>Sign Up</span></Button>
                    <ResetTutorial onReset={() => setShowTutorial(true)}/>
                  </div>

                  <div className="flex items-center justify center gap-2">
                    <img
                      src="hydralogo.png"
                      alt="Team Logo"
                      className="w-full h-auto max-w-[1.5rem] transition-all object-contain"
                    />
                    <span className="font-bold text-[#a6d1eb] text-2xl">Hydra</span>
                  </div>
                  
                  <div className="flex gap-2">
                      <CoinDisplay coins={coins}/>
                      <RefillButton waterLevel={waterLevel} setWaterLevel={setWaterLevel} coins={coins} setCoins={setCoins} adRefillAmount={adRefillAmount} fullTank={fullTank}/>
                  </div>
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

              <Dialog>
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

                <div className="flex gap-2">
                <Dialog>
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
              </Dialog>

                <Dialog>
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
              </Dialog>


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