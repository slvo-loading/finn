"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase";

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
  chats, deleteChat
}: {
  chats: Chat[],
  deleteChat: (chatId: string) => void
}) {

  const { isMobile } = useSidebar()
  const [renameOpen, setRenameOpen] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)


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

                  <DropdownMenuItem onClick={() => setRenameOpen(true)}>
                    <PenLine className="text-muted-foreground" />
                    <span>Rename</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => setShareOpen(true)}>
                    <span>Share Chat</span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={() => setDeleteOpen(true)}>
                    <span>Delete Chat</span>
                  </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Rename Dialog */}
      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Chat</DialogTitle>
            <DialogDescription>
              Enter a new name for this chat conversation.
            </DialogDescription>
          </DialogHeader>
          {/* <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="chat-name" className="text-right">
                Name
              </Label>
              <Input
                id="chat-name"
                defaultValue="My Chat Conversation"
                className="col-span-3"
              />
            </div>
          </div> */}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setRenameOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={() => setRenameOpen(false)}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={shareOpen} onOpenChange={setShareOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Chat</DialogTitle>
            <DialogDescription>
              Generate a shareable link for this chat conversation.
            </DialogDescription>
          </DialogHeader>
          {/* <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
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
          </div> */}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShareOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={() => setShareOpen(false)}>
              Copy Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              chat conversation and remove all messages from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="destructive" onClick={() => setDeleteOpen(false)}>
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
