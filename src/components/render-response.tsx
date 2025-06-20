"use client"

import type { UIMessage } from 'ai';
import ReactMarkdown from 'react-markdown';
import { Copy, Pencil, ThumbsUp, ThumbsDown, RefreshCcw, Fish, Bookmark } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { AVAILABLE_MODELS } from "@/lib/models";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import {CopyButton} from "@/components/copy-button"


export function RenderResponse({ messages, isThinking }: { messages: UIMessage[], isThinking:boolean }) {

    return (
        <div className="flex flex-col gap-5 p-4">
          {messages.map(message => {
            const wholeMessage = message.parts
            .filter(p => p.type === "text")
            .map(p => Array.isArray(p.text) ? p.text.join("") : p.text)
            .join("");

            return(
            <div key={message.id} className={`flex flex-col  items-${message.role === 'user' ? 'end' : 'start'}`}>
                <div className={`w-fit px-3 py-2 rounded-md whitespace-pre-wrap flex ${message.role === 'user'
                  ? 'bg-gray-200 fade-in'
                  : ''
                }`}>

                  {/* text area */}
                  {message.parts.map((part, index) => {
                    switch(part.type) {
                      case 'text':
                        return (          
                        <div key={index} className="prose prose-sm max-w-none">
                        <ReactMarkdown>
                          {Array.isArray(part.text) ? part.text.join("") : part.text}
                        </ReactMarkdown>
                      </div>)
                    }
                  })}
                </div>

                {/* buttons */}
                {message.role === 'user' ? (
                  <div className="flex gap-2 mt-2">
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <CopyButton text={wholeMessage}/>
                      </HoverCardTrigger>
                      <HoverCardContent className="flex justify-center w-fit px-2 py-1 text-xs">
                          <p className="text-[8px] font-medium">Copy</p>
                      </HoverCardContent>
                    </HoverCard>

                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <Button variant="ghost" size="icon" className="fade-in w-7 h-7">
                          <Bookmark className="text-gray-400 fade-in w-1 h-1"/>
                        </Button>
                      </HoverCardTrigger>
                      <HoverCardContent className="flex justify-center w-fit px-2 py-1 text-xs">
                          <p className="text-[8px] font-medium">Save</p>
                      </HoverCardContent>
                    </HoverCard>
                  
                  {/* add edit prompt later */}
                    {/* <HoverCard>
                      <HoverCardTrigger asChild>
                        <Button variant="ghost" size="icon" className="fade-in w-7 h-7">
                        <Pencil className="text-gray-400 fade-in w-1 h-1"/>
                        </Button>
                      </HoverCardTrigger>
                      <HoverCardContent className="flex justify-center w-fit px-2 py-1 text-xs">
                          <p className="text-[8px] font-medium">Edit</p>
                      </HoverCardContent>
                    </HoverCard> */}

                  </div>
                ) : (
                  <div className="flex gap-2 mt-2">
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <Button variant="ghost" size="icon" className="fade-in w-7 h-7">
                          <CopyButton text={wholeMessage}/>
                        </Button>
                      </HoverCardTrigger>
                      <HoverCardContent className="flex justify-center w-fit px-2 py-1 text-xs">
                        <p className="text-[8px] font-medium">Copy</p>
                      </HoverCardContent>
                    </HoverCard>

                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <Button variant="ghost" size="icon" className="fade-in w-7 h-7">
                          <ThumbsUp className="text-gray-400 fade-in w-1 h-1"/>
                        </Button>
                      </HoverCardTrigger>
                      <HoverCardContent className="flex justify-center w-fit px-2 py-1 text-xs">
                          <p className="text-[8px] font-medium">Good Response</p>
                      </HoverCardContent>
                    </HoverCard>

                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <Button variant="ghost" size="icon" className="fade-in w-7 h-7">
                          <ThumbsDown className="text-gray-400 fade-in w-1 h-1"/>
                        </Button>
                      </HoverCardTrigger>
                      <HoverCardContent className="flex justify-center w-fit px-2 py-1 text-xs">
                          <p className="text-[8px] font-medium">Bad Response</p>
                      </HoverCardContent>
                    </HoverCard>

                    <Button variant="ghost" size="2xs" className="fade-in px-2">
                      {/* <RefreshCcw className="w-3 h-3 text-gray-400 fade-in"/> */}
                      <span className="text-gray-400 text-xs font-medium">{AVAILABLE_MODELS.find(m => m.value === message.model)?.label || message.model}</span>
                    </Button>
                  </div>
                )}
            </div>
            );
          })}

          {isThinking && (
            <div className="flex items-center gap-2 text-gray-500 animate-pulse">
              <Fish className="w-5 h-5 animate-pulse" />
              {/* <span className="w-5 h-5 animate-pulse">🐟</span> */}
            </div>
          )}
        </div> 
      )
}