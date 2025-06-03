import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

export function ModelSelector() {
    return(
        <Select>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a Model" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="light">ChatGPT 4o</SelectItem>
                <SelectItem value="dark">Claude Sonnet 4</SelectItem>
                <SelectItem value="system">Deepseek V2</SelectItem>
            </SelectContent>
        </Select>
    )
}