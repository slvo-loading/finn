"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { SquarePlay } from "lucide-react"

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
    <Button
      onClick={handleWatchAd}
      disabled={adsNeeded === 0 || loading}
      variant="ghost"
    >
      <SquarePlay />
      {loading ? "Watching..." : `Refill (${adsNeeded} ads left)`}
    </Button>
  )
}
