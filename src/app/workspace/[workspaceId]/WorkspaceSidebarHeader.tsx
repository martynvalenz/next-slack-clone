

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Doc } from "../../../../convex/_generated/dataModel"
import { ChevronDown, ListFilter, SquarePen } from "lucide-react"
import Hint from "@/components/hint"

interface WorkspaceHeaderProps {
  workspace:Doc<'workspaces'>
  isAdmin:boolean
}

const WorkspaceSidebarHeader = ({workspace, isAdmin}:WorkspaceHeaderProps) => {
  return (
    <div className="flex items-center justify-between px-4 h-[49px] gap-0.5">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="font-semibold text-lg w-auto p-1.5 overflow-hidden" size="sm" variant="transparent">
            <span className="truncate">
              {workspace.name}
            </span>
            <ChevronDown className="size-4 ml-1 shrink-0"/>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="start" className="w-64">
          <DropdownMenuItem className="cursor-pointer capitalize">
            <div className="size-9 relative overflow-hidden bg-[#616061] text-white font-semibold text-xl rounded-md flex items-center justify-center mr-2">
              {workspace.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col items-start">
              <p className="font-bold">{workspace.name}</p>
              <p className="text-xs text-muted-foreground">Active workspace</p>
            </div>
          </DropdownMenuItem>
          <DropdownMenuSeparator/>
          {
            isAdmin && (
              <>
                <DropdownMenuItem 
                  className="cursor-pointer py-2"
                  onClick={() => console.log('Settings')}
                > 
                  Invite people to {workspace.name}
                </DropdownMenuItem>
                <DropdownMenuSeparator/>
                <DropdownMenuItem 
                  className="cursor-pointer py-2"
                  onClick={() => console.log('Settings')}
                > 
                  Preferences
                </DropdownMenuItem>
              </>
            )
          }
        </DropdownMenuContent>
        <div className="flex items-center gap-y-5">
          <Hint label="Filter">
            <Button variant="transparent" size="iconSm">
              <ListFilter className="size-4 shrink-0"/>
            </Button>
          </Hint>
          <Hint label="New message">
            <Button variant="transparent" size="iconSm">
              <SquarePen className="size-4 shrink-0"/>
            </Button>
          </Hint>
        </div>
      </DropdownMenu>
    </div>
  )
}

export default WorkspaceSidebarHeader