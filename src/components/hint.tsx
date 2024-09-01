'use client'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { type ReactNode } from "react"

interface HintProps {
  label:string
  children:ReactNode
  side?:'top' | 'bottom' | 'left' | 'right'
  align?:'start' | 'center' | 'end'
}

const Hint = ({
  label,
  children,
  side = 'top',
  align = 'center'
}:HintProps) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={500}>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent side={side} align={align} className="bg-black text-white border border-white/5">
          <p className="font-medium text-xs">
            {label}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default Hint