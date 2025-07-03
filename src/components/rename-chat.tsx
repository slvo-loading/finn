import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
  } from "@/components/ui/dialog"

  import {
    DropdownMenuItem,
  } from '@/components/ui/dropdown-menu'

 import { PenLine } from "lucide-react"

export function RenameChat() {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <DropdownMenuItem>
            <PenLine className="text-muted-foreground" />
            <span>Rename</span>
          </DropdownMenuItem>
        </DialogTrigger>
  
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
  