'use client'

import { useCreateOrGetConversation } from "@/features/conversations/api/use-create-or-get-conversation"
import { useMemberId } from "@/hooks/useMemberId"
import { useWorkspaceId } from "@/hooks/useWorkspaceId"
import { Loader2, TriangleAlert } from "lucide-react"
import { useEffect, useState } from "react"
import { Id } from "../../../../../../convex/_generated/dataModel"
import { toast } from "sonner"
import Conversation from "./Conversation"

const MemberIdPage = () => {
  const workspaceId = useWorkspaceId()
  const memberId = useMemberId()
  const [conversationId,setConversationId] = useState<Id<'conversations'> | null>(null)

  const {mutate,isPending} = useCreateOrGetConversation()

  useEffect(() => {
    mutate({
      workspaceId,
      memberId
    }, {
      onSuccess: (data) => {
        setConversationId(data)
      },
      onError: () => {
        toast.error('Failed to get conversation')
      }
    })
  }, [memberId,workspaceId,mutate])

  if(isPending) {
    return (
      <div className="h-full flex-1 flex items-center justify-center">
        <Loader2 className="size-10 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if(!conversationId){
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
        <TriangleAlert className="size-10 text-red-700" />
        <h1 className="text-2xl font-bold text-muted-foreground">
          Conversation not found
        </h1>
      </div>
    )
  }
  
  return (
    <Conversation 
      id={conversationId}
    />
  )
}

export default MemberIdPage