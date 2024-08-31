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

const WorkspaceLayout = ({
 children
}: {
 children: ReactNode;
}) => {
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
            maxSize={20}
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
        </ResizablePanelGroup>
      </div>
    </div>
  );
}

export default WorkspaceLayout;