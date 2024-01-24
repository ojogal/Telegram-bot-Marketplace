import { sendCartTotal } from "./sendCartTotal.js"

export const removeFromCart = async (ctx) => {
    let [, productId] = ctx.match
    const productIdx = ctx.session.catalog.cart.findIndex(item => item.product.ID === productId)
    if (productIdx < 0) return ctx.answerCbQuery(`This product is not added to cart`)
  
    try { ctx.deleteMessage(ctx.callbackQuery.message.message_id) } catch {}
    ctx.session.catalog.cart = ctx.session.catalog.cart.filter((_, i) => i !== productIdx)
    ctx.answerCbQuery(`Product deleted from cart`)
    if (ctx.session.catalog.cart !== 0) sendCartTotal(ctx)
  }