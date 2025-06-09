"use client"

import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Plus, ArrowUp } from "lucide-react"
import { ModelSelector } from "@/components/model-selector"

import { useEffect, useRef } from 'react';
import { useChat } from '@ai-sdk/react';

export function ChatInput({ model }: { model: string }) {
  const { messages, input, handleInputChange, handleSubmit, error } = useChat({
    api: `/api/chat?model=${encodeURIComponent(model)}`,
    key: model
  }); 
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
              <div className={`max-w-[80%] px-3 py-2 rounded-md whitespace-pre-wrap ${message.role === 'user'
                ? 'bg-gray-200'
                : ''
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
    <div className='flex-1 flex flex-col bg-white min-w-0 items-center'>
      <div ref={chatContainer} className="h-full w-2xl bg-white flex flex-col overflow-y-auto py-6">
        {renderResponse()}
      </div>

      <form className='bg-gray-100 w-2xl p-4 mb-5 flex flex-col rounded-xl' onSubmit={handleSubmit}>
        <Textarea name="prompt" placeholder="Ask Anything" onChange={handleInputChange} value={input}/>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button><Plus/></Button>
            <ModelSelector/>
          </div>
          <Button type="submit"><ArrowUp/></Button>
        </div>
      </form>
      <div>{error ? error.message : null}</div>
    </div>
  );
}