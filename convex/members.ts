import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "./_generated/server";
import { v } from "convex/values";

export const current = query({
  args:{workspaceId:v.id('workspaces')},
  handler:async(ctx, args) => {
    const userId = await getAuthUserId(ctx)

    if(!userId) return null

    const member = await ctx.db
      .query('members')
      .withIndex('by_user_id_and_workspace_id',(q) => 
        q.eq('userId',userId)
        .eq('workspaceId',args.workspaceId)
      )
      .unique()

    if(!member) return null

    return member
  }
})