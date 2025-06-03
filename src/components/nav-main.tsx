"use client"

import { MessageCirclePlus, Search, Bookmark} from "lucide-react"

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

const items = [
    {
      title: "New Chat",
      url: "#",
      icon: MessageCirclePlus,
    },
    {
      title: "Search",
      url: "#",
      icon: Search,
    },
    {
      title: "Saved",
      url: "#",
      icon: Bookmark,
    },
  ]

export function NavMain() {
  return (
    <SidebarGroup>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
    </SidebarGroup>
  )}

