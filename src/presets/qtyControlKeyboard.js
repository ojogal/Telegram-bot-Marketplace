import { Markup } from "telegraf" 

export const qtyControlKeyboard = (ctx, id, productType) => {
  if (productType === "coffee") {
    return Markup.inlineKeyboard(
      [
        [Markup.button.callback(ctx.i18n.__("buttons.grind_it"), `selectGrindOption ${id}`)],
        [
          Markup.button.callback(ctx.i18n.__("buttons.remove"), `removeFromCart ${id}`),
          Markup.button.callback(`−`, `updateQuantity ${id} -1`),
          Markup.button.callback(`＋`, `updateQuantity ${id} 1`)
        ]
      ]
    )
  } else if (productType === "equipment") {
    return Markup.inlineKeyboard(
      [
        [
          Markup.button.callback(ctx.i18n.__("buttons.remove"), `removeFromCart ${id}`),
          Markup.button.callback(`−`, `updateQuantity ${id} -1`),
          Markup.button.callback(`＋`, `updateQuantity ${id} 1`)
        ]
      ]
    )
  }
}