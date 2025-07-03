import { ChatInput } from "./chat-input";
import { RenderResponse } from "./render-response";
import React, { useRef, useEffect } from "react";


export function ChatArea({
    chats,
    activeChatId,
    activeChatMessages,
    handleNewMessage,
    model,
    isThinking,
    handleThinking,
    waterLevel,
    updateWaterLevel,
    handleNewChat,
    saveMessageToSupabase,
    firstMessage,
    clearFirstMessage,
  }: {
    chats: Chat[];
    activeChatId: string;
    activeChatMessages: UIMessage[];
    handleNewMessage: (message: UIMessage) => void;
    model: string;
    isThinking: boolean;
    handleThinking: (thinking: boolean) => void;
    waterLevel: number;
    updateWaterLevel: (level: number) => void;
    handleNewChat: (firstUserMessage: string) => Promise<void>;
    saveMessageToSupabase: (chatId: string, message: UIMessage, model: string ) => Promise<void>;
    firstMessage: string | null;
    clearFirstMessage: () => void;
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

  
    return ( 
    <div className="flex flex-col h-full w-full gap-5 items-center justify-center">
        {activeChatMessages.length > 0 ? (
            <div>
                <div
                ref={chatContainer}
                className="flex-1 w-full max-w-2xl overflow-y-auto px-4 py-6 min-h-0 hide-scrollbar"
                >
                <RenderResponse messages={activeChatMessages} isThinking={isThinking} />
                </div>
            </div>
            ) : (
                <span className="text-2xl">What's on you mind today?</span>
        )}
            <div>
                <ChatInput
                chats={chats}
                handleNewChat={handleNewChat}
                saveMessageToSupabase={saveMessageToSupabase}
                handleNewMessage={handleNewMessage}
                model={model}
                handleThinking={handleThinking}
                waterLevel={waterLevel}
                updateWaterLevel={updateWaterLevel}
                activeChatId={activeChatId}
                activeChatMessages={activeChatMessages}
                firstMessage={firstMessage}
                clearFirstMessage={clearFirstMessage}
                />
            </div>
    </div>
    );
}
  