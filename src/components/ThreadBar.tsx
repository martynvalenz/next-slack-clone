import { formatDistanceToNow } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { ChevronRight } from "lucide-react"

interface ThreadBarProps {
  count?:number
  image?:string
  name?:string
  timestamp?:number
  onClick?:() => void
}

const ThreadBar = ({
  count,
  image,
  name = 'Member',
  timestamp,
  onClick
}:ThreadBarProps) => {
  if(!count || !timestamp) return null

  return (
    <button
      className="p-1 rounded-md hover:bg-white border border-transparent hover:border-border flex items-center justify-start group/thread-bar transition max-w-[600px]"
      onClick={onClick}
    >
      <div className="flex items-center gap-2 overflow-hidden">
        <Avatar className="size-6 shrink-0">
          <AvatarImage src={image} alt="Thread" />
          <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <span className="text-sm text-sky-700 hover:underline font-bold truncate">
          {count} {count > 1 ? 'replies' : 'reply'}
        </span>
        <span className="text-xs text-muted-foreground truncate group-hover/thread-bar:hidden block">
          Last reply {formatDistanceToNow(new Date(timestamp), {addSuffix:true})}
        </span>
        <span className="text-sm text-muted-foreground truncate group-hover/thread-bar:block hidden">
          View thread
        </span>
      </div>
      <ChevronRight className="size-4 text-muted-foreground ml-auto opacity-0 group-hover/thread-bar:opacity-100 transition shrink-0" />
    </button>
  )
}

export default ThreadBar