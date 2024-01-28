import { Markup } from "telegraf"
import { deletePreviousMessages } from "../utils/index.js"

export const setLanguage = async  (ctx) => {
    const [, language] = ctx.match

    ctx.session.language = language
    ctx.i18n.setLocale(ctx.session.language)

    ctx.reply(ctx.i18n.__("messages.language_chosen"),
        Markup.keyboard([
            [Markup.button.callback(ctx.i18n.__("menu.coffee")),
            Markup.button.callback(ctx.i18n.__("menu.equipment"))
            ],
            [Markup.button.callback(ctx.i18n.__("menu.cart"))],
            [Markup.button.callback(ctx.i18n.__("menu.language"))],
        ])
    )

    await deletePreviousMessages(ctx)
}