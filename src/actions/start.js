import { Markup } from "telegraf"

export const start = (ctx) => {
    ctx.session.checkout = { form: { phone: '', email: '' } }
    ctx.session.common.assertField = null
    ctx.session.catalog.cartTotalId = null
    ctx.session.catalog.currentPage = 1
    ctx.reply(
        ctx.i18n.__("start.intro"),
        Markup.keyboard([
            [Markup.button.callback(ctx.i18n.__("menu.coffee")),
            Markup.button.callback(ctx.i18n.__("menu.equipment"))
            ],
            [Markup.button.callback(ctx.i18n.__("menu.cart"))],
            [Markup.button.callback(ctx.i18n.__("menu.language"))],
        ])
    )
}