import { CONFIG } from "../config.js"
import { finalizeCheckoutForm } from "./index.js"


export async function checkoutFormStep(ctx) {
    if (ctx.session.checkout.form.phone === "") { await ctx.reply(ctx.i18n.__("messages.enter_checkout")) }
    const fieldToBeEntered = Object.entries(ctx.session.checkout.form).find(([k, v]) => !v)
  
    const invalidCommandOrStringRegex = /\/(cart|coffee|equipment)|All coffee|All equipment|Cart/
  
    if (
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
      return ctx.replyWithMarkdown(`*${ctx.i18n.__("messages.checkout_details_field")} ${ctx.i18n.__('common.fields.'+fieldToBeEntered[0])}:*`, {
        reply_markup: {
          inline_keyboard: [[
            {
              text: ctx.i18n.__("buttons.cancel"),
              callback_data: `cancelCheckout`
            }
          ]]
        }
      })
    }
    else { return finalizeCheckoutForm(ctx) }
  }