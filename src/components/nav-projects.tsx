"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase";
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

import {
  Forward,
  MoreHorizontal,
  Trash2,
  PenLine
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
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"

type Chat = {
  id: string;
  user_id: string;
  title: string;
  messages: any[]; 
  created_at: string;
  updated_at: string;
};

export function NavProjects({
  chats, deleteChat, renameChat
}: {
  chats: Chat[],
  deleteChat: (chatId: string) => void,
  renameChat: (chatId: string, newTitle: string) => void
}) {

  const { isMobile } = useSidebar()
  const [renameOpen, setRenameOpen] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [selectedId, setSelectedId] = useState("")


  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Today</SidebarGroupLabel>
      <SidebarMenu>
        {chats.map((item) => (
          <SidebarMenuItem key={item.id}>
            <SidebarMenuButton asChild>
                <span>{item.title}</span>
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

                  <DropdownMenuItem onClick={() => {setTitle(item.title); setSelectedId(item.id); setRenameOpen(true);}}>
                    <PenLine className="text-muted-foreground" />
                    <span>Rename</span>
                  </DropdownMenuItem>

                  {/* <DropdownMenuItem onClick={() => setShareOpen(true)}>
                    <Forward className="text-muted-foreground" />
                    <span>Share Chat</span>
                  </DropdownMenuItem> */}

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={() => setDeleteOpen(true)}>
                    <Trash2 className="text-muted-foreground"/>
                    <span>Delete Chat</span>
                  </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Rename Dialog */}
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
            <span>{selectedId}</span>
            <Button type="button" variant="outline" onClick={() => setRenameOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={() => {setRenameOpen(false); renameChat(selectedId, title)}}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      {/* <Dialog open={shareOpen} onOpenChange={setShareOpen}>
        <DialogContent className="[&>button]:hidden">
          <DialogHeader>
            <DialogTitle>Share Chat</DialogTitle>
            <DialogDescription>
              Generate a shareable link for this chat conversation.
            </DialogDescription>
          </DialogHeader>
            <div className="flex flex-col gap-2">
              <Label htmlFor="share-link" className="text-right">
                Link
              </Label>
              <Input
                id="share-link"
                value="https://chat.example.com/shared/abc123"
                className="col-span-3"
                readOnly
              />
            </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShareOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={() => setShareOpen(false)}>
              Copy Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="[&>button]:hidden">
          <DialogHeader>
            <DialogTitle>Delete {item.title}?</DialogTitle>
            <DialogDescription>
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="destructive" onClick={() => {deleteChat(item.id); setDeleteOpen(false)}}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
