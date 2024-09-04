import { v } from "convex/values"
import { Id } from "./_generated/dataModel"
import { mutation, type QueryCtx } from "./_generated/server"
import { getAuthUserId } from "@convex-dev/auth/server"


const getMember = async (
  ctx:QueryCtx,
  userId:Id<'users'>,
  workspaceId:Id<'workspaces'>
) => {
  return ctx.db
    .query('members')
    .withIndex('by_user_id_and_workspace_id',(q) => 
      q.eq('userId',userId)
      .eq('workspaceId',workspaceId)
    )
    .unique()
}

export const toggle = mutation({
  args:{
    messageId:v.id('messages'),
    value:v.string()
  },
  handler:async (ctx,args) => {
    const userId = await getAuthUserId(ctx)

    if(!userId) throw new Error('Unauthorized')

    const message = await ctx.db.get(args.messageId)

    if(!message) throw new Error('Message not found')

    const member = await getMember(ctx,userId,message.workspaceId)

    if(!member) throw new Error('Member not found')

    const existingMessageReactionFromUser = await ctx.db
      .query('reactions')
      .filter((q) => 
        q.and(
          q.eq(q.field('messageId'),args.messageId),
          q.eq(q.field('memberId'),member._id),
          q.eq(q.field('value'),args.value)
        )
      )
      .first()

    if(existingMessageReactionFromUser){
      await ctx.db.delete(existingMessageReactionFromUser._id)

      return existingMessageReactionFromUser._id
    }
    else{
      const newReactionId = await ctx.db.insert('reactions',{
        messageId:args.messageId,
        memberId:member._id,
        value:args.value,
        workspaceId:message.workspaceId
      })

      return newReactionId
    }
  }
})