import { Button } from "@/components/ui/button"
import { Id } from "../../../../convex/_generated/dataModel"
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const sidebarItemVariants = cva(
  'flex items-center gap-1.5 justify-start font-normal h-7 px-[18px] text-sm overflow-hidden',
  {
    variants:{
      variant:{
        default:'text-[#f9edffcc]',
        active:'text-[#481349] bg-white/90 hover:bg-white/80'
      }
    },
    defaultVariants:{
      variant:'default'
    }
  }
)

interface UserItemProps {
  id:Id<'members'>
  label?:string
  image?:string
  variant?:VariantProps<typeof sidebarItemVariants>['variant']
}

const UserItem = ({
  id,
  label = 'Member',
  image,
  variant
}: UserItemProps) => {
  const workspaceId = useWorkspaceId()
  
  return (
    <Button
      asChild
      variant="transparent"
      className={cn(sidebarItemVariants({variant}))}
      size="sm"
    >
      <Link href={`/workspace/${workspaceId}/member/${id}`}>
        <Avatar className="size-5 rounded-md mr-1">
          <AvatarImage src={image} alt={label} className="rounded-md" />
          <AvatarFallback className="rounded-md bg-sky-600 text-white">
            {label.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <span className="text-sm truncate">{label}</span>
      </Link>
    </Button>
  )
}

export default UserItem