'use client';

import { useModelSelector } from "@/hooks/useModelSelector";
import { useChats } from "@/app/context/chat-provider";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react"; 
import { v4 as uuidv4 } from 'uuid'; 
import { UIMessage } from "@/lib/types"; 
import { useRouter } from "next/navigation";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function NewChat() {
  const { openNewChat, handleNewChat, activeChatMessages, activeChatId } = useChats();
  const router = useRouter();

  const [input, setInput] = useState("");
  const [shouldRoute, setShouldRoute] = useState(false);
  const [waterLevel, setWaterLevel] = useState(0.10);
  const [welcomeNum, setWelcomeNum] = useState<number>(0);

  const welcomeMessages = [
    "What's on your mind today?",
    "How can I assist you today?",
    "What are you working on?",
    "Good to see you!",
    "How can I help you today?",
    "Ready when you are.",
    "What's on the agenda today?",
    "Where should we begin?"
  ];

  useEffect(() => {
    openNewChat();
    setWelcomeNum(Math.floor(Math.random() * welcomeMessages.length));
  },[]);

  useEffect(() => {
    if (shouldRoute && activeChatId !== "new-chat") {
      router.push(`/h/${activeChatId}?message=${encodeURIComponent(input)}`);
    }
  }, [shouldRoute, activeChatMessages, activeChatId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // const message: UIMessage = {
    //   id: uuidv4(),
    //   role: 'user',
    //   content: input,
    //   parts: [{ type: 'text', text: input }],
    //   createdAt: new Date(),
    // };

    const newId = uuidv4();
    // handleNewMessage(message, model);
    handleNewChat(newId, input);
    setShouldRoute(true);
  };

  return (
    <div className='w-screen h-screen flex flex-col items-center justify-center gap-5'>
      <span>{welcomeMessages[welcomeNum]}</span>

      <form
        className='bg-gray-100 w-2xl p-4 mb-5 flex flex-col rounded-xl'
        onSubmit={handleSubmit}
      >
        <Textarea
          name="prompt"
          placeholder="Ask anything"
          onChange={(e) => setInput(e.target.value)}
          value={input}
        />
        <div className="flex items-center justify-between">
          {waterLevel > 0 ? (
            <Button type="submit">
              <ArrowUp />
            </Button>
          ) : (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button">
                  <ArrowUp />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Your tank is empty!</AlertDialogTitle>
                  <AlertDialogDescription>
                    Watch ads or donate to refill your tank and continue chatting.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Close</AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </form>
    </div>
  );
}

  