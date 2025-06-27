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
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar'
import { PanelLeftOpen } from 'lucide-react'
import { UUID } from "crypto"

// This is sample data.
const data = {
  user: {
    name: "Example User",
    email: "user@example.com",
  },}

  type Chat = {
    id: string;
    user_id: string;
    title: string;
    messages: any[]; 
    created_at: string;
    updated_at: string;
  };

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
    createChat: () => void;
    chats: Chat[];
    deleteChat: (chatId: string) => void;
  };
  
  export function AppSidebar({ createChat, chats, deleteChat, ...props }: AppSidebarProps) {
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
          <NavMain createChat={createChat} />
          <NavProjects chats={chats} deleteChat={deleteChat}/>
        </SidebarContent>
        <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      </Sidebar>
    );
  }