'use client';

import { Button } from "@/components/ui/button";
import { Fish, ShoppingBasket, Sparkles } from "lucide-react";
import { useRouter } from 'next/navigation'; 
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
  } from "@/components/ui/hover-card"

export function WaterTank({ waterLevel, fullTank }: { waterLevel: number, fullTank: number }) {
    const router = useRouter();
    return (
        <div className="flex flex-col h-full w-full pb-5 pt-2 px-3 gap-5 items-center justify-between">
            <div className="flex justify-between w-full">
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

              <div className="flex gap-2">

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


              </div>
            </div>
        <div className="flex items-end h-full w-full rounded-sm border-1 p-1">
            <div className="w-full bg-sky-200 rounded-sm" style={{ height: `${(waterLevel/fullTank) * 100}%` }}>
            {/* put fish in here */}
            </div>
        </div>
        <div>
              {/* <p>{Math.round(waterLevel / fullTank * 100)}%</p> */}
              <p>100%</p>
            </div>
          </div>
    )
}
