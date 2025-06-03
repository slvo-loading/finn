"use client"

import * as React from "react"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { PanelLeftClose } from 'lucide-react'

export function TeamSwitcher() {

    const { toggleSidebar } = useSidebar()
  return (
    <SidebarMenu>
      <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <img
                src="hydralogo.png"
                alt="Team Logo"
                className="w-full h-auto max-w-[2rem] transition-all object-contain"
                />
              <div className="grid flex-1 text-left text-xl leading-tight">
                <span className="font-semibold text-[#a6d1eb]">
                  Hydra
                </span>
              </div>
              <div> <button onClick={toggleSidebar}><PanelLeftClose/></button></div>
            </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
