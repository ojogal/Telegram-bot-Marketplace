import { CONFIG } from "../config.js"
import { equipmentList, getEquipmentList, retrieveTables } from "../db/index.js"
import { deletePreviousMessages } from "../utils/index.js"
import { Markup } from "telegraf"


export const getEquipmentProducts = async (ctx) => {

    await deletePreviousMessages(ctx)
  
    const startIndex = (ctx.session.catalog.currentPage - 1) * CONFIG.productsPerPage
    const endIndex = startIndex + CONFIG.productsPerPage
  
    let filteredCurrentProducts = (await getEquipmentList()).filter(ctx.session.catalog.selectedCategory === "all" ? () => true : (product) => product.Category === ctx.session.catalog.selectedCategory)
  
    ctx.session.catalog.totalPages = Math.ceil(filteredCurrentProducts.length / CONFIG.productsPerPage)
  
    if (!filteredCurrentProducts[0]) {
      const noProductsMessage = await ctx.reply(ctx.i18n.__("messages.no_products"))
      ctx.session.catalog.currentMessageIds.push(noProductsMessage.message_id)
      return
    }
  
    let currentProducts = filteredCurrentProducts.slice(startIndex, endIndex)
  
    for (let index = 0;  index < currentProducts.length;  index++) {
      const product = currentProducts[index]
  
      if (product.Image) {
        try {
          // Escape special characters in the Description field
          const escapedDescription = product.Description.replace(/([_*[\]()~`>#+\-=|{}.!])/g, "\\\$1")
  
          const escapedTitle = product.Title.replace(/\./g, "\\.")
  
          const message = await ctx.replyWithPhoto(product.TelegramImage || product.Image,
            {
              caption: `
*${escapedTitle}*

_${escapedDescription}_
*Price: ${product.Price}MDL*
        `,
              reply_markup: {
                inline_keyboard: [[
                  {
                    text: ctx.i18n.__("buttons.add_to_cart"),
                    callback_data: `addToCart ${product.ID} equipment`
                  }
                ]]
              },
              parse_mode: "MarkdownV2"
            }
          )
          currentProducts[index].TelegramImage = message.photo[0].file_id
          // Save the current message ID
          ctx.session.catalog.currentMessageIds.push(message.message_id)
        } catch (error) {
          await retrieveTables()
          await getEquipmentList(true)
        }
      }
    }
  
    const paginationButtons = [
      Markup.button.callback(ctx.i18n.__("buttons.previous"), "prevPage equipment"),
      Markup.button.callback(ctx.i18n.__("buttons.next"), "nextPage equipment"),
    ]
  
    if (ctx.session.catalog.currentPage === 1) {
      paginationButtons.shift()
    }
  
    if (ctx.session.catalog.currentPage === ctx.session.catalog.totalPages) {
      paginationButtons.pop()
    }
    // Add pagination buttons
    const paginationMessage = await ctx.reply(
      `${ctx.i18n.__("messages.page")} ${ctx.session.catalog.currentPage} ${ctx.i18n.__("messages.page_of")} ${ctx.session.catalog.totalPages}`,
      Markup.inlineKeyboard(paginationButtons)
    )
    // Save the pagination message ID
    ctx.session.catalog.currentMessageIds.push(paginationMessage.message_id)
  }