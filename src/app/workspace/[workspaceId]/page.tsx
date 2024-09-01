'use client'

import { useGetChannels } from "@/features/channels/api/use-get-channels"
import { useCreateChannelModal } from "@/features/channels/store/use-create-channel-modal"
import { useCurrentMember } from "@/features/members/api/use-current-meber"
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace"
import { useWorkspaceId } from "@/hooks/useWorkspaceId"
import { Loader2, TriangleAlert } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useMemo } from "react"

const WorkspacePage = () => {
  const workspaceId = useWorkspaceId()
  const router = useRouter()
  const [open,setOpen] = useCreateChannelModal()
  
  const {data:member, isLoading:memberLoading} = useCurrentMember({workspaceId})
  const {data:workspace, isLoading:workspaceLoading} = useGetWorkspace({id:workspaceId})
  const {data:channels,isLoading:channelsLoading} = useGetChannels({workspaceId})

  const channelId = useMemo(() => channels?.[0]._id,[channels])
  const isAdmin = useMemo(() => member?.role === 'admin',[member])

  useEffect(() => {
    if(workspaceLoading || channelsLoading || memberLoading || !member || !workspace) return

    if(channelId) {
      router.replace(`/workspace/${workspaceId}/channel/${channelId}`)
    }
    else if(!open && isAdmin) {
      setOpen(true)
    }
  },[
    channelId,
    workspace,
    workspaceLoading,
    channelsLoading,
    open,
    router,
    setOpen,
    workspaceId,
    member,
    memberLoading,
    isAdmin
  ])

  if(workspaceLoading || channelsLoading) {
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
        <Loader2 className="size-10 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if(!workspace) {
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
        <TriangleAlert className="size-10 text-error" />
        <h1 className="text-2xl font-bold">
          Workspace not found
        </h1>
      </div>
    )
  }

  <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
    <TriangleAlert className="size-10 text-error" />
    <h1 className="text-2xl font-bold">
      No channel found
    </h1>
  </div>
}

export default WorkspacePage