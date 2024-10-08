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
import { useNewJoinCode } from "@/features/workspaces/api/use-new-join-code"
import { useConfirm } from "@/hooks/useConfirm"
import { useWorkspaceId } from "@/hooks/useWorkspaceId"
import { DialogDescription } from "@radix-ui/react-dialog"
import { CopyIcon, RefreshCcw } from "lucide-react"
import { toast } from "sonner"

interface InviteModalProps {
  open: boolean
  setOpen: (open:boolean) => void
  name: string
  joinCode: string
}

const InviteModal = ({
  open,
  setOpen,
  name,
  joinCode
}: InviteModalProps) => {
  const workspaceId = useWorkspaceId()
  const [ConfirmDialog, confirm] = useConfirm(
    'Are you sure you want to generate a new code?',
    'This will invalidate the previous code and anyone using it will not be able'
  )
  const {mutate, isPending} = useNewJoinCode()

  const handleNewCode = async() => {
    const ok = await confirm()
    if(!ok) return
    mutate({workspaceId},{
      onSuccess: () => {
        toast.success('New code generated')

      },
      onError: () => {
        toast.error('Failed to generate new code')
      }
    })
  }

  const handleCopy = () => {
    const inviteLink = `${window.location.origin}/join/${workspaceId}`
    navigator.clipboard.writeText(inviteLink)
      .then(() => {
        toast.success('Link copied to clipboard')
      })
  }

  return (
    <>
      <ConfirmDialog/>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite people to {name}</DialogTitle>
            <DialogDescription>Use the code below to invite people to your workspace</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-y-4 items-center justify-center py-10">
            <p className="text-4xl font-bold tracking-widest uppercase">
              {joinCode}
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
            >
              Copy link
              <CopyIcon className="size-4 ml-2"/>
            </Button>
          </div>
          <div className="flex items-center justify-between w-full">
            <Button
              variant="outline"
              onClick={handleNewCode}
              disabled={isPending}
            >
              New code
              <RefreshCcw className="size-4 ml-2"/>
            </Button>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default InviteModal