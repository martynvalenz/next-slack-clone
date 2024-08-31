'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { type FormEvent, useState } from 'react'
import { useCreateWorkspaceModal } from "../store/use-create-workspace-modal"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useCreateWorkspace } from "../api/use-create-workspace"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const CreateWorkspaceModal = () => {
  const router = useRouter()
  const [open, setOpen] = useCreateWorkspaceModal()
  const [name, setName] = useState('')
  const {mutate, isPending, isError, isSuccess, data, error} = useCreateWorkspace()

  const handleClose = () => {
    setOpen(false)
    setName('')
  }

  const handleSubmit = (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    mutate({name}, {
      onSuccess(id) {
        router.push(`/workspace/${id}`)
        toast.success('Workspace created successfully')
        handleClose()
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a workspace</DialogTitle>
          <DialogDescription>
            Workspaces are where you collaborate with your team. You can create multiple workspaces for different projects. It can be a team, a project, personal or home
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isPending}
            required
            autoFocus
            minLength={3}
            maxLength={80}
            placeholder="Workspace name"
          />
          <div className="flex justify-end">
            <Button 
              type="submit"
              disabled={isPending}
            >Create Workspace</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateWorkspaceModal