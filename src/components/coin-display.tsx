import { Button } from "@/components/ui/button";
import { Shell } from "lucide-react";


export function CoinDisplay({coins}: { coins: number }) {
  
    return (
        <Button variant="outline" size="2xs" className="px-2">{coins} <Shell /></Button>
    );
  }