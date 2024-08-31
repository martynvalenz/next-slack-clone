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
import { useWorkspaceId } from "@/hooks/useWorkspaceId"
import { DialogDescription } from "@radix-ui/react-dialog"
import { CopyIcon } from "lucide-react"
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

  const handleCopy = () => {
    const inviteLink = `${window.location.origin}/join/${workspaceId}`
    navigator.clipboard.writeText(inviteLink)
      .then(() => {
        toast.success('Link copied to clipboard')
      })
  }

  return (
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
            <CopyIcon className="size-5 ml-2"/>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default InviteModal