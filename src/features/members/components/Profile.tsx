import { Button } from "@/components/ui/button"
import { Id } from "../../../../convex/_generated/dataModel"
import { useGetMember } from "../api/use-get-member"
import { AlertTriangle, Loader2, MailIcon, XIcon } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

interface ProfileProps {
  memberId:Id<'members'>
  onClose:() => void
}

const Profile = ({
  memberId,
  onClose
}:ProfileProps) => {
  const {data:member,isLoading:loadingMember} = useGetMember({memberId})


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
  )
}

export default Profile