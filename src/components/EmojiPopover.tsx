import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useState, type ReactNode } from "react"
import EmojiPicker, { type EmojiClickData } from 'emoji-picker-react'


interface EmojiPopoverProps {
  children:ReactNode
  hint?:string
  onEmojiSelect:(emoji:string) => void
}

const EmojiPopover = ({
  children,
  hint = 'Emoji',
  onEmojiSelect
}:EmojiPopoverProps) => {
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [tooltipOpen, setTooltipOpen] = useState(false)
  const onSelect = (value:EmojiClickData) => {
    onEmojiSelect(value.emoji)
    setPopoverOpen(false)
    setTooltipOpen(false)
  }

  return (
    <TooltipProvider>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen} delayDuration={500}>
          <PopoverTrigger asChild>
            <TooltipTrigger asChild>
              {children}
            </TooltipTrigger>
          </PopoverTrigger>
          <TooltipContent className="bg-black text-white border border-white/5">
            <p className="font-medium text-xs">
              {hint}
            </p>
          </TooltipContent>
        </Tooltip>
        <PopoverContent className="p-0 w-full border-none shadow-none">
          <EmojiPicker
            onEmojiClick={onSelect}
          />
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  )
}

export default EmojiPopover