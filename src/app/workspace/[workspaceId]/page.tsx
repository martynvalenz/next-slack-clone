'use client'

import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace"
import { useWorkspaceId } from "@/hooks/useWorkspaceId"

const WorkspacePage = () => {
  const workspaceId = useWorkspaceId()
  const {data} = useGetWorkspace({id:workspaceId})
  
  return (
    <div>
      ID {JSON.stringify(data,null,2)}
    </div>
  )
}

export default WorkspacePage