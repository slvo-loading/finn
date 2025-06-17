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

// This is sample data.
const data = {
  user: {
    name: "Example User",
    email: "user@example.com",
  },
  projects: [
    {
      name: "Chat 1",
      url: "#"
    },
    {
      name: "Chat 2",
      url: "#"
    },
    {
      name: "Chat 3",
      url: "#"
    },
  ],
}

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
    createChat: () => void; // Function to create a new chat
    chats: { name: string; messages: string[] }[]; // Array of chat objects
  };
  
  export function AppSidebar({ createChat, chats, ...props }: AppSidebarProps) {
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
          <NavProjects chats={chats} />
        </SidebarContent>
      </Sidebar>
    );
  }