import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace"
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces"
import { useCreateWorkspaceModal } from "@/features/workspaces/store/use-create-workspace-modal"
import { useWorkspaceId } from "@/hooks/useWorkspaceId"
import { Loader2, Plus } from "lucide-react"
import { useRouter } from "next/navigation"

const WorkspaceSwitcher = () => {
  const router = useRouter()
  const workspaceId = useWorkspaceId()
  const {data:workspace, isLoading:workspaceLoading} = useGetWorkspace({id:workspaceId})
  const {data:workspaces, isLoading:workspacesLoading} = useGetWorkspaces()

  const filteredWorkspaces = workspaces?.filter(w => w._id !== workspaceId)
  const [_open, setOpen] = useCreateWorkspaceModal()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="size-9 relative overflow-hidden bg-[#ababad] hover:bg-[#ababad]/80 font-semibold text-slate-800 text-xl">
          {
            workspaceLoading ? (
              <Loader2 className="size-5 text-white animate-spin shrink-0" />
            ) : (
              workspace?.name?.charAt(0).toUpperCase()
            )
          }
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="start" className="w-64">
        <DropdownMenuItem className="cursor-pointer flex-col justify-start items-start capitalize"
          onClick={() => router.push(`/workspace/${workspaceId}`)}
        >
          {workspace?.name}
          <span className="text-xs text-muted-foreground">
            Active workspace
          </span>
        </DropdownMenuItem>
        {
          filteredWorkspaces?.map((workspace) => {
            return (
              <DropdownMenuItem key={workspace._id} className="cursor-pointer capitalize overflow-hidden"
                onClick={() => router.push(`/workspace/${workspace._id}`)}
              >
                <div className="shrink-0 size-9 relative overflow-hidden bg-slate-500 text-white font-semibold text-lg rounded-md flex items-center justify-center mr-2">
                  {workspace.name?.charAt(0).toUpperCase()}
                </div>
                <p className="truncate">{workspace.name}</p>
              </DropdownMenuItem>
            )
          })
        }
        <DropdownMenuItem
          onClick={() => setOpen(true)}
        >
          <div className="size-9 relative overflow-hidden bg-[#f2f2f2] text-slate-800 font-semibold text-lg rounded-md flex items-center justify-center mr-2">
            <Plus className="size-5" />
          </div>
          <span>Create a new workspace</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default WorkspaceSwitcher