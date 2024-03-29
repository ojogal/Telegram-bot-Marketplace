import { Markup } from "telegraf"

export const orderCancel = (ctx) => {
    ctx.session.checkout = { form: { phone: '', email: '' } }
    ctx.session.common.assertField = null
    ctx.session.common.lastCommand = "cancelCheckout"
    ctx.session.catalog.cartTotalId = null
    ctx.session.catalog.currentPage = 1
    ctx.reply(
        ctx.i18n.__("menu.order_canceled"),
        Markup.keyboard([
            [Markup.button.callback(ctx.i18n.__("menu.coffee")),
            Markup.button.callback(ctx.i18n.__("menu.equipment"))
            ],
            [Markup.button.callback(ctx.i18n.__("menu.cart"))],
            [Markup.button.callback(ctx.i18n.__("menu.language"))],
        ])
    )
}