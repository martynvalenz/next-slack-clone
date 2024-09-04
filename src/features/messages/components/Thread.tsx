import { AlertTriangle, Loader2, XIcon } from "lucide-react"
import { Id } from "../../../../convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import { useGetMessage } from "../api/use-get-message"
import Message from "@/components/Message"
import { useCurrentMember } from "@/features/members/api/use-current-meber"
import { useWorkspaceId } from "@/hooks/useWorkspaceId"
import { useState } from "react"

interface ThreadProps {
  messageId: Id<'messages'>
  onClose: () => void
}

const Thread = ({
  messageId,
  onClose
}:ThreadProps) => {
  const workspaceId = useWorkspaceId()
  const {data:message,isLoading:loadingMessage} = useGetMessage({id:messageId})
  const {data:currentMember} = useCurrentMember({workspaceId})
  const [editingId,setEditingId] = useState<Id<'messages'> | null>(null)

  if(loadingMessage) {
    return (
      <div className="h-full flex flex-col">
        <div className="h-[49px] flex justify-between items-center p-2 border-b">
          <p className="text-lg font-bold">Thread</p>
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

  if(!message){
    <div className="h-full flex flex-col">
      <div className="h-[49px] flex justify-between items-center p-2 border-b">
        <p className="text-lg font-bold">Thread</p>
        <Button onClick={onClose} size="iconSm" variant="ghost">
          <XIcon className="size-6" />
        </Button>
      </div>
      <div className="h-full flex flex-col gap-2 justify-center items-center">
        <AlertTriangle className="size-10" />
        <p className="text-sm text-muted-foreground">Message not found</p>
      </div>
    </div>
  }
  else {
    return (
      <div className="h-full flex flex-col">
        <div className="h-[49px] flex justify-between items-center p-2 border-b">
          <p className="text-lg font-bold">Thread</p>
          <Button onClick={onClose} size="iconSm" variant="ghost">
            <XIcon className="size-6" />
          </Button>
        </div>
        <div>
          <Message
            id={message._id}
            memberId={message.memberId}
            authorImage={message.user.image}
            authorName={message.user.name}
            isAuthor={message.memberId === currentMember?._id}
            reactions={message.reactions}
            body={message.body}
            image={message.image}
            updatedAt={message.updatedAt}
            createdAt={message._creationTime}
            isEditing={editingId === message._id}
            setEditingId={setEditingId}
            // isCompact={isCompact}
            // hideThreadButton={variant === 'thread'}
            // threadCount={message.threadCount}
            // threadImage={message.threadImage}
            // threadTimestamp={message.threadTimestamp}
          />
        </div>
      </div>
    )
  }

}

export default Thread