import { qtyControlKeyboard } from "../presets/index.js"
import { deletePreviousMessages } from "../utils/index.js"
import { sendCartTotal } from "./index.js"

export const sendCartItems = async (ctx) => {

  await deletePreviousMessages(ctx)

  if (ctx.session.catalog.cart.length === 0) {
    ctx.reply(ctx.i18n.__("messages.empty_cart")) 
  } else {
    await Promise.all(ctx.session.catalog.cart.map(({ product: item, quantity, Grind, productType }) => {
      if (productType === "coffee") {
        return ctx.replyWithMarkdown(
          `_${item.Brand}_\n*${item.Title}*\n${item.Process} process\n_${item.Description}_ \n\nSweetness: ${item.Sweetness}\nAcidity: ${item.Acidity}\nBitterness: ${item.Bitterness}\n\n*Price: ${item.Price}MDL\nQuantity: ${quantity}\nGrind for: ${Grind}*`,
          qtyControlKeyboard(ctx, item.ID, productType))
      } else if (productType === "equipment") {
        return ctx.replyWithMarkdown(
          `*${item.Title}*\n_${item.Description}_ \n\n*Price: ${item.Price}MDL\nQuantity: ${quantity}*`,
          qtyControlKeyboard(ctx, item.ID, productType))
      }
    })).then((promises) => {
      try {
        ctx.session.catalog.cartItemsIds = [...promises?.map?.(p => p.message_id)]
        sendCartTotal(ctx) 
      } catch { }
    })
  }
}