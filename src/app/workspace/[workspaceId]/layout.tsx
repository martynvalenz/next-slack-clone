'use client'

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

import { type ReactNode } from "react";
import Toolbar from "./toolbar";
import Sidebar from "./sidebar";
import WorkspaceSidebar from "./workspace-sidebar";
import { usePanel } from "@/hooks/use-pane";
import { Loader2 } from "lucide-react";
import { Id } from "../../../../convex/_generated/dataModel";
import Thread from "@/features/messages/components/Thread";
import Profile from "@/features/members/components/Profile";

const WorkspaceLayout = ({
 children
}: {
 children: ReactNode;
}) => {
  const {
    parentMessageId,
    onClose,
    profileMemberId,
  } = usePanel()

  const showPanel = !!parentMessageId || !!profileMemberId

  return (
    <div className="h-full">
      <Toolbar />
      <div className="flex h-[calc(100vh-2.5rem)]">
        <Sidebar />
        <ResizablePanelGroup 
          direction="horizontal"
          autoSaveId="workspace-layout"
        >
          <ResizablePanel 
            defaultSize={20}
            minSize={11}
            className="bg-[#5e2e5f]"
          >
            <WorkspaceSidebar />
          </ResizablePanel>
          <ResizableHandle withHandle/>
          <ResizablePanel 
            minSize={20}
            defaultSize={80}
          >
            {children}
          </ResizablePanel>
          {
            showPanel && (
              <>
                <ResizableHandle withHandle />
                <ResizablePanel 
                  defaultSize={29}
                  minSize={20}
                  maxSize={40}
                >
                  {
                    parentMessageId ? (
                      <Thread 
                        messageId={parentMessageId as Id<"messages">}
                        onClose={onClose}
                      />
                    ) : profileMemberId ? (
                      <Profile
                        memberId={profileMemberId as Id<"members">}
                        onClose={onClose}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Loader2 className="size-5 animate-spin text-muted-foreground" />
                      </div>
                    )
                  }
                </ResizablePanel>
              </>
            )
          }
        </ResizablePanelGroup>
      </div>
    </div>
  );
}

export default WorkspaceLayout;