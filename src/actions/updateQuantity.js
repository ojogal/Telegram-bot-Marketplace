import { qtyControlKeyboard } from "../presets/index.js"
import { sendCartTotal } from "./index.js"


export const updateQuantity = async (ctx) => {
  let [, productId, delta] = ctx.match
  delta = parseInt(delta)
  const productIdx = ctx.session.catalog.cart.findIndex(item => item.product.ID === productId)

  const escapeMarkdown = (text) => {
    return text ? `${text}`.replace(/([_*[\]()~`>#+\-=|{}.!])/g, "\\\$1") : ""
  }

  if (productIdx < 0) return ctx.answerCbQuery(`This product is not added to cart`)
  if (ctx.session.catalog.cart[productIdx].quantity + delta < 1) return ctx.answerCbQuery(`You can\'t select less than 1 item`)
  if (ctx.session.catalog.cart[productIdx].quantity + delta > 10) return ctx.answerCbQuery(`You\'ve reached the limit`)
  ctx.session.catalog.cart[productIdx].quantity += delta
  ctx.answerCbQuery(`Quantity updated!`)
  if (ctx.session.catalog.cart[productIdx].productType === "coffee") {
    ctx.editMessageText(
      `
${escapeMarkdown(ctx.session.catalog.cart[productIdx].product.Brand)}
*${escapeMarkdown(ctx.session.catalog.cart[productIdx].product.Title)}*
${escapeMarkdown(ctx.session.catalog.cart[productIdx].product.Process)} process
_${escapeMarkdown(ctx.session.catalog.cart[productIdx].product.Description)}_\n
Price: ${escapeMarkdown(ctx.session.catalog.cart[productIdx].product.Price)}MDL
Quantity: ${escapeMarkdown(ctx.session.catalog.cart[productIdx].quantity)}
Grind for: ${escapeMarkdown(ctx.session.catalog.cart[productIdx].Grind)}
      `, {
        message_id: ctx.callbackQuery.message.message_id,
        chat_id: ctx.callbackQuery.message.chat.id,
        ...qtyControlKeyboard(productId, ctx.session.catalog.cart[productIdx].productType),
        parse_mode: 'MarkdownV2'
      })
    } else if (ctx.session.catalog.cart[productIdx].productType === "equipment") {
      ctx.editMessageText(
        `
*${escapeMarkdown(ctx.session.catalog.cart[productIdx].product.Title)}*
_${escapeMarkdown(ctx.session.catalog.cart[productIdx].product.Description)}_\n
Price: ${escapeMarkdown(ctx.session.catalog.cart[productIdx].product.Price)}MDL
Quantity: ${escapeMarkdown(ctx.session.catalog.cart[productIdx].quantity)}
        `, {
          message_id: ctx.callbackQuery.message.message_id,
          chat_id: ctx.callbackQuery.message.chat.id,
          ...qtyControlKeyboard(productId, ctx.session.catalog.cart[productIdx].productType),
          parse_mode: 'MarkdownV2'
        })
      }
      await sendCartTotal(ctx)
}