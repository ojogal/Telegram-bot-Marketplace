import { Markup } from "telegraf"

export const getLanguage = async (ctx) => {
    const { message_id } = await ctx.reply(ctx.i18n.__("messages.choose_language"), Markup.inlineKeyboard([
        [Markup.button.callback("Русский", "setLanguage ru")],
        [Markup.button.callback("English", "setLanguage en")]
    ]))

    await ctx.session.catalog.currentMessageIds.push(message_id)
}