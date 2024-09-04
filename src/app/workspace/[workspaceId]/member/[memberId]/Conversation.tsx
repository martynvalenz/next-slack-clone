import { useMemberId } from "@/hooks/useMemberId"
import { Id } from "../../../../../../convex/_generated/dataModel"
import { useGetMember } from "@/features/members/api/use-get-member"
import { useGetMessages } from "@/features/messages/api/use-get-messages"
import { Loader2 } from "lucide-react"
import Header from "./Header"
import ChatInput from "./ChatInput"
import MessageList from "@/components/MessageList"

interface ConversationProps {
  id:Id<'conversations'>
}

const Conversation = ({id}:ConversationProps) => {
  const memberId = useMemberId()
  const {data:member, isLoading:memberLoading} = useGetMember({memberId})
  const {results, status, loadMore} = useGetMessages({conversationId:id})

  if(memberLoading || status === 'LoadingFirstPage') {
    return (
      <div className="h-full flex-1 flex items-center justify-center">
        <Loader2 className="size-10 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <Header 
        memberName={member?.user.name}
        memberImage={member?.user.image}
        onClick={() => {}}
      />
      <MessageList
        data={results}
        variant="conversation"
        memberImage={member?.user.image}
        memberName={member?.user.name}
        loadMore={loadMore}
        isLoadingMore={status === 'LoadingMore'}
        canLoadMore={status === 'CanLoadMore'}
      />
      <ChatInput
        placeholder="Type a message"
        conversationId={id}
      />
    </div>
  )
}

export default Conversation