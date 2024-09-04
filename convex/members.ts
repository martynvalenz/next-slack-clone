import { getAuthUserId } from "@convex-dev/auth/server";
import { query, QueryCtx } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

const populateUser = (ctx:QueryCtx,userId:Id<'users'>) => {
  return ctx.db.get(userId) 
}

export const get = query({
  args:{
    workspaceId:v.id('workspaces'),
  },
  handler: async(ctx, args) => {
    const userId = await getAuthUserId(ctx)

    if(!userId) return []

    const member = await ctx.db
      .query('members')
      .withIndex('by_user_id_and_workspace_id',(q) => 
        q.eq('userId',userId)
        .eq('workspaceId',args.workspaceId)
      )
      .unique()

    if(!member) return []

    const data = await ctx.db
      .query('members')
      .withIndex('by_workspace_id',(q) => q.eq('workspaceId',args.workspaceId))
      .collect()

    const members = []

    for(const member of data) {
      const user = await populateUser(ctx,member.userId)
      if(user) members.push({...member,user})
    }

    return members
  }
})

export const getById = query({
  args:{
    memberId:v.id('members'),
  },
  handler: async(ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if(!userId) return null

    const member = await ctx.db.get(args.memberId)
    if(!member) return null

    const currentMember = await ctx.db.query('members')
      .withIndex('by_user_id_and_workspace_id',(q) =>
        q.eq('userId',userId)
        .eq('workspaceId',member.workspaceId)
      )
      .unique()
    if(!currentMember) return null

    const user = await populateUser(ctx,member.userId)
    if(!user) return null

    return {...member,user}
  }
})

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