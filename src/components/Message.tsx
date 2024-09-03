import { format, isToday, isYesterday } from "date-fns"
import { Doc, Id } from "../../convex/_generated/dataModel"
import dynamic from 'next/dynamic'
import Hint from "./hint"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import Thumbnail from "./Thumbnail"
import Toolbar from "./Toolbar"
import { useUpdateMessage } from "@/features/messages/api/use-update-message"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
const Renderer = dynamic(() => import('@/components/Renderer'), {ssr:false})
const Editor = dynamic(() => import('@/components/Editor'), {ssr:false})

interface MessageProps {
  id:Id<'messages'>
  memberId:Id<'members'>
  authorImage?:string
  authorName?:string
  isAuthor?:boolean
  reactions: Array<
    Omit<Doc<'reactions'>,'memberId'> & {
      count:number
      memberIds:Id<'members'>[]
    }
  >
  body:Doc<'messages'>['body']
  image:string|null|undefined
  createdAt:Doc<'messages'>['_creationTime']
  updatedAt:Doc<'messages'>['updatedAt']
  isEditing:boolean
  setEditingId:(id:Id<'messages'>|null) => void
  isCompact?:boolean
  hideThreadButton?:boolean
  threadCount?:number
  threadImage?:string
  threadTimestamp?:number
}

const formatFullTime = (date:Date) => {
  return `${isToday(date) ? 'Today' : isYesterday(date) ? 'Yesterday' : format(date,'MMM d, yyyy')} at ${format(date,'h:mm a')}`
}

const Message = ({
  id,
  memberId,
  authorImage,
  authorName = 'Member',
  isAuthor,
  reactions,
  body,
  image,
  createdAt,
  updatedAt,
  isEditing,
  setEditingId,
  isCompact,
  hideThreadButton,
  threadCount,
  threadImage,
  threadTimestamp
}:MessageProps) => {
  const {mutate:updateMessage,isPending:isUpdatingMessage} = useUpdateMessage()
  const isPending = isUpdatingMessage
  
  const handleUpdate = ({body}:{body:string}) => {
    updateMessage({body,id},{
      onSuccess:() => {
        toast.success('Message updated')
        setEditingId(null)
      },
      onError:() => {
        toast.error('Failed to update message')
      }
    })
  }

  if(isCompact) {
    return (
      <div className={cn('flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative',
        isEditing && 'bg-[#F2C74433] hover:bg-[#F2C74433]'
      )}>
        <div className="flex items-start gap-2">
          <Hint
            label={formatFullTime(new Date(createdAt))}
          >
            <button className="text-xs text-muted-foreground w-[40px] leading-[22px] text-center hover:underline">
              {format(new Date(createdAt),'HH:mm')}
            </button>
          </Hint>
          {
            isEditing ? (
              <div className="w-full h-full">
                <Editor
                  disabled={isPending}
                  variant="update"
                  defaultValue={JSON.parse(body)}
                  onSubmit={handleUpdate}
                  onCancel={() => setEditingId(null)}
                />
              </div>
            ) : (
              <div className="flex flex-col w-full">
                <Renderer value={body} />
                <Thumbnail url={image} />
                {
                  updatedAt && (
                    <span className="text-xs text-muted-foreground">(edited)</span>
                  )
                }
              </div>
            )
          }
        </div>
        {
          !isEditing && (
            <Toolbar
              isAuthor={isAuthor || false}
              isPending={isPending}
              handleEdit={() => setEditingId(id)}
              handleThread={() => {}}
              handleDelete={() => {}}
              handleReaction={() => {}}
              hideThreadButton={hideThreadButton}
            />
          )
        }
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative',
      isEditing && 'bg-[#F2C74433] hover:bg-[#F2C74433]'
    )}>
      <div className="flex items-start gap-2">
        <button>
          <Avatar className="rounded-md">
            <AvatarImage src={authorImage} className="rounded-md" alt={authorName} />
            <AvatarFallback className="rounded-md bg-slate-500 text-white">{authorName[0]}</AvatarFallback>
          </Avatar>
        </button>
        {
          isEditing ? (
            <div className="w-full h-full">
              <Editor
                disabled={isPending}
                variant="update"
                defaultValue={JSON.parse(body)}
                onSubmit={handleUpdate}
                onCancel={() => setEditingId(null)}
              />
            </div>
          ) : (
            <div className="flex flex-col w-full overflow-hidden">
              <div className="text-sm">
                <button className="font-bold text-primary hover:underline">
                  {authorName}
                </button>
                <span>&nbsp;&nbsp;</span>
                <Hint
                label={formatFullTime(new Date(createdAt))}
                >
                  <button className="text-xs text-muted-foreground hover:underline">
                    {format(new Date(createdAt),'h:mm a')}
                  </button>
                </Hint>
              </div>
              <Renderer value={body} />
              <Thumbnail url={image} />
              {
                updatedAt && (
                  <span className="text-xs text-muted-foreground">(edited)</span>
                )
              }
            </div>
          )
        }
      </div>
      {
        !isEditing && (
          <Toolbar
            isAuthor={isAuthor || false}
            isPending={isPending}
            handleEdit={() => setEditingId(id)}
            handleThread={() => {}}
            handleDelete={() => {}}
            handleReaction={() => {}}
            hideThreadButton={hideThreadButton}
          />
        )
      }
    </div>
  )
}

export default Message