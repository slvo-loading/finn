import { Button } from "@/components/ui/button";
import { TbFishHook } from "react-icons/tb";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
  } from "@/components/ui/hover-card"


export function CoinDisplay({coins}: { coins: number }) {
  
    return (
        <HoverCard>
        <HoverCardTrigger asChild>
          <Button variant="outline" size="2xs" className="px-2">
          {coins}
            <TbFishHook className="w-1 h-1"/>
          </Button>
        </HoverCardTrigger>
        <HoverCardContent className="flex justify-center w-fit px-2 py-1 text-xs">
            <p className="text-[8px] font-medium">Lucky Lures</p>
        </HoverCardContent>
      </HoverCard>
    );
  }