import { Markup } from "telegraf"

export async function getCoffeeCategory(ctx) {
    ctx.session.catalog.currentPage = 1
  
    const filterMessage = await ctx.reply(ctx.i18n.__("messages.choose_category"), Markup.inlineKeyboard([
      Markup.button.callback(ctx.i18n.__("product.category.filter"), "setProductsCategory Filter coffee"),
      Markup.button.callback(ctx.i18n.__("product.category.espresso"), "setProductsCategory Espresso coffee")
    ])
    )
    ctx.session.catalog.currentMessageIds.push(filterMessage.message_id)
  }