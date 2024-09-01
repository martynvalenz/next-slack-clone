'use client'

import { useGetChannel } from "@/features/channels/api/use-get-channel"
import { useChannelId } from "@/hooks/useChannelId"
import { Loader2, TriangleAlert } from "lucide-react"

const WorkspaceChannelPage = () => {
  const channelId = useChannelId()
  const {data:channel,isLoading:channelLoading} = useGetChannel({id:channelId})

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
      {/* <Header channelName-={channel.name} /> */}
    </div>
  )
}

export default WorkspaceChannelPage