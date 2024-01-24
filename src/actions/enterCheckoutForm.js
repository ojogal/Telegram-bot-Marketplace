import { checkoutFormStep } from "./checkoutFormStep.js"


export const enterCheckoutForm = async (ctx) => {
  if (!ctx.session.catalog.cart[0]) {
    return ctx.reply("There are no products in the cart")
  }
  checkoutFormStep(ctx)
}