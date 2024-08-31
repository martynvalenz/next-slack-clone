import { useCurrentMember } from '@/features/members/api/use-current-meber'
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace'
import { useWorkspaceId } from '@/hooks/useWorkspaceId'
import { AlertTriangle, Loader2 } from 'lucide-react'
import React from 'react'
import WorkspaceSidebarHeader from './WorkspaceSidebarHeader'

const WorkspaceSidebar = () => {
  const workspaceId = useWorkspaceId()
  const {data:member, isLoading:memberLoading} = useCurrentMember({workspaceId})
  const {data:workspace, isLoading:workspaceLoading} = useGetWorkspace({id:workspaceId})

  if(memberLoading || workspaceLoading) return (
    <div className='flex flex-col bg-[#5e2c5f] h-full items-center justify-center'>
      <Loader2 className='size-5 animate-spin text-white'/>
    </div>
  )

  if(!workspace || !member) return (
    <div className='flex flex-col gap-y-2 bg-[#5e2c5f] h-full items-center justify-center'>
      <AlertTriangle className='size-5 text-white'/>
      <p className='text-white text-sm'>Workspace not found</p>
    </div>
  )
  
  return (
    <div className='flex flex-col bg-[#5e2c5f] h-full'>
      <WorkspaceSidebarHeader workspace={workspace} isAdmin={member.role == 'admin'}/>
    </div>
  )
}

export default WorkspaceSidebar