import { GetMessagesReturnType } from "@/features/messages/api/use-get-messages";
import { differenceInMinutes, format, isToday, isYesterday } from "date-fns";
import Message from "./Message";
import ChannelHero from "./ChannelHero";
import { useState } from "react";
import { Id } from "../../convex/_generated/dataModel";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { useCurrentMember } from "@/features/members/api/use-current-meber";
import { Loader2 } from "lucide-react";

const TIME_THRESHOLD = 5

interface MessageListProps {
  memberName?: string;
  memberImage?: string;
  channelName?: string;
  channelCreationTime?: number;
  variant?:'channel'|'thread'|'conversation';
  data:GetMessagesReturnType | undefined;
  loadMore:() => void;
  isLoadingMore:boolean;
  canLoadMore:boolean;
}

const formatDatelabel = (dateString:string) => {
  const date = new Date(dateString)
  if(isToday(date)) {
    return 'Today'
  }
  else if(isYesterday(date)) {
    return 'Yesterday'
  }
  return format(date,'EEEE, MMMM d')
}

const MessageList = ({
  memberName,
  memberImage,
  channelName,
  channelCreationTime,
  variant = 'channel',
  data,
  loadMore,
  isLoadingMore,
  canLoadMore,
}:MessageListProps) => {
  const [editingId,setEditingId] = useState<Id<'messages'> | null>(null)
  const workspaceId = useWorkspaceId()

  const {data:currentMember} = useCurrentMember({workspaceId})

  const groupedMessages = data?.reduce(
    (groups,message) => {
      const date = new Date(message._creationTime)
      const dateKey = format(date,'yyyy-MM-dd')
      if(!groups[dateKey]) {
        groups[dateKey] = []
      }

      groups[dateKey].unshift(message)
      return groups
    }, {} as Record<string,typeof data>
  )

  return (
    <div className="flex-1 flex flex-col-reverse pb-4 overflow-y-auto messages-scrollbar">
      {
        Object.entries(groupedMessages || {}).map(([dateKey,messages]) => (
          <div key={dateKey}>
            <div className="text-center my-2 relative">
              <hr className="absolute top-1/2 left-0 right-0 border-gray-300" />
              <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
                {formatDatelabel(dateKey)}
              </span>
            </div>
            {
              messages.map((message,index) => {
                const prevMessage = messages[index-1]
                const isCompact = 
                  prevMessage && 
                  prevMessage.user?._id === message.user?._id &&
                  differenceInMinutes(new Date(message._creationTime),new Date(prevMessage._creationTime)) < TIME_THRESHOLD

                return (
                  <Message
                    key={message._id}
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
                    isCompact={isCompact}
                    hideThreadButton={variant === 'thread'}
                    threadCount={message.threadCount}
                    threadImage={message.threadImage}
                    threadTimestamp={message.threadTimestamp}
                  />
                )
              })
            }
          </div>
        ))
      }
      {
        isLoadingMore ? (
          <div className="text-center my-2 relative">
            <hr className="absolute top-1/2 left-0 right-0 border-gray-300" />
            <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
              <Loader2 className="animate-spin size-4" />
            </span>
          </div>
        ) : (
          <div 
            className="h-1" 
            ref={(el) => {
              if(el) {
                const observer = new IntersectionObserver(([entry]) => {
                  if(entry.isIntersecting && canLoadMore) {
                    loadMore()
                  }
                },{threshold:1})
                observer.observe(el)
                return () => observer.disconnect()
              }

            }} 
          />
        )
      }
      {
        variant === 'channel' && channelName && channelCreationTime && (
          <ChannelHero
            name={channelName}
            creationTime={channelCreationTime}
          />
        )
      }
    </div>
  )
}

export default MessageList