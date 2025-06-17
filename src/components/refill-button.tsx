"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { SquarePlay } from "lucide-react"

type RefillProps = {
  waterLevel: number;
  setWaterLevel: (n: number) => void;
  coins: number;
  setCoins: (n: number) => void;
  adsNeeded: number;
  setAdsNeeded: (n: number) => void;
}

export function RefillButton({
  waterLevel,
  setWaterLevel,
  coins,
  setCoins,
  adsNeeded,
  setAdsNeeded
}: RefillProps) {
  const [loading, setLoading] = useState(false);

  const handleWatchAd = async () => {
    setLoading(true);

    // ✅ simulate watching ad + payout
    await new Promise((r) => setTimeout(r, 2000)); // fake ad duration

    // ✅ reward user
    const newWater = Math.min(waterLevel + 20, 100); // +20% tank
    const newCoins = coins + 5; // +5 coins for full ad

    setWaterLevel(newWater);
    setCoins(newCoins);
    setAdsNeeded(Math.max(adsNeeded - 1, 0));

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
