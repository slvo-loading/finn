"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Droplets } from "lucide-react"

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

type RefillProps = {
  waterLevel: number;
  setWaterLevel: (n: number) => void;
  coins: number;
  setCoins: (n: number) => void;
  adRefillAmount: number;
  fullTank: number;
}

export function RefillButton({
  waterLevel,
  setWaterLevel,
  coins,
  setCoins, 
  adRefillAmount, 
  fullTank,
}: RefillProps) {
  const [loading, setLoading] = useState(false);

  const adsNeeded = Math.ceil((fullTank - waterLevel) / adRefillAmount);

  const handleWatchAd = async () => {
    setLoading(true);

    // simulate watching ad
    await new Promise((r) => setTimeout(r, 2000));

    // reward: add water & coins
    const newWater = Math.min(waterLevel + adRefillAmount, fullTank);
    const newCoins = coins + 5;

    setWaterLevel(newWater);
    setCoins(newCoins);

    setLoading(false);
  }

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="relative">
          <Button 
            onClick={handleWatchAd} 
            variant="outline" 
            size="sm"
          >
            <Droplets className=" w-1 h-1"/>
          </Button>

          {adsNeeded > 0 && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white">
              {adsNeeded}
            </span>
          )}
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="flex justify-center w-fit px-2 py-1 text-xs">
        <p className="text-[8px] font-medium">Refill Tank</p>
      </HoverCardContent>
    </HoverCard>
  );
}

