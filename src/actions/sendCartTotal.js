import { Markup } from "telegraf"
import { bot } from "../bot.js"

export const sendCartTotal = async (ctx) => {
  const totalProducts = ctx.session.catalog.cart.reduce((acc, item) => (item.quantity || 0) + acc, 0)
  const totalCost = ctx.session.catalog.cart.reduce((acc, item) => ((item.quantity || 0) * item.product.Price) + acc, 0)
  // const message = totalProducts > 0 ? `${totalProducts} item${totalProducts > 1 ? 's' : ''} | ${totalCost}MDL` : `Cart is empty`
  const message = totalProducts > 0 ? ctx.i18n.__("messages.total_quantity", { quantity: totalProducts }) + ` | ${totalCost}MDL` : `Cart is empty`
  const hasPaperFilters = ctx.session.catalog.cart.some(item => item.product.Category === 'Paper filters')

  let inlineKeyboard = [[Markup.button.callback(ctx.i18n.__("buttons.checkout"), `enterCheckoutForm`)]]

  if (!hasPaperFilters) { inlineKeyboard.unshift([Markup.button.callback(ctx.i18n.__("buttons.paper_filers_offer"), "setProductsCategory Paper equipment")]) }

  try {
    if (ctx.session.catalog.cartTotalId) {
      await bot.telegram.editMessageText(ctx.update?.callback_query?.message?.chat?.id || ctx.update?.message?.chat?.id,
        ctx.session.catalog.cartTotalId,
        undefined,
        message, {
        ...(totalProducts > 0 ? {
          reply_markup: {
            inline_keyboard: inlineKeyboard
          }
        } : {})
      })
    } else {
      const { message_id } = await ctx.reply(message, Markup.inlineKeyboard(inlineKeyboard))
      ctx.session.catalog.cartTotalId = message_id
    }
  } catch (error) {
    if (error.description === 'Bad Request: message to edit not found') {
      const sentMessage = await ctx.reply(message, Markup.inlineKeyboard(inlineKeyboard))
      ctx.session.catalog.cartTotalId = sentMessage.message_id
    } else {
      console.log("sendCartTotal error:", error)
    }
  }
}