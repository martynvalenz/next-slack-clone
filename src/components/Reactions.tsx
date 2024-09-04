import { useWorkspaceId } from "@/hooks/useWorkspaceId"
import { Doc, Id } from "../../convex/_generated/dataModel"
import { useCurrentMember } from "@/features/members/api/use-current-meber"
import { cn } from "@/lib/utils"
import Hint from "./hint"
import EmojiPopover from './EmojiPopover';
import { MdOutlineAddReaction } from "react-icons/md"

interface ReactionsProps {
  data:Array<
    Omit<Doc <'reactions'>,'memberId'> & {
      count:number
      memberIds:Id<'members'>[]
    }
  >
  onChange:(reaction:string) => void
}

const Reactions = ({
  data,
  onChange
}:ReactionsProps) => {
  const workspaceId = useWorkspaceId()
  const {data:currentMember} = useCurrentMember({workspaceId})
  const currentMenberId = currentMember?._id

  if(data.length === 0 || !currentMenberId) {
    return null
  }

  return (
    <div className="flex items-center gap-1 my-1">
      {
        data.map((reaction) => (
          <Hint
            key={reaction._id}
            label={`${reaction.count} ${reaction.count === 1 ? 'person' : 'people'} reacted with ${reaction.value}`}
          >
            <button
              className={cn(
                'h-7 flex items-center gap-1 px-2 py-1 rounded-full text-sm border border-transparent',
                reaction.memberIds.includes(currentMenberId) ? 'bg-blue-200 hover:bg-blue-200/70' : 'bg-slate-100/70 hover:border-slate-200'
              )}
              onClick={() => onChange(reaction.value)}
            > 
              <span>{reaction.value}</span>
              <span>{reaction.count}</span>
            </button>
          </Hint>
        ))
      }
      <EmojiPopover 
        hint="Add reaction"
        onEmojiSelect={(emoji) => onChange(emoji.native)}
      >
        <button className="h-7 px-3 rounded-full bg-slate-200/30 border border-transparent hover:border-slate-500">
          <MdOutlineAddReaction className="size-4 text-slate-800" />
        </button>
      </EmojiPopover>
    </div>
  )
}

export default Reactions