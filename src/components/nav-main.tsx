"use client"

import { MessageCirclePlus, Search, Star} from "lucide-react"
import { Button } from "@/components/ui/button"
import { v4 as uuidv4 } from 'uuid'
import Link from 'next/link'

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

export function NavMain() {
  return (
    <SidebarGroup>
            <SidebarMenu>
                <SidebarMenuItem >
                
                <SidebarMenuButton asChild>
                  <Link href={`/h/${"new-chat"}`}>
                    <MessageCirclePlus/>
                    <span>New Chat</span>
                  </Link>
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

