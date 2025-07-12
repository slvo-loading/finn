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

  
  export function AppSidebar() {
    const { toggleSidebar, open } = useSidebar();
  
    return (
      <Sidebar collapsible="icon" >
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
          <NavMain />
          <NavProjects/>
        </SidebarContent>
        <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      </Sidebar>
    );
  }