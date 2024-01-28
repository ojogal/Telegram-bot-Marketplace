import { CONFIG } from "../config.js"


export const finalizeCheckoutForm = async (ctx) => {
  const totalCost = ctx.session.catalog.cart.reduce((acc, item) => ((item.quantity || 0) * item.product.Price) + acc, 0)

  const coffeeItems = ctx.session.catalog.cart.filter(item => item.productType === "coffee")
  const equipmentItems = ctx.session.catalog.cart.filter(item => item.productType === "equipment")

  const coffeeRender = coffeeItems.length > 0
    ? `<b>Your Coffee:</b>\n${coffeeItems.map((item, i) => `<b>${i + 1}. ${item.product.Title}</b>\n    <i>${item.product.Brand}</i>\n    Quantity: ${item.quantity}\n    Grind for: ${item.Grind}\n    Price: ${item.product.Price * item.quantity}MDL`).join('\n')}\n\n`
    : ""

  const equipmentRender = equipmentItems.length > 0
    ? `<b>Your Equipment:</b>\n${equipmentItems.map((item, i) => `<b>${i + 1}. ${item.product.Title}</b>\n    Quantity: ${item.quantity}\n    Price: ${item.product.Price * item.quantity}MDL`).join('\n')}\n\n`
    : ""

  await ctx.reply(
    `${coffeeRender}${equipmentRender}<b>Your details:</b>\n${Object.entries(ctx.session.checkout.form).map(([k, v]) => `<b>${k}:</b> ${v}`).join('\n')}\n\n<b>Total:</b> ${totalCost}MDL`,
    {
      parse_mode: 'HTML',
    }
  )

  ctx.reply(ctx.i18n.__("messages.delivery"), {
    reply_markup: {
      inline_keyboard: [
        [{
          text: ctx.i18n.__("buttons.order.confirm"),
          callback_data: CONFIG.ACTIONS.checkout.confirm
        }],
        [{
          text: ctx.i18n.__("buttons.order.cancel"),
          callback_data: CONFIG.ACTIONS.checkout.cancel
        }]
      ]
    },
  })
}

