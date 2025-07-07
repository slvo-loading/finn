import { ChatInput } from "./chat-input";
import { RenderResponse } from "./render-response";
import React, { useRef, useEffect, useState, useCallback } from "react";
import { useModelSelector } from "@/hooks/useModelSelector"
import { ExtendUIMessage, Chat } from "@/lib/types";

export function ChatArea({
    chats,
    activeChatId,
    activeChatMessages,
    handleNewMessage,
    waterLevel,
    updateWaterLevel,
    handleNewChat,
    saveMessageToSupabase,
  }: {
    chats: Chat[];
    activeChatId: string;
    activeChatMessages: ExtendUIMessage[];
    handleNewMessage: (message: ExtendUIMessage, model: string) => void;
    waterLevel: number;
    updateWaterLevel: (level: number) => void;
    handleNewChat: (firstUserMessage: string) => Promise<void>;
    saveMessageToSupabase: (chatId: string, message: ExtendUIMessage[], model: string ) => Promise<void>;
  }) {

    //scroll feature
    const chatContainer = useRef<HTMLDivElement>(null);
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

    const [welcomeNum, setWelcomeNum] = useState<number>(0);

    useEffect(() => {
        setWelcomeNum(Math.floor(Math.random() * welcomeMessages.length));
    }, [welcomeMessages]);

    const [isThinking, setIsThinking] = useState(false);

    const handleThinking = useCallback((thinking: boolean) => {
        setIsThinking(thinking);
      }, []);

    const model = useModelSelector((state) => state.model);
  
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
            <ChatInput
            model={model}
            chats={chats}
            handleNewChat={handleNewChat}
            saveMessageToSupabase={saveMessageToSupabase}
            handleNewMessage={handleNewMessage}
            handleThinking={handleThinking}
            waterLevel={waterLevel}
            updateWaterLevel={updateWaterLevel}
            activeChatId={activeChatId}
            activeChatMessages={activeChatMessages}
            />
        </div>
    );
}
  