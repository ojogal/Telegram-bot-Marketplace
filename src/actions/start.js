import { Markup } from "telegraf"

export const start = (ctx) => {
    ctx.session.checkout = { form: { phone: '', email: '' } }
    ctx.session.common.assertField = null
    ctx.session.catalog.cartTotalId = null
    ctx.session.catalog.currentPage = 1
    ctx.reply(
        "Welcome to the Kosmonavtika store. Check out our offers, select a product and we will contact you to clarify the details.",
        Markup.keyboard([
            [Markup.button.callback("All coffee"),
            Markup.button.callback("All equipment")
            ],
            [Markup.button.callback("Cart")],
        ])
    )
}