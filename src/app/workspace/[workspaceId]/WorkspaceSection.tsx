import Hint from "@/components/hint"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { PlusIcon } from "lucide-react"
import { ReactNode } from "react"
import { FaCaretDown } from "react-icons/fa"
import {useToggle} from 'react-use'

interface WorkspaceSectionProps {
  children?: ReactNode
  label:string
  hint:string
  onNew?:() => void
}

const WorkspaceSection = ({
  children,
  label,
  hint,
  onNew
}: WorkspaceSectionProps) => {
  const [on,toggle] = useToggle(true)
  return (
    <div className="flex flex-col mt-3 px-2"> 
      <div className="flex items-center px-3.5 group">
        <Button
          variant="transparent"
          size="sm"
          className="p-0.5 text-sm text-[#f9edffcc] shrink-0 size-6"
          onClick={toggle}
        >
          <FaCaretDown className={cn('size-4 transition-transform transition-duration-200',
            !on && '-rotate-90'
          )}/>
        </Button>
        <Button
          variant="transparent"
          size="sm"
          className="group px-1.5 text-sm h-[28px] justify-start overflow-hidden items-center text-[#f9edffcc]"
        >
          <span className="truncate">{label}</span>
        </Button>
        {
          onNew && (
            <Hint 
              label={hint}
              side="top"
              align="center"
            >
              <Button
                variant="transparent"
                size="iconSm"
                className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto p-0.5 text-sm text-[#f9edffcc] siz-6 shrink-0"
                onClick={onNew}
              >
                <PlusIcon className="size-4"/>
              </Button>
            </Hint>
          )
        }
      </div>
      {on && children}
    </div>
  )
}

export default WorkspaceSection