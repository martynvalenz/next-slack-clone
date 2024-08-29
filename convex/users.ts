import {query} from './_generated/server';
import { getAuthUserId } from "@convex-dev/auth/server";
import { auth } from './auth';

export const current = query({
  args: {},
  handler: async(ctx) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) {
      return null
    }

    return await ctx.db.get(userId)
  }
})