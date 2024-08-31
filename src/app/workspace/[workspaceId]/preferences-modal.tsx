import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useRemoveWorkspace } from "@/features/workspaces/api/use-remove-workspace"
import { useUpdateWorkspace } from "@/features/workspaces/api/use-update-workspace"
import { useWorkspaceId } from "@/hooks/useWorkspaceId"
import { TrashIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { type FormEvent, useState } from "react"
import { toast } from "sonner"

interface PreferencesModalProps {
  open: boolean
  setOpen: (open:boolean) => void
  initialValues: string
}

const PreferencesModal = ({
  open,
  setOpen,
  initialValues
}: PreferencesModalProps) => {
  const router = useRouter()
  const workspaceId = useWorkspaceId()
  const [value, setValue] = useState(initialValues)
  const [editOpen, setEditOpen] = useState(false)

  const {mutate:updateWorkspace, isPending:isUpdatingWorkspace} = useUpdateWorkspace()
  const {mutate:removeWorkspace, isPending:isRemovingWorkspace} = useRemoveWorkspace()

  const handleSubmit = async (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    updateWorkspace(
      {id:workspaceId, name:value.trim()},
      {
        onSuccess:() => {
          toast.success('Workspace updated successfully')
          setEditOpen(false)
        },
        onError:() => {
          toast.error('Failed to update workspace')
        }
      }
    )
  }

  const handleRemove = () => {
    removeWorkspace(
      {id:workspaceId},
      {
        onSuccess:() => {
          toast.success('Workspace removed successfully')
          router.replace('/')
        },
        onError:() => {
          toast.error('Failed to remove workspace')
        }
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 bg-gray-50 overflow-hidden">
        <DialogHeader className="p-4 border-b bg-white">
          <DialogTitle>{value}</DialogTitle>
        </DialogHeader>
        <div className="px-4 pb-4 flex flex-col gap-y-2">
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogTrigger asChild>
              <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">
                    Workspace name
                  </p>
                  <p className="text-sm text-[#1264a3] hover:underline font-semibold">
                    Edit
                  </p>
                </div>
                <p className="text-sm">
                  {value}
                </p>
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Rename this workspace</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input 
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  disabled={isUpdatingWorkspace}
                  required
                  autoFocus
                  minLength={3}
                  maxLength={80}
                  placeholder="Workspace name"
                />
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline" disabled={isUpdatingWorkspace}>Cancel</Button>
                  </DialogClose>
                  <Button 
                    type="submit"
                    disabled={isUpdatingWorkspace}
                  >Update Workspace</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          <button
            disabled={isRemovingWorkspace}
            onClick={handleRemove}
            className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 text-rose-600"
          >
            <TrashIcon className="size-4" />
            <p className="text-sm font-semibold">Delete workspace</p>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PreferencesModal