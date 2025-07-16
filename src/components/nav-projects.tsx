"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Chat } from "@/lib/types"
import { useChats } from "@/app/context/chat-provider"
import Link from 'next/link';

import {
  MoreHorizontal,
  Trash2,
  PenLine,
  FolderInput,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

export function NavProjects() {
  const { chats, deleteChat, renameChat } = useChats()
  const { isMobile } = useSidebar()
  const [renameOpen, setRenameOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [selectedId, setSelectedId] = useState("")


  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Chats</SidebarGroupLabel>
      <SidebarMenu>
      {chats.map((item: Chat) => (
          <SidebarMenuItem key={item.id}>
            <SidebarMenuButton asChild>
              <Link 
              href={`/h/${item.id}`}
              replace={true}>
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-30 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >

                  <DropdownMenuItem>
                    <FolderInput className="text-muted-foreground" />
                    <span>Save</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => {setTitle(item.title); setSelectedId(item.id); setRenameOpen(true);}}>
                    <PenLine className="text-muted-foreground" />
                    <span>Rename</span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={() => {setSelectedId(item.id); setTitle(item.title); setDeleteOpen(true)}}>
                    <Trash2 className="text-muted-foreground"/>
                    <span>Delete</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem>
                    <span className="text-xs text-gray-400">Edited: {new Date(item.updated_at).toLocaleDateString()}</span>
                  </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>

      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent className="[&>button]:hidden">
          <DialogHeader>
            <DialogTitle>Rename Chat</DialogTitle>
            <DialogDescription>
            </DialogDescription>
          </DialogHeader>
          <div>
            <input value={title} onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-md border focus:outline-none focus:ring text-sm border-gray-300 focus:ring-[#a6d1eb]"
              />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setRenameOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={() => {setRenameOpen(false); renameChat(selectedId, title)}}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="[&>button]:hidden">
          <DialogHeader>
            <DialogTitle>Delete {title}?</DialogTitle>
            <DialogDescription>
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="destructive" onClick={() => {deleteChat(selectedId); setDeleteOpen(false)}}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


    </SidebarGroup>
  )
}
