'use client'

import { useGetChannel } from "@/features/channels/api/use-get-channel"
import { useChannelId } from "@/hooks/useChannelId"
import { Loader2, TriangleAlert } from "lucide-react"
import Header from "./Header"
import ChatInput from "./ChatInput"
import { useGetMessages } from "@/features/messages/api/use-get-messages"

const WorkspaceChannelPage = () => {
  const channelId = useChannelId()
  const {data:channel,isLoading:channelLoading} = useGetChannel({id:channelId})
  const {results} = useGetMessages({channelId})
  console.log(results)

  if(channelLoading) {
    return (
      <div className="h-full flex-1 flex items-center justify-center">
        <Loader2 className="size-10 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if(!channel){
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
        <TriangleAlert className="size-10 text-error" />
        <h1 className="text-2xl font-bold">
          Workspace not found
        </h1>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <Header title={channel.name} />
      <div className="flex-1">
        {JSON.stringify(results)}
      </div>
      <ChatInput placeholder={`Message # ${channel.name}`} />
    </div>
  )
}

export default WorkspaceChannelPage