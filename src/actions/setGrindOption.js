import { sendCartItems } from "./sendCartItems.js"

export const setGrindOption = async (ctx) => {
    if (ctx.update.callback_query.message.message_id) ctx.deleteMessage(ctx.update.callback_query.message.message_id)

    let [, productId, newgrindOption] = ctx.match
    const productSelectedForGrind = ctx.session.catalog.cart.find((item) => item.product.ID === productId)
    productSelectedForGrind.Grind = newgrindOption
    sendCartItems(ctx)
}