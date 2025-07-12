'use client';

import { useChats } from "@/app/context/chat-provider";
import { useModelSelector } from "@/hooks/useModelSelector";
import { useCallback, useEffect, useRef, useState } from "react";
import { RenderResponse } from "@/components/render-response";
import { ChatInput } from "@/components/chat-input";

export function ChatArea({
    waterLevel,
    updateWaterLevel,
  }: {
    waterLevel: number;
    updateWaterLevel: (level: number) => void;
  }) {
    const [welcomeNum, setWelcomeNum] = useState<number>(0);
    const [isThinking, setIsThinking] = useState(false);
    const chatContainer = useRef<HTMLDivElement>(null);
    const { activeChatMessages } = useChats();

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

    const welcomeMessages = [
        "What's on your mind today?",
        "How can I assist you today?",
        "What are you working on",
        "Good to see you!",
        "How can I help you today?",
        "Ready when you are.",
        "What's on the agenda today?",
        "Where should we begin?"
    ]

    useEffect(() => {
        setWelcomeNum(Math.floor(Math.random() * welcomeMessages.length));
    }, []);

    const handleThinking = useCallback((thinking: boolean) => {
        setIsThinking(thinking);
      }, []);

    const model = "deepseek:deepseek-chat"
    

    return ( 
        <div className="flex-1 flex flex-col min-w-0 items-center min-h-0 items-center justify-center flex-1 w-full max-w-2xl gap-5">
        {activeChatMessages?.length > 0 ? (
                <div
                ref={chatContainer}
                className="flex-1 w-full max-w-2xl overflow-y-auto px-4 py-6 min-h-0 hide-scrollbar"
                >
                <RenderResponse messages={activeChatMessages} isThinking={isThinking} />
                </div>
            ) : (
                <span className="text-2xl">{welcomeMessages[welcomeNum]}</span>
        )}
        <div>
            <ChatInput
            model={model}
            handleThinking={handleThinking}
            waterLevel={waterLevel}
            updateWaterLevel={updateWaterLevel}
            />
            </div>
        </div>
    );
}