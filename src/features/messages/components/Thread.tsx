import { AlertTriangle, Loader2, XIcon } from "lucide-react"
import { Id } from "../../../../convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import { useGetMessage } from "../api/use-get-message"
import Message from "@/components/Message"
import { useCurrentMember } from "@/features/members/api/use-current-meber"
import { useWorkspaceId } from "@/hooks/useWorkspaceId"
import { useRef, useState } from "react"
import dynamic from 'next/dynamic'
import Quill from "quill"
import { useGenerateUploadUrl } from "@/features/upload/api/use-generate-upload-url"
import { useCreateMessage } from "../api/use-create-message"
import { useChannelId } from "@/hooks/useChannelId"
import { toast } from "sonner"
import { useGetMessages } from "../api/use-get-messages"
import { differenceInMinutes, format, isToday, isYesterday } from "date-fns"
const Editor = dynamic(() => import('@/components/Editor'), {ssr:false})

const TIME_THRESHOLD = 5

interface ThreadProps {
  messageId: Id<'messages'>
  onClose: () => void
}

type CreatemessageValues = {
  channelId:Id<'channels'>
  workspaceId:Id<'workspaces'>
  parentMessageId:Id<'messages'>
  body:string
  image:Id<'_storage'> | undefined
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

const Thread = ({
  messageId,
  onClose
}:ThreadProps) => {
  const workspaceId = useWorkspaceId()
  const channelId = useChannelId()

  const editorRef = useRef<Quill | null>(null)
  const [editorKey,setEditorKey] = useState(0)
  const [isPending,setIsPending] = useState(false)
  const [editingId,setEditingId] = useState<Id<'messages'> | null>(null)
  const {mutate:generateUploadUrl} = useGenerateUploadUrl()
  const {mutate:createMessage} = useCreateMessage()
  
  const {data:message,isLoading:loadingMessage} = useGetMessage({id:messageId})
  const {data:currentMember} = useCurrentMember({workspaceId})
  const {results,status,loadMore} = useGetMessages({
    channelId,
    parentMessageId:messageId
  })

  const canLoadMore = status === 'CanLoadMore'
  const isLoadingMore = status === 'LoadingMore'

  const handleSubmit = async({
    body,
    image
  }: {
    body:string
    image:File|null
  }) => {
    try {
      setIsPending(true)
      editorRef.current?.enable(false)
      const values:CreatemessageValues = {
        channelId,
        workspaceId,
        parentMessageId:messageId,
        body,
        image:undefined
      }
      if(image) {
        const url = await generateUploadUrl({}, {throwError: true})
        if(!url) {
          throw new Error('Failed to generate upload url')
        }
        const result = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': image.type
          },
          body: image
        })

        if(!result.ok) {
          throw new Error('Failed to upload image')
        }

        const {storageId} = await result.json()
        values.image = storageId
      }
      await createMessage(values, {throwError: true})
  
      setEditorKey((key) => key + 1)
      
    } catch (error) {
      toast.error('Failed to send message')
    } finally {
      setIsPending(false)
      editorRef.current?.enable(true)
    }
  }

  const groupedMessages = results?.reduce(
    (groups,message) => {
      const date = new Date(message._creationTime)
      const dateKey = format(date,'yyyy-MM-dd')
      if(!groups[dateKey]) {
        groups[dateKey] = []
      }

      groups[dateKey].unshift(message)
      return groups
    }, {} as Record<string,typeof results>
  )

  if(loadingMessage || status === 'LoadingFirstPage') {
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
        <div className="flex-1 flex flex-col-reverse pb-4 overflow-y-auto messages-scrollbar">
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
                        hideThreadButton={true}
                        threadCount={message.threadCount}
                        threadImage={message.threadImage}
                        threadName={message.threadName}
                        threadTimestamp={message.threadTimestamp}
                      />
                    )
                  })
                }
              </div>
            ))
          }
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
        <div className="px-2">
          <Editor
            key={editorKey}
            onSubmit={handleSubmit}
            innerRef={editorRef}
            disabled={isPending}
            placeholder="Reply..."
          />
        </div>
      </div>
    )
  }

}

export default Thread