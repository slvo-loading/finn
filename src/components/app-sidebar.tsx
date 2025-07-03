"use client"

import * as React from "react"

import { NavMain } from '@/components/nav-main'
import { NavProjects } from '@/components/nav-projects'
import { NavUser } from '@/components/nav-user'
import { TeamSwitcher } from '@/components/team-switcher'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from '@/components/ui/sidebar'
import { PanelLeftOpen } from 'lucide-react'
import { Chat } from "@/lib/types"

// This is sample data.
const data = {
  user: {
    name: "Example User",
    email: "user@example.com",
  },}


type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
    openNewChat: () => void;
    handleSelectedChat: (chatId: string) => void;
    chats: Chat[];
    deleteChat: (chatId: string) => void;
    renameChat: (chatId: string, newTitle: string) => void;
  };
  
  export function AppSidebar({ openNewChat, handleSelectedChat, chats, deleteChat, renameChat, ...props }: AppSidebarProps) {
    const { toggleSidebar, open } = useSidebar();
  
    return (
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <TeamSwitcher />
        </SidebarHeader>
        <SidebarContent>
          {!open && (
            <button
              onClick={toggleSidebar}
              className="flex items-center justify-center w-full"
            >
              <PanelLeftOpen className="w-4 h-4" />
            </button>
          )}
          <NavMain openNewChat={openNewChat} />
          <NavProjects chats={chats} deleteChat={deleteChat} renameChat={renameChat} handleSelectedChat={handleSelectedChat}/>
        </SidebarContent>
        <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      </Sidebar>
    );
  }