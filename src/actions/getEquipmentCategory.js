import { Markup } from "telegraf"


export async function getEquipmentCategory(ctx) {
    ctx.session.catalog.currentPage = 1
    ctx.session.catalog.cartTotalId = null
  
    const message = await ctx.reply("Please choose an option:", Markup.inlineKeyboard([
      [Markup.button.callback("See all", "setProductsCategory all equipment"),
      Markup.button.callback("Drippers", "setProductsCategory Drippers equipment")],
      [Markup.button.callback("Scales", "setProductsCategory Scales equipment"),
      Markup.button.callback("Grinders", "setProductsCategory Grinders equipment")],
      [Markup.button.callback("Kettles", "setProductsCategory Kettles equipment"),
      Markup.button.callback("Servers", "setProductsCategory Servers equipment")],
      [Markup.button.callback("Paper filters", "setProductsCategory Paper equipment"),
      Markup.button.callback("Aeropresses", "setProductsCategory Aeropresses equipment")]
    ])
    )
    ctx.session.catalog.currentMessageIds.push(message.message_id)
  }