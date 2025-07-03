"use client"

import { MessageCirclePlus, Search, Star} from "lucide-react"
import { Button } from "@/components/ui/button"

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

type NavMainProps = {
    openNewChat: () => void; // Function to create a new chat
  };

export function NavMain({ openNewChat }: NavMainProps) {
  return (
    <SidebarGroup>
            <SidebarMenu>
                <SidebarMenuItem >
                
                <SidebarMenuButton asChild>
                  <Button variant="ghost" size="sm" className="w-full justify-start" onClick={openNewChat}>
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

