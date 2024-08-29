import { v } from 'convex/values';
import {mutation, query} from './_generated/server';
import { getAuthUserId } from '@convex-dev/auth/server';

export const get = query({
  args:{},
  handler: async(ctx) => {
    return await ctx.db.query('workspaces').collect();
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

    // TODO: create a proper method later
    const joinCode = '1234'
    const workspaceId = await ctx.db.insert('workspaces', {
      name: args.name,
      // owner: userId,
      // members: [userId],
      userId,
      joinCode
    })

    return workspaceId
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

     return await ctx.db.get(args.id)
  }
})