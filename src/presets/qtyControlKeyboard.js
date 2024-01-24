import { Markup } from "telegraf";

export const qtyControlKeyboard = (id, productType) => {
  if (productType === "coffee") {
    return Markup.inlineKeyboard(
      [
        [Markup.button.callback(`Grind it!`, `selectGrindOption ${id}`)],
        [
          Markup.button.callback(`Remove`, `removeFromCart ${id}`),
          Markup.button.callback(`−`, `updateQuantity ${id} -1`),
          Markup.button.callback(`＋`, `updateQuantity ${id} 1`)
        ]
      ]
    )
  } else if (productType === "equipment") {
    return Markup.inlineKeyboard(
      [
        [
          Markup.button.callback(`Remove`, `removeFromCart ${id}`),
          Markup.button.callback(`−`, `updateQuantity ${id} -1`),
          Markup.button.callback(`＋`, `updateQuantity ${id} 1`)
        ]
      ]
    )
  }
}