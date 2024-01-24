import { Markup } from "telegraf"

export const cancelCheckout = async (ctx) => {
    ctx.session.checkout = { form: { phone: '', email: '' } }
    ctx.session.common.assertField = null
    ctx.session.common.lastCommand = "cancelCheckout"
    ctx.session.catalog.cartTotalId = null
    ctx.session.catalog.currentPage = 1
    ctx.reply(
        "Checkout progress dismissed",
        Markup.keyboard([
            [Markup.button.callback("All coffee"),
            Markup.button.callback("All equipment")
            ],
            [Markup.button.callback("Cart")],
        ])
    )
}