import { CONFIG } from "../config.js"
import { finalizeCheckoutForm } from "./finalizeCheckoutForm.js"


export async function checkoutFormStep(ctx) {
    if (ctx.session.checkout.form.phone === "") { await ctx.reply("Great! We need to collect some information to proceed with your order") }
    const fieldToBeEntered = Object.entries(ctx.session.checkout.form).find(([k, v]) => !v);
  
    const invalidCommandOrStringRegex = /\/(cart|coffee|equipment)|All coffee|All equipment|Cart/;
  
    if (ctx.session.checkout.form.phone === CONFIG.LOCALES.order.cancel ||
      ctx.session.checkout.form.email === CONFIG.LOCALES.order.cancel ||
      invalidCommandOrStringRegex.test(ctx.session.checkout.form.phone) ||
      invalidCommandOrStringRegex.test(ctx.session.checkout.form.email)
    ) {
      ctx.session.checkout = { form: { phone: '', email: '' } }
      ctx.session.common.assertField = null
      ctx.session.catalog.cartTotalId = null
      ctx.session.catalog.currentPage = 1
      return ctx.reply(
        "Checkout progress dismissed",
        Markup.keyboard([
          [Markup.button.callback("All coffee"),
          Markup.button.callback("All equipment")
          ],
          [Markup.button.callback("Cart")],
        ])
      )
    }
  
    if (fieldToBeEntered) {
      ctx.session.common.assertField = fieldToBeEntered[0]
      return ctx.replyWithMarkdown(`*Please type your ${fieldToBeEntered[0]}:*`, {
        reply_markup: {
          inline_keyboard: [[
            {
              text: "or cancel",
              callback_data: `cancelCheckout`
            }
          ]]
        }
      })
    }
    else { return finalizeCheckoutForm(ctx) }
  }