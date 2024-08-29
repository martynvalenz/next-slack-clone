'use client'

import { type ReactNode } from "react";
import Toolbar from "./toolbar";
import Sidebar from "./sidebar";

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
        {children}
      </div>
    </div>
  );
}

export default WorkspaceLayout;