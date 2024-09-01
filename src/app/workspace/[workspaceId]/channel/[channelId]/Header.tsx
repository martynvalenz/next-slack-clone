import { Button } from '@/components/ui/button'
import React, { type ChangeEvent, type FormEvent, useState } from 'react'
import { FaChevronDown } from 'react-icons/fa'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { TrashIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useUpdateChannel } from '@/features/channels/api/use-update-channel'
import { useChannelId } from '@/hooks/useChannelId'
import { toast } from 'sonner'
import { useRemovChannel } from '@/features/channels/api/use-remove-channel'
import { useConfirm } from '@/hooks/useConfirm'
import { useRouter } from 'next/navigation'
import { useWorkspaceId } from '@/hooks/useWorkspaceId'
import { useCurrentMember } from '@/features/members/api/use-current-meber'

interface HeaderProps {
  title: string
}

const Header = ({
  title
}: HeaderProps) => {
  const router = useRouter()
  const [editOpen, setEditOpen] = useState(false)
  const [value, setValue] = useState(title)
  const [ConfirmDialog,confirm] = useConfirm(
    'Are you sure you want to delete this channel?',
    'This action cannot be undone'
  )
  const channelId = useChannelId()
  const workspaceId = useWorkspaceId()
  const {data:member} = useCurrentMember({workspaceId})

  const isAdmin = member?.role === 'admin'
  const handleEditOpen = (value:boolean) => {
    if(isAdmin) {
      setEditOpen(value)
    }
  }

  const {
    mutate: updateChannel,
    isPending:isUpdatingChannel,
  } = useUpdateChannel()
  const {
    mutate: removeChannel,
    isPending:isRemovingChannel,
  } = useRemovChannel()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, '-').trim().toLowerCase()
    setValue(value)
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    updateChannel({
      id: channelId,
      name: value
    }, {
      onSuccess: () => {
        toast.success('Channel updated')
        setEditOpen(false)
      },
      onError: () => {
        toast.error('Failed to update channel')
      }
    })
  }

  const handleDelete = async() => {
    const ok = await confirm()
    if(!ok) return

    removeChannel({
      id: channelId
    }, {
      onSuccess: () => {
        toast.success('Channel deleted')
        router.replace(`/workspace/${workspaceId}`)
      },
      onError: () => {
        toast.error('Failed to delete channel')
      }
    })
  }

  return (
    <div className='bg-white border-b h-[49px] flex items-center px-4 overflow-hidden'>
      <ConfirmDialog />
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className='text-lg font-semibold px-2 overflow-hidden w-auto'
            size="sm"
          >
            <span className='truncate'># {title}</span>
            <FaChevronDown className='ml-2 size-2.5' />
          </Button>
        </DialogTrigger>
        <DialogContent className='p-0 bg-gray-50 overflow-hidden'>
          <DialogHeader className='p-4 border-b bg-white'>
            <DialogTitle>
              # {title}
            </DialogTitle>
          </DialogHeader>
          <div className='px-4 pb-4 flex flex-col gap-y-2'>
            <Dialog open={editOpen} onOpenChange={handleEditOpen}>
              <DialogTrigger asChild>
                <div className='px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50'>
                  <div className='flex items-center justify-between'>
                    <p className='text-sm font-semibold'>Channel name</p>
                    {isAdmin && <p className='text-sm text-[#1264a3] hover:underline font-semibold'>Edit</p>}
                  </div>
                  <p className='text-sm'># {title}</p>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    Rename this channel
                  </DialogTitle>
                </DialogHeader>
                <form className='space-y-4' onSubmit={handleSubmit}>
                  <Input 
                    placeholder='Channel name'
                    value={value}
                    onChange={handleChange}
                    disabled={isUpdatingChannel}
                    required
                    autoFocus
                    minLength={3}
                    maxLength={80}
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant='outline' disabled={isUpdatingChannel}>Cancel</Button>
                    </DialogClose>
                    <Button type='submit' disabled={isUpdatingChannel} >Save</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            {
              isAdmin && (
                <button
                  className='flex items-center gap-x-2 py-4 px-5 bg-white rounded-lg cursor-pointer border hover:bg-gray-50 text-rose-600'
                  onClick={handleDelete}
                  disabled={isRemovingChannel}
                >
                  <TrashIcon className='size-4' />
                  <p className='text-sm font-semibold'>Delete channel</p>
                </button>
              )
            }
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Header