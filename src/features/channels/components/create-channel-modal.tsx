
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { type ChangeEvent, type FormEvent, useState } from 'react'
import { useCreateChannelModal } from "../store/use-create-channel-modal"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useCreateChannel } from "../api/use-create-channel"
import { useWorkspaceId } from "@/hooks/useWorkspaceId"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const CreateChannelModal = () => {
  const router = useRouter()
  const [open, setOpen] = useCreateChannelModal()
  const [name, setName] = useState('')
  const {mutate, isPending} = useCreateChannel()
  const workspaceId = useWorkspaceId()
  
  const handleClose = () => {
    setName('')
    setOpen(false)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, '-').trim().toLowerCase()
    setName(value)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    mutate({
      name,
      workspaceId
    }, {
      onSuccess: (id) => {
        router.push(`/workspace/${workspaceId}/channel/${id}`)
        toast.success('Channel created')
        handleClose()
      },
      onError: () => {
        toast.error('Failed to create channel')
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a channel</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input 
            value={name}
            disabled={isPending}
            onChange={handleChange}
            required
            autoFocus
            minLength={3}
            maxLength={80}
            placeholder="Channel name"
          />
          <div className="flex justify-end">
            <Button
              disabled={isPending}
              type="submit"
            >
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateChannelModal