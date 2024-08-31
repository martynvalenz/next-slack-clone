'use client'

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { DialogDescription } from "@radix-ui/react-dialog"
import { useState } from "react"

export const useConfirm = (
  title:string,
  message:string,
):[() => JSX.Element,() => Promise<unknown>] => {
  const [promise, setPromise] = useState<{resolve:(value:boolean) => void} | null>(null)

  const confirm = () => new Promise<boolean>((resolve,rejecrt) => {
    setPromise({resolve})
  })

  const handleClose = () => {
    setPromise(null)
  }

  const handleCancel = () => {
    promise?.resolve(false)
    handleClose()
  }

  const handleConfirm = () => {
    promise?.resolve(true)
    handleClose()
  }

  const ConfirmDialog = () => (
    <Dialog open={promise !== null}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="pt-2">
          <Button variant="outline" onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleConfirm} variant="destructive">Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  return [ConfirmDialog,confirm]
}