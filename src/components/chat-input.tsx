"use client"

import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Plus, ArrowUp } from "lucide-react"
import { ModelSelector } from "@/components/model-selector"

import { useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import type { UIMessage } from 'ai';

type ChatInputProps = {
  model: string;
  onNewMessage: (message: UIMessage) => void; // Define onNewMessage as a prop
};

export function ChatInput({ model, onNewMessage }: ChatInputProps) {
  const { messages, input, handleInputChange, handleSubmit,  } = useChat({
    api: `/api/chat?model=${encodeURIComponent(model)}`,
    key: model
  }); 

  // const chatContainer = useRef<HTMLDivElement>(null);

  // //scroll feature
  // const scroll = () => {
  //   const {offsetHeight, scrollHeight, scrollTop } = chatContainer.current as HTMLDivElement;
  //   if (scrollHeight >= scrollTop + offsetHeight) {
  //     chatContainer.current?.scrollTo(0, scrollHeight + 200)
  //   } 
  // }

  // useEffect(() => {
  //   scroll();
  // }, [messages]);

  useEffect(() => {
    const last = messages.at(-1);
    if (last) onNewMessage(last); // Send message to parent
  }, [messages, onNewMessage]);
  
  return (
    // <div className='flex-1 flex flex-col bg-white min-w-0 items-center'>
    //   <div ref={chatContainer} className="h-full w-2xl bg-white flex flex-col overflow-y-auto py-6">
    //     <RenderResponse messages={messages} />
    //   </div>

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
    // </div>
  );
}