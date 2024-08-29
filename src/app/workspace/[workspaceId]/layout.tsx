'use client'

import { type ReactNode } from "react";
import Toolbar from "./toolbar";

const WorkspaceLayout = ({
 children
}: {
 children: ReactNode;
}) => {
  return (
    <div className="h-full">
      <Toolbar />
      {children}
    </div>
  );
}

export default WorkspaceLayout;