export const deletePreviousMessages = async (ctx) => {
  try {
    if (ctx.session.catalog.currentMessageIds.length > 0) {
      for (const messageId of ctx.session.catalog.currentMessageIds) {
        await ctx.deleteMessage(messageId)
      }
    }
  } catch {
  } finally {
    ctx.session.catalog.currentMessageIds = []
  }
}