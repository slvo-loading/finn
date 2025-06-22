"use client";

import { Button } from "@/components/ui/button";
import { CoinDisplay } from "@/components/coin-display";
import { ShoppingBasket, X } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

export default function FishLotteryPage() {
  const router = useRouter();
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-between bg-green-200">

        {/* top buttons */}
        <div className="flex w-full justify-between p-5">
          <div className="flex gap-2">
            <Button variant="outline" size="2xs" className="px-2">Details</Button>
            <Button variant="outline" size="2xs" className="px-2">History</Button>
          </div>
          <div className="flex gap-2">
            <CoinDisplay coins={10}/>
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
            <Button variant="outline" size="2xs" className="px-2" onClick={() => router.push('/')}><X className="w-1 h-1"/></Button>
          </div>
        </div>

       {/* banner art */}
       <div className="p-5 h-full w-full">
        <div className="border-2 h-full w-full flex items-center justify-center bg-white/50">
        </div>
        </div>
      
      {/* wooden board */}
        <div>
        </div>

        {/* pull buttons */}
        <div className="flex w-full justify-end gap-2 p-5">
          <Button variant="outline" size="2xs" className=" px-2">
            1 Bait
          </Button>

          <Button variant="outline" size="2xs" className=" px-2">
            10 Bait
          </Button>
        </div>
      </div>
    );
  }
  