'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './auth-provider';
import { UIMessage, ExtendUIMessage, Chat } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { generateChatTitle } from "@/app/actions/generate-title";
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

type ChatContextType = {
    activeChatId: string;
    save: boolean;
    handleChatId: (chatId: string) => void;
    chats: Chat[];
    activeChatMessages: UIMessage[];
    openNewChat: () => void;
    handleNewChat: (chatId: string, message: string) => Promise<void>;
    handleSelectedChat: (chatId: string) => Promise<void>;
    handleNewMessage: (message: UIMessage, messageModel: string) => void;
    handleSaveMessages: (chatId: string) => Promise<void>;
    deleteChat: (chatId: string, currentId: string) => Promise<void>;
    renameChat: (chatId: string, newTitle: string) => Promise<void>;
};

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
    const [activeChatId, setActiveChatId] = useState<string>("new-chat");
    const [chats, setChats] = useState<Chat[]>([]);
    const [activeChatMessages, setActiveChatMessages] = useState<ExtendUIMessage[]>([]);
    const [save, setSave] = useState<boolean>(false);

    const { session } = useAuth();
    const router = useRouter();

    const handleChatId = (chatId: string) => {
        setActiveChatId(chatId);
    };

    // fetches chats when sess
    const fetchChats = useCallback(async () => {
        if (session?.user.id) {
            const { data, error } = await supabase
                .from('chats')
                .select('*')
                .order('updated_at', { ascending: false });
            
            if (error) {
                console.error('Error fetching chats:', error);
                return [];
            } else {
                console.log('Successfully fetched chats.');
            }

            setChats(data);
        } else {
            setChats([]);
            setActiveChatMessages([]);
        }
    }, [session?.user.id]);

    // fetches chats on mount
    useEffect(() => {
        fetchChats();
    }, [fetchChats]);


    // resets state for new chat
    const openNewChat = () => {
        setActiveChatId("new-chat");
        setActiveChatMessages([]);
        setSave(false);
    };


    // creates a new chat in the db, sets the activeChatId, and fetches chats
    const handleNewChat = async (chatId: string, message: string) => {
        if (!session) {
            console.error("User not authenticated");
            return;
        }

        setActiveChatId(chatId);
        console.log("Set active chat id in handleNewChat:", chatId)

        const title = await generateChatTitle(message);
        const newChat = {
            id: chatId,
            user_id: session.user.id,
            title: title,
        };
        
        const { error } = await supabase
        .from("chats")
        .insert([newChat])
        .select()
        .single();
    
        if (error) {
            console.error("Error creating new chat:", error);
        } else {
            console.log("New chat created successfully");
            setSave(true);
            fetchChats();
        }
    };


    // fetch messages for the selected chat
    const handleSelectedChat = async (chatId: string) => {
        if (!session?.user.id) {
            console.log("User not authenticated");
            return;
        }

        setActiveChatId(chatId);
        console.log("Set active chat id in handleSelectedChat:", chatId)

        const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("chat_id", chatId)
        .order("created_at", { ascending: true });
    
        if (error) {
            console.error("Error fetching messages:", error);
            setActiveChatMessages([]);
        }
        
        // console.log("Successfully fetched messages.");

        const loadedMessages: ExtendUIMessage[] = data.map(msg => ({
            id: msg.id,
            role: msg.role,
            content: msg.content,
            model: msg.model,
            parts: msg.parts || [],
            createdAt: new Date(msg.created_at),
        }));
        setActiveChatMessages(loadedMessages);
    };


    //updates the last message to stream to the UI, also saves the model
    const handleNewMessage = useCallback((message: UIMessage, messageModel: string) => {
        setActiveChatMessages((prevMessages) => {
            const last = prevMessages.at(-1);
            if (last?.id === message.id) {
                return [...prevMessages.slice(0, -1), {
                ...message,
                model: last.model || messageModel 
                }];
            } else {
                return [...prevMessages, {
                ...message,
                model: messageModel
                }];
            }
        });
    }, []);


    //save messages to the database
    const handleSaveMessages = async (chatId: string) => {
        if (!session?.user.id) {
            console.error("User not authenticated");
            return;
        }
        // if (activeChatMessages.length < 2) {
        //     console.warn("Not enough messages to save.");
        //     return;
        // }

        const messages = activeChatMessages.slice(-2);

        const messageRecords = messages.map(message => ({
            id: message.id,
            chat_id: chatId,
            user_id: session?.user.id,
            role: message.role,
            content: message.content,
            parts: message.parts,
            model: message.model,
            created_at: message.createdAt
        }));
          
        const { data, error } = await supabase
            .from("messages")
            .insert(messageRecords);
    
        if (error) {
        console.error("Error saving message:", error);
        } else {
        console.log("Message saved successfully:", data);
        }
    };


    // deletes a chat and clears UI
    const deleteChat = async (chatId: string, currentId: string) => {
        const { error } = await supabase
            .from("chats")
            .delete()
            .eq("id", chatId);
        
        if (error) {
            console.error("Error deleting chat:", error);
        } else {
            console.log("Chat deleted successfully");
        }
        
        if (currentId === chatId) {
            openNewChat();
            router.push('/h/new-chat');
        }

        setChats((prev) => prev.filter((chat) => chat.id !== chatId));
    };


    // renames the chat in the db and in chats UI
    const renameChat = async (chatId: string, newTitle: string) => {
        const { error } = await supabase
            .from("chats")
            .update({ title: newTitle })
            .eq("id", chatId);
        
        if (error) {
            console.error("Error renaming chat:", error);
        } else {
            console.log("Chat renamed successfully");

            setChats((prev) =>
                prev.map((chat) =>
                    chat.id === chatId ? { ...chat, title: newTitle } : chat
                ));
        }
    };


    // for debugging
    // useEffect(() => {
    //     console.log("Fetched chats:", chats);
    // }, [chats]);

    useEffect(() => {
        console.log("Active chat ID:", activeChatId);
    }, [activeChatId])

    useEffect(() => {
        console.log("Save state:", save);
    },[save])

    return (
        <ChatContext.Provider
          value={{
            activeChatId,
            save,
            handleChatId,
            chats,
            activeChatMessages,
            openNewChat,
            handleNewChat,
            handleSelectedChat,
            handleNewMessage,
            handleSaveMessages,
            deleteChat,
            renameChat,
          }}
        >
          {children}
        </ChatContext.Provider>
      );
    }
    
    export function useChats() {
      const context = useContext(ChatContext);
      if (!context) {
        throw new Error('useChats must be used within a ChatProvider');
      }
      return context;
}