"use client";

import { Button } from "@/components/ui/button";
import { CoinDisplay } from "@/components/coin-display";
import { ShoppingBasket, X } from "lucide-react";
import { TbFishHook } from "react-icons/tb";
import { useRouter } from "next/navigation";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

export default function FishLotteryPage() {
  const router = useRouter();
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-between">

        {/* top buttons */}
        <div className="flex w-full justify-between pt-5 px-5">
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

              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button variant="outline" size="icon" className="w-7 h-7" onClick={() => router.push('/')}>
                    <X className="w-1 h-1"/>
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="flex justify-center w-fit px-2 py-1 text-xs">
                    <p className="text-[8px] font-medium">Exit</p>
                </HoverCardContent>
              </HoverCard>
          </div>
        </div>

       {/* banner art */}
       <div className="px-5 pb-5 h-full w-full">
        <div className="pl-30 pb-15 h-full w-full flex items-center justify-center">
          <div className=" rounded-full w-4xl h-125 bg-sky-200">
          </div>
        </div>
        </div>
      
      {/* wooden board */}
        <div className="absolute bg-black h-70 w-md bottom-10 left-10">
        </div>

        {/* pull buttons */}
        <div className="flex w-full justify-end gap-2 px-5 pb-10">
          <Button className="px-20 h-20 flex flex-col items-center justify-center">
            <span className="text-2xl">Cast line x 1</span>
            <div className="flex gap-1 items-center">
              <TbFishHook/>
              <span className="text-md"> x 100</span>
            </div>
          </Button>

          <Button className="px-20 h-20 flex flex-col items-center justify-center">
            <span className="text-2xl">Cast line x 10</span>
            <div className="flex gap-1 items-center">
              <TbFishHook/>
              <span className="text-md"> x 1,000</span>
            </div>
          </Button>
        </div>
      </div>
    );
  }
  