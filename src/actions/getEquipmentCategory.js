import { Markup } from "telegraf"


export async function getEquipmentCategory(ctx) {
    ctx.session.catalog.currentPage = 1
    ctx.session.catalog.cartTotalId = null
  
    const message = await ctx.reply(ctx.i18n.__("messages.choose_category"), Markup.inlineKeyboard([
      [Markup.button.callback(ctx.i18n.__("product.category.see_all"), "setProductsCategory all equipment"),
      Markup.button.callback(ctx.i18n.__("product.category.drippers"), "setProductsCategory Drippers equipment")],
      [Markup.button.callback(ctx.i18n.__("product.category.scales"), "setProductsCategory Scales equipment"),
      Markup.button.callback(ctx.i18n.__("product.category.grinders"), "setProductsCategory Grinders equipment")],
      [Markup.button.callback(ctx.i18n.__("product.category.kettles"), "setProductsCategory Kettles equipment"),
      Markup.button.callback(ctx.i18n.__("product.category.servers"), "setProductsCategory Servers equipment")],
      [Markup.button.callback(ctx.i18n.__("product.category.paper_filters"), "setProductsCategory Paper equipment"),
      Markup.button.callback(ctx.i18n.__("product.category.aeropresses"), "setProductsCategory Aeropresses equipment")]
    ])
    )
    ctx.session.catalog.currentMessageIds.push(message.message_id)
  }