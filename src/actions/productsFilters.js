import { Markup } from "telegraf"

export async function productsFilters(ctx) {
    ctx.session.catalog.currentPage = 1
  
    const filterMessage = await ctx.reply("Please choose an option:", Markup.inlineKeyboard([
      Markup.button.callback("Filter", "setProductsCategory Filter coffee"),
      Markup.button.callback("Espresso", "setProductsCategory Espresso coffee")
    ])
    )
    ctx.session.catalog.currentMessageIds.push(filterMessage.message_id)
  }