"use client"

import { useAuth } from "@/app/context/auth-provider"
import { GoToLogin } from "@/components/auth/goto-login"
import { GoToSignUp } from "@/components/auth/goto-signup"
import { ResetTutorial } from "@/components/auth/reset-tutorial"
import { CoinDisplay } from "@/components/coin-display"
import { RefillButton } from "@/components/refill-button"
import { Button } from "@/components/ui/button"
import Image from 'next/image'
import { redirect, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { ChatArea } from "@/components/chat-area"

export default function Home() {
  const session = useAuth();

  if (session?.user) {
    redirect('/h/new-chat');
  }

  const [waterLevel, setWaterLevel] = useState(0.10); // % or liters
  const fullTank = 0.10;
  const [coins, setCoins] = useState(0);
  const adRefillAmount = 0.01

  const router = useRouter();
  const [showTutorial, setShowTutorial] = useState(true);
  const [checkingStorage, setCheckingStorage] = useState(true);


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
                <Image
                    src="/hydralogo.png"
                    alt="Hydra Logo"
                    width={150}
                    height={150}
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
            <div className='flex-1 flex flex-col min-w-0 items-center min-h-0'>
              <div className="flex justify-between w-full px-2 pt-2 flex-shrink-0 gap-2">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => router.push('/auth')}><span>Log In</span></Button>
                    <Button size="sm" onClick={() => router.push('/auth')}><span>Sign Up</span></Button>
                    <ResetTutorial onReset={() => setShowTutorial(true)}/>
                  </div>
                <div className="w-full flex items-center justify-end gap-2">
                <CoinDisplay coins={coins}/>
                <RefillButton waterLevel={waterLevel} setWaterLevel={setWaterLevel} coins={coins} setCoins={setCoins} adRefillAmount={adRefillAmount} fullTank={fullTank}/>
                </div>
              </div>

              <ChatArea
                waterLevel={waterLevel}
                updateWaterLevel={updateWaterLevel}
              />

            </div>
            </div>
  )
}

              {/* <Dialog>
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
      </ResizablePanelGroup> */}
