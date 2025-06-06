"use client"

import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Plus, ArrowUp } from "lucide-react"
import { ModelSelector } from "@/components/model-selector"

import { useEffect, useRef } from 'react';


import { useChat } from '@ai-sdk/react';

export function ChatInput() {
  const { messages, input, handleInputChange, handleSubmit, error } = useChat(); 
  const chatContainer = useRef<HTMLDivElement>(null);

  //scroll feature
  const scroll = () => {
    const {offsetHeight, scrollHeight, scrollTop } = chatContainer.current as HTMLDivElement;
    if (scrollHeight >= scrollTop + offsetHeight) {
      chatContainer.current?.scrollTo(0, scrollHeight + 200)
    } 
  }

  useEffect(() => {
    scroll();
  }, [messages]);

    const renderResponse = () => {
    return (
      <div className="flex flex-col gap-3 p-4">
        {messages.map(message => (
          <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-4 py-3 rounded-xl whitespace-pre-wrap ${message.role === 'user'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-900'
              }`}>
                {message.parts.map((part, index) => {
                  switch(part.type) {
                    case 'text':
                      return <span key={index}>{part.text}</span>
                  }
                })}
                </div>
            </div>
        ))}
      </div> 
    )
  }

  return (
    <div className='flex-1 flex flex-col bg-gray-300 min-w-0'>
      <div ref={chatContainer} className="flex-1 overflow-y-auto px-4 py-6">
        {renderResponse()}
      </div>

      <form onSubmit={handleSubmit}>
        <input placeholder="Ask Anything" name="prompt" value={input} onChange={handleInputChange} />
        <button type="submit">Submit</button>
      </form>
      {error && <div className="text-red-500">{error.message}</div>}
    </div>
  );
}