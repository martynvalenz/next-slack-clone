import { MessageSquareTextIcon, Pencil, Smile, Trash } from "lucide-react"
import { Button } from "./ui/button"
import Hint from "./hint"
import EmojiPopover from "./EmojiPopover"

interface ToolbarProps {
  isAuthor:boolean
  isPending:boolean
  handleEdit:() => void
  handleThread:() => void
  handleDelete:() => void
  handleReaction:(value:string) => void
  hideThreadButton?:boolean
}

const Toolbar = ({
  isAuthor,
  isPending,
  handleEdit,
  handleThread,
  handleDelete,
  handleReaction,
  hideThreadButton
}:ToolbarProps) => {
  return (
    <div className="absolute top-0 right-5">
      <div className="group-hover:opacity-100 opacity-0 transition-opacity border bg-white rounded-md shadow-sm">
        <EmojiPopover 
          onEmojiSelect={(emoji) => handleReaction(emoji.native)}
          hint="Add reaction"
        >
          <Button
            variant="ghost"
            size="iconSm"
          >
            <Smile className="size-4" />
          </Button>
        </EmojiPopover>
        {
          isAuthor && (
            <Hint label="Edit">
              <Button
                variant="ghost"
                size="iconSm"
                onClick={handleEdit}
              >
                <Pencil className="size-4" />
              </Button>
            </Hint>
          )
        }
        {
          !hideThreadButton && (
            <Hint label="Reply in thread">
              <Button
                variant="ghost"
                size="iconSm"
                onClick={handleThread}
                disabled={hideThreadButton}
              >
                <MessageSquareTextIcon className="size-4" />
              </Button>
            </Hint>
          )
        }
        {
          isAuthor && (
            <Hint label="Delete">
              <Button
                variant="ghost"
                size="iconSm"
                onClick={handleDelete}
              >
                <Trash className="size-4" />
              </Button>
            </Hint>
          )
        }
      </div>
    </div>
  )
}

export default Toolbar