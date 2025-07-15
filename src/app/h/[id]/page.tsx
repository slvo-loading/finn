'use client';

import { useChats } from "@/app/context/chat-provider";
import { useParams, useSearchParams } from 'next/navigation';
import { RenderResponse } from "@/components/render-response";
import { ChatInput } from "@/components/chat-input";
import { useEffect, useRef, useCallback } from "react";
import { useState } from "react"
import { useModelSelector } from "@/hooks/useModelSelector";

export default function Chats() {
    //for chats
    const { handleSelectedChat, activeChatMessages, activeChatId, chats } = useChats();
    const { id: chatId } = useParams();
    const searchParams = useSearchParams();
    const firstMessageContent = searchParams.get("message");
    const [isThinking, setIsThinking] = useState(false);
    const chatContainer = useRef<HTMLDivElement>(null);
    const model = useModelSelector(state => state.model);

    //for tank
    const fullTank = 0.10;
    const [coins, setCoins] = useState(0);
    const adRefillAmount = 0.01
    const [waterLevel, setWaterLevel] = useState(0.10);
    const updateWaterLevel = (level: number) => {
      setWaterLevel(level);
    };

    // Initial load check
    useEffect(() => {
      if (typeof chatId !== 'string' || chatId === 'new-chat') {
        return;
      }
      const chatExists = chats.some(chat => chat.id === chatId);

      if (chatExists) {
        handleSelectedChat(chatId);
      }
    }, [chatId, activeChatId, firstMessageContent, handleSelectedChat, chats]);


    //scroll feature
    const scroll = () => {
      if (!chatContainer.current) return;
      const {offsetHeight, scrollHeight, scrollTop } = chatContainer.current as HTMLDivElement;
      if (scrollHeight >= scrollTop + offsetHeight) {
          chatContainer.current?.scrollTo(0, scrollHeight + 200)
      } 
      }
      
      useEffect(() => {
      scroll();
      }, [activeChatMessages]);

    const handleThinking = useCallback((thinking: boolean) => {
      setIsThinking(thinking);
    }, []);
  
    return (
      <div className="flex h-screen w-screen overflow-hidden">
        <div className="flex-1 flex flex-col min-w-0 items-center min-h-0 items-center justify-center flex-1 w-full max-w-2xl gap-5">
          <div
            ref={chatContainer}
            className="flex-1 w-full max-w-2xl overflow-y-auto px-4 py-6 min-h-0 hide-scrollbar"
            >
              <RenderResponse messages={activeChatMessages} isThinking={isThinking} />
          </div>
          <div>
            <ChatInput
            firstMessageContent={firstMessageContent}
            handleThinking={handleThinking}
            model={model}
            waterLevel={waterLevel}
            updateWaterLevel={updateWaterLevel}
            />
          </div>
        </div>
      </div>
    );
}
  
