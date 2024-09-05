import { v } from 'convex/values';
import {mutation, query} from './_generated/server';
import { getAuthUserId } from '@convex-dev/auth/server';

const generateCode = () => {
  const code = Array.from(
    {length:6},
    () => '0123456789abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 36)]
  ).join('')

  return code
}

export const get = query({
  args:{},
  handler: async(ctx) => {
    const userId = await getAuthUserId(ctx)
    if(!userId) {
      return []
    }
    const members = await ctx.db
      .query('members')
      .withIndex('by_user_id',(q) => q.eq('userId',userId))
      .collect()
    const workspaceIds = members.map((m) => m.workspaceId)
    const workspaces = []
    for(const workspaceId of workspaceIds) {
      const workspace = await ctx.db.get(workspaceId)
      if(workspace) workspaces.push(workspace)
    }
    return workspaces
  }
})

export const join = mutation({
  args:{
    joinCode:v.string(),
    workspaceId:v.id('workspaces')
  },
  handler: async(ctx, args) => {
    const userId = await getAuthUserId(ctx)

    if(!userId) {
      throw new Error('Unauthorized')
    }

    const workspace = await ctx.db.get(args.workspaceId)

    if(!workspace || workspace.joinCode !== args.joinCode.toLowerCase()) {
      throw new Error('Invalid join code')
    }

    const existingMember = await ctx.db
    .query('members')
    .withIndex('by_user_id_and_workspace_id',(q) => 
      q.eq('userId',userId)
      .eq('workspaceId',args.workspaceId)
    )
    .unique()

    if(existingMember) {
      throw new Error('Already a member')
    }

    await ctx.db.insert('members', {
      userId,
      workspaceId: args.workspaceId,
      role: 'member'
    })

    return workspace._id
  }
})

export const newJoinCode = mutation({
  args:{
    workspaceId:v.id('workspaces'),
  },
  handler: async(ctx, args) => {
    const userId = await getAuthUserId(ctx)

    if(!userId) {
      throw new Error('Unauthorized')
    }

    const member = await ctx.db
      .query('members')
      .withIndex('by_user_id_and_workspace_id',(q) => 
        q.eq('userId',userId)
        .eq('workspaceId',args.workspaceId)
      )
      .unique()

    if(!member || member.role !== 'admin') {
      throw new Error('Unauthorized')
    }

    const joinCode = generateCode()
    await ctx.db.patch(args.workspaceId, {joinCode})

    return args.workspaceId
  }
})

export const create = mutation({
  args:{
    name: v.string()
  },
  handler: async(ctx, args) => {
    const userId = await getAuthUserId(ctx)

    if(!userId) {
      throw new Error('Unauthorized')
    }

    const workspaceId = await ctx.db.insert('workspaces', {
      name: args.name,
      // owner: userId,
      // members: [userId],
      userId,
      joinCode:generateCode()
    })

    await ctx.db.insert('members', {
      userId,
      workspaceId,
      role: 'admin'
    })

    await ctx.db.insert('channels', {
      name: 'general',
      workspaceId
    })

    return workspaceId
  }
})

export const getInfoById = query({
  args:{
    id:v.id('workspaces')
  },
  handler: async(ctx, args) => {
    const userId = await getAuthUserId(ctx)

    if(!userId) {
      throw new Error('Unauthorized')
    }

    const member = await ctx.db
      .query('members')
      .withIndex('by_user_id_and_workspace_id',(q) => 
        q.eq('userId',userId)
        .eq('workspaceId',args.id)
      )
      .unique()

    const workspace = await ctx.db.get(args.id)

    if(!workspace) return null

    return {
      name: workspace.name,
      isMember: !!member,
    }
  }
})

export const getById = query({
  args:{
    id:v.id('workspaces')
  },
  handler: async(ctx, args) => {
    const userId = await getAuthUserId(ctx)

    if(!userId) {
      throw new Error('Unauthorized')
    }

    const member = await ctx.db
      .query('members')
      .withIndex('by_user_id_and_workspace_id',(q) => 
        q.eq('userId',userId)
        .eq('workspaceId',args.id)
      )
      .unique()

    if(!member) return null

    return await ctx.db.get(args.id)
  }
})

export const update = mutation({
  args:{
    id:v.id('workspaces'),
    name:v.string()
  },
  handler: async(ctx, args) => {
    const userId = await getAuthUserId(ctx)

    if(!userId) {
      throw new Error('Unauthorized')
    }

    const member = await ctx.db
      .query('members')
      .withIndex('by_user_id_and_workspace_id',(q) => 
        q.eq('userId',userId)
        .eq('workspaceId',args.id)
      )
      .unique()

    if(!member || member.role !== 'admin') {
      throw new Error('Unauthorized')
    }

    await ctx.db.patch(args.id, {
      name: args.name
    })

    return args.id
  }
})

export const remove = mutation({
  args:{
    id:v.id('workspaces'),
  },
  handler: async(ctx, args) => {
    const userId = await getAuthUserId(ctx)

    if(!userId) {
      throw new Error('Unauthorized')
    }

    const member = await ctx.db
      .query('members')
      .withIndex('by_user_id_and_workspace_id',(q) => 
        q.eq('userId',userId)
        .eq('workspaceId',args.id)
      )
      .unique()

    if(!member || member.role !== 'admin') {
      throw new Error('Unauthorized')
    }

    const [members,channels,conversations,messages,reactions] = await Promise.all([
      ctx.db.query('members')
        .withIndex('by_workspace_id',(q) => q.eq('workspaceId',args.id))
        .collect(),
      ctx.db.query('channels')
        .withIndex('by_workspace_id',(q) => q.eq('workspaceId',args.id))
        .collect(),
      ctx.db.query('conversations')
        .withIndex('by_workspace_id',(q) => q.eq('workspaceId',args.id))
        .collect(),
      ctx.db.query('messages')
        .withIndex('by_workspace_id',(q) => q.eq('workspaceId',args.id))
        .collect(),
      ctx.db.query('reactions')
        .withIndex('by_workspace_id',(q) => q.eq('workspaceId',args.id))
        .collect()
    ])

    for(const member of members) {
      await ctx.db.delete(member._id)
    }

    for(const channel of channels) {
      await ctx.db.delete(channel._id)
    }

    for(const conversation of conversations) {
      await ctx.db.delete(conversation._id)
    }

    for(const message of messages) {
      await ctx.db.delete(message._id)
    }

    for(const reaction of reactions) {
      await ctx.db.delete(reaction._id)
    }

    await ctx.db.delete(args.id)

    return args.id
  }
})