import { qtyControlKeyboard } from "../presets/qtyControlKeyboard.js"
import { deletePreviousMessages } from "../utils/deletePreviousMessages.js"
import { sendCartTotal } from "./sendCartTotal.js"

export const sendCartItems = async (ctx) => {

  await deletePreviousMessages(ctx)

  if (ctx.session.catalog.cart.length === 0) {
    ctx.reply("Your cart is empty");
  } else {
    await Promise.all(ctx.session.catalog.cart.map(({ product: item, quantity, Grind, productType }) => {
      if (productType === "coffee") {
        return ctx.replyWithMarkdown(
          `_${item.Brand}_\n*${item.Title}*\n${item.Process} process\n_${item.Description}_ \n\nPrice: ${item.Price}MDL\nQuantity: ${quantity}\nGrind for: ${Grind}`,
          qtyControlKeyboard(item.ID, productType))
      } else if (productType === "equipment") {
        return ctx.replyWithMarkdown(
          `*${item.Title}*\n_${item.Description}_ \n\nPrice: ${item.Price}MDL\nQuantity: ${quantity}`,
          qtyControlKeyboard(item.ID, productType))
      }
    })).then((promises) => {
      try {
        ctx.session.catalog.cartItemsIds = [...promises?.map?.(p => p.message_id)]
        sendCartTotal(ctx);
      } catch { }
    })
  }
}