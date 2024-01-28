import { Markup } from "telegraf"

export const selectGrindOption = async (ctx) => {
    try {
        if (ctx.session.catalog.cartTotalId) {
            try {
                await ctx.deleteMessage(ctx.session.catalog.cartTotalId) 
            } catch (error) {
                console.error("Error deleting cart total message:", error) 
            }
        }

        if (ctx.session.catalog.cartItemsIds.length) {
            for (const id of ctx.session.catalog.cartItemsIds) {
                try {
                    await ctx.deleteMessage(id) 
                } catch (error) {
                    console.error(`Error deleting cart item message (ID: ${id}):`, error) 
                }
            }
        }
    } catch (error) {
        console.log("setProductsCategory general error:", error) 
    }

    let [, productId] = ctx.match
    ctx.reply(
        ctx.i18n.__("messages.grind_option"),
        Markup.inlineKeyboard([
            [
                Markup.button.callback(ctx.i18n.__("buttons.grind_options.filter"), `setGrindOption ${productId} Filter`),
                Markup.button.callback(ctx.i18n.__("buttons.grind_options.espresso"), `setGrindOption ${productId} Espresso`)
            ],
            [
                Markup.button.callback(ctx.i18n.__("buttons.grind_options.cold_brew"), `setGrindOption ${productId} Cold Brew`),
                Markup.button.callback(ctx.i18n.__("buttons.grind_options.french_press"), `setGrindOption ${productId} French Press`)
            ],
            [
                Markup.button.callback(ctx.i18n.__("buttons.grind_options.turkish"), `setGrindOption ${productId} Turkish`),
                Markup.button.callback(ctx.i18n.__("buttons.grind_options.moka"), `setGrindOption ${productId} Moka`)
            ],
            [Markup.button.callback(ctx.i18n.__("buttons.grind_options.none"), `setGrindOption ${productId} In Beans`)]
        ])
    )
}