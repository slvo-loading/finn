"use client"

import { MessageCirclePlus, Search, Star} from "lucide-react"
import { Button } from "@/components/ui/button"

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type NavMainProps = {
    createChat: () => void; // Function to create a new chat
    chats: { name: string; messages: string[] }[]; // Array of chat objects
  };

export function NavMain({ createChat }: NavMainProps) {
  return (
    <SidebarGroup>
            <SidebarMenu>
                <SidebarMenuItem >
                
                <SidebarMenuButton asChild>
                  <Button variant="ghost" size="sm" className="w-full justify-start" onClick={createChat}>
                    <MessageCirclePlus/>
                    <span>New Chat</span>
                  </Button>
                </SidebarMenuButton>

                  <SidebarMenuButton asChild>
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      <Search/>
                      <span>Search</span>
                    </Button>
                  </SidebarMenuButton>

                  <SidebarMenuButton asChild>
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      <Star/>
                      <span>Saved</span>
                      </Button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
    </SidebarGroup>
  )}

