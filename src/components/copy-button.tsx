import { useState } from "react"
import { Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500) // reset icon after 1.5s
    } catch (err) {
      console.error("Copy failed", err)
    }
  }

  return (
    <Button 
      onClick={handleCopy} 
      variant="ghost" 
      size="icon"
      className="fade-in w-7 h-7"
    >
      {copied ? <Check className="text-gray-400 fade-in w-1 h-1" /> : <Copy className="text-gray-400 fade-in w-1 h-1" />}
    </Button>
  )
}
