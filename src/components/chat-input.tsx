"use client"

import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Plus, ArrowUp } from "lucide-react"
import { ModelSelector } from "@/components/model-selector"


export function ChatInput() {

    return(
    <div className="flex-1 flex flex-col bg-gray-300 min-w-0">
        <div className="bg-gray-500 flex-1 overflow-y-auto">
        </div>

        <div className="bg-white w-fit max-w-[90%] max-h-[35%] flex flex-col mb-10 mx-auto rounded-3xl p-2 gap-2">
          <Textarea/>
          
          <div className="flex justify-center items-center w-full px-4 py-2">
              <div className="flex gap-2">
              <Button variant="ghost" size="sm">
                <Plus/>
              </Button>
              <ModelSelector />
              </div>
              <div className="flex ml-auto">
              <Button size="sm">
                <ArrowUp/>
              </Button>
              </div>
          </div>
        </div>
    </div>
)}