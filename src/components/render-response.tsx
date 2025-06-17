"use client"

import type { UIMessage } from 'ai';
import ReactMarkdown from 'react-markdown';
import { Copy, Pencil, ThumbsUp, ThumbsDown, RefreshCcw, Fish } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { AVAILABLE_MODELS } from "@/lib/models";


export function RenderResponse({ messages, isThinking }: { messages: UIMessage[], isThinking:boolean }) {

    return (
        <div className="flex flex-col gap-3 p-4">
          {messages.map(message => (
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
                    <Button variant="ghost" size="icon" className="w-6 h-6 fade-in">
                      <Copy className="w-3 h-3 text-gray-400 fade-in"/>
                    </Button>
                    <Button variant="ghost" size="icon" className="w-6 h-6 fade-in">
                      <Pencil className="w-3 h-3 text-gray-400 fade-in"/>
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2 mt-2">
                    <Button variant="ghost" size="icon" className="w-6 h-6 fade-in">
                      <Copy className="w-3 h-3 text-gray-400 fade-in"/>
                    </Button>
                    <Button variant="ghost" size="icon" className="w-6 h-6 fade-in">
                      <ThumbsUp className="w-3 h-3 text-gray-400 fade-in"/>
                    </Button>
                    <Button variant="ghost" size="icon" className="w-6 h-6 fade-in">
                      <ThumbsDown className="w-3 h-3 text-gray-400 fade-in"/>
                    </Button>
                    <Button variant="ghost" size="icon" className="w-fit h-6 fade-in p-2">
                      {/* <RefreshCcw className="w-3 h-3 text-gray-400 fade-in"/> */}
                      <span className="text-gray-400">{AVAILABLE_MODELS.find(m => m.value === message.model)?.label || message.model}</span>
                    </Button>
                  </div>
                )}

            </div>
          ))}

          {isThinking && (
            <div className="flex items-center gap-2 text-gray-500 animate-pulse">
              <Fish className="w-5 h-5 animate-pulse" />
              {/* <span className="w-5 h-5 animate-pulse">🐟</span> */}
            </div>
          )}
        </div> 
      )
}