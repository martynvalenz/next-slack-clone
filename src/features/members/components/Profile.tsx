import { Button } from "@/components/ui/button"
import { Id } from "../../../../convex/_generated/dataModel"
import { useGetMember } from "../api/use-get-member"
import { AlertTriangle, ChevronDownIcon, DeleteIcon, Loader2, MailIcon, XIcon } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { useUpdateMember } from "../api/use-update-member"
import { useRemoveMember } from "../api/use-remove-member"
import { useCurrentMember } from "../api/use-current-meber"
import { useWorkspaceId } from "@/hooks/useWorkspaceId"
import { toast } from "sonner"
import { useConfirm } from "@/hooks/useConfirm"
import { useRouter } from "next/navigation"
import { DropdownMenu,DropdownMenuContent,DropdownMenuTrigger, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "@/components/ui/dropdown-menu"


interface ProfileProps {
  memberId:Id<'members'>
  onClose:() => void
}

const Profile = ({
  memberId,
  onClose
}:ProfileProps) => {
  const router = useRouter()
  const workspaceId = useWorkspaceId()
  const [LeaveDialog,confirmLeave] = useConfirm(
    'Leave workspace',
    'Are you sure you want to leave this workspace?',
  )
  const [RemoveDialog,confirmRemove] = useConfirm(
    'Remove member',
    'Are you sure you want to remove this member?',
  )
  const [UpdateDialog,confirmUpdate] = useConfirm(
    'Update role',
    'Are you sure you want to update this member role?',
  )
  const {data:member,isLoading:loadingMember} = useGetMember({memberId})
  const {data:currentMember,isLoading:isLoadingCurrentMember} = useCurrentMember({workspaceId})
  const {mutate:updateMember,isPending:isUpdatingMember} = useUpdateMember()
  const {mutate:removeMember,isPending:isRemovingMember} = useRemoveMember()

  const onRemove = async() => {
    const ok = await confirmRemove()
    if(!ok) return
    removeMember({id:memberId}, {
      onSuccess:() => {
        toast.success('Member removed')
        onClose()
      },
      onError:() => {
        toast.error('Failed to remove member')
      }
    })
  }

  const onLeave = async() => {
    const ok = await confirmLeave()
    if(!ok) return
    removeMember({id:memberId}, {
      onSuccess:() => {
        toast.success('You have left the workspace')
        router.replace('/')
        onClose()
      },
      onError:() => {
        toast.error('Failed to leave workspace')
      }
    })
  }
  
  const onUpdate = async(role:'admin' | 'member') => {
    const ok = await confirmUpdate()
    updateMember({id:memberId,role}, {
      onSuccess:() => {
        toast.success('Role updated')
        onClose()
      },
      onError:() => {
        toast.error('Failed to update role')
      }
    })
  }

  if(loadingMember) {
    return (
      <div className="h-full flex flex-col">
        <div className="h-[49px] flex justify-between items-center p-2 border-b">
          <p className="text-lg font-bold">Profile</p>
          <Button onClick={onClose} size="iconSm" variant="ghost">
            <XIcon className="size-6" />
          </Button>
        </div>
        <div className="h-full flex justify-center items-center">
          <Loader2 className="size-10 animate-spin" />
        </div>
      </div>
    )
  }

  if(!member){
    return (
      <div className="h-full flex flex-col">
        <div className="h-[49px] flex justify-between items-center p-2 border-b">
          <p className="text-lg font-bold">Profile</p>
          <Button onClick={onClose} size="iconSm" variant="ghost">
            <XIcon className="size-6" />
          </Button>
        </div>
        <div className="h-full flex flex-col gap-2 justify-center items-center">
          <AlertTriangle className="size-10" />
          <p className="text-sm text-muted-foreground">Profile not found</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <LeaveDialog />
      <RemoveDialog />
      <UpdateDialog />
      <div className="h-full flex flex-col">
        <div className="h-[49px] flex justify-between items-center p-2 border-b">
          <p className="text-lg font-bold">Profile</p>
          <Button onClick={onClose} size="iconSm" variant="ghost">
            <XIcon className="size-6" />
          </Button>
        </div>
        <div className="p-4 flex flex-col justify-center items-center">
          <Avatar className="max-w-[256px] max-h-[256px] size-full">
            <AvatarImage src={member.user.image} />
            <AvatarFallback className="text-6xl aspect-square">{member.user.name?.[0]}</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col p-4">
          <p className="text-xl font-bold">{member.user.name}</p>
          {
            (currentMember?.role === 'admin' &&  currentMember?._id !== member._id) ? (
              <div className="flex items-center gap-2 mt-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full capitalize">
                      {member.role} <ChevronDownIcon className="size-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    <DropdownMenuRadioGroup
                      value={member.role}
                      onValueChange={(value) => onUpdate(value as 'admin' | 'member')}
                    >
                      <DropdownMenuRadioItem value="admin">
                        Admin
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="member">
                        Member
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="outline" className="w-full" onClick={onRemove}>
                  Remove
                </Button>
              </div>
            ) : (currentMember?.role !== 'admin' && currentMember?._id === member._id) ? (
              <div>
                <Button className="mt-4" onClick={onLeave}>
                  Leave
                </Button>
              </div>
            ) : null
          }
        </div>
        <Separator />
        <div className="flex flex-col p-4">
          <p className="text-sm font-bold mb-4">Contact information</p>
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-md bg-muted flex items-center justify-center">
              <MailIcon className="size-6" />
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-bold">Email</p>
              <Link href={`mailto:${member.user.email}`} className="text-sm hover:underline">{member.user.email}</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Profile