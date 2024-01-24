import { CONFIG } from "../config.js"
import { coffeeList, getCoffeeList, retrieveTables } from "../db/index.js"
import { deletePreviousMessages } from "../utils/index.js"
import { Markup } from "telegraf"


export const getCoffeeProducts = async (ctx) => {

    await deletePreviousMessages(ctx)
  
    const startIndex = (ctx.session.catalog.currentPage - 1) * CONFIG.productsPerPage
    const endIndex = startIndex + CONFIG.productsPerPage
  
    let filteredCurrentProducts = coffeeList.filter((product) => product.Category === ctx.session.catalog.selectedCategory)
  
    ctx.session.catalog.totalPages = Math.ceil(filteredCurrentProducts.length / CONFIG.productsPerPage);
  
    if (!filteredCurrentProducts[0]) {
      return ctx.reply("There are no available products yet :(")
    }
  
    let currentProducts = filteredCurrentProducts.slice(startIndex, endIndex)
  
    for (let index = 0; index < currentProducts.length; index++) {
      const product = currentProducts[index]
  
      if (product.Image) {
        try {
          // Escape special characters in the Description field
          const escapedDescription = product.Description.replace(/([_*[\]()~`>#+\-=|{}.!])/g, "\\\$1")
  
          const escapedTitle = product.Title.replace(/\./g, "\\.")
  
          const message = await ctx.replyWithPhoto(product.TelegramImage || product.Image,
            {
              caption: `
_${product.Brand}_
*${escapedTitle}*

${product.Process} process
_${escapedDescription}_
${product.Size}  \\\|  ${product.Price}MDL
        `,
              reply_markup: {
                inline_keyboard: [[
                  {
                    text: "Add to cart",
                    callback_data: `addToCart ${product.ID} coffee`
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
          console.log("getCoffeeProducts:", error);
          await retrieveTables()
          await getCoffeeList()
        }
      }
    }
  
    const paginationButtons = [
      Markup.button.callback("Previous", "prevPage coffee"),
      Markup.button.callback("Next", "nextPage coffee"),
    ]
  
    if (ctx.session.catalog.currentPage === 1) {
      paginationButtons.shift()
    }
  
    if (ctx.session.catalog.currentPage === ctx.session.catalog.totalPages) {
      paginationButtons.pop()
    }
    // Add pagination buttons
    const paginationMessage = await ctx.reply(
      `Page ${ctx.session.catalog.currentPage} of ${ctx.session.catalog.totalPages}`,
      Markup.inlineKeyboard(paginationButtons)
    )
    // Save the pagination message ID
    ctx.session.catalog.currentMessageIds.push(paginationMessage.message_id)
  }