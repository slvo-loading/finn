"use client"

import { MessageCirclePlus, Search, Bookmark} from "lucide-react"

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

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
                    <button onClick={createChat}>
                      <MessageCirclePlus/>
                      <span>New Chat</span>
                    </button>
                  </SidebarMenuButton>
                  <SidebarMenuButton asChild>
                    <a href="#">
                      <Search/>
                      <span>Search</span>
                    </a>
                  </SidebarMenuButton>
                  <SidebarMenuButton asChild>
                    <a href="#">
                      <Bookmark/>
                      <span>Saved</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
    </SidebarGroup>
  )}

