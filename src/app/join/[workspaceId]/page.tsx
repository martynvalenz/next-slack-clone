'use client'

import { Button } from "@/components/ui/button"
import { useGetWorkspaceInfo } from "@/features/workspaces/api/use-get-workspace-info"
import { useJoin } from "@/features/workspaces/api/use-join"
import { useWorkspaceId } from "@/hooks/useWorkspaceId"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useMemo } from "react"
import VerificationInput from 'react-verification-input'
import { toast } from "sonner"

const JoinWorskpacePage = () => {
  const router = useRouter()
  const workspaceId = useWorkspaceId()
  const {data,isLoading} = useGetWorkspaceInfo({id:workspaceId})
  const {mutate, isPending} = useJoin()

  const isMember = useMemo(() => data?.isMember, [data?.isMember])
  useEffect(() => {
    if(isMember){
      router.replace(`/workspace/${workspaceId}`)
    }
  }, [isMember,router,workspaceId])

  const handleComplete = (value:string) => {
    mutate({workspaceId,joinCode:value},{
      onSuccess:(id) => {
        toast.success('Successfully joined workspace')
        router.replace(`/workspace/${id}`)
      },
      onError:() => {
        toast.error('Invalid join code')
      }
    })
  }

  if(isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="size-10 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col gap-y-8 items-center justify-center bg-white p-8 rounded-lg shadow-md">
      <Image
        src="/logo.png"
        alt="Logo"
        width={60}
        height={60}
      />
      <div className="flex flex-col gap-y-4 items-center justify-center max-w-md">
        <div className="flex flex-col gap-y-2 items-center justify-center">
          <h1 className="text-2xl font-bold"> 
            Join {data?.name || 'workspace'}
          </h1>
          <p className="text-md text-muted-foreground">
            Enter the workspace code to join
          </p>
        </div>
        <VerificationInput
          onComplete={handleComplete}
          classNames={{ 
            container: cn('flex gap-x-2', isPending && 'opacity-50 cursor-not-allowed'),
            character: 'uppercase h-auto rounded-md border border-gray-300 flex items-center justify-center text-lg font-medium text-gray-500',
            characterInactive:'bg-muted',
            characterSelected:'bg-white text-black',
            characterFilled:'bg-white text-black',
          }}
          length={6}
          autoFocus
        />
      </div>
      <div className="flex gap-x-4">
        <Button
          asChild
          size="lg"
          variant="outline"
        >
          <Link href="/">
            Back to home
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default JoinWorskpacePage