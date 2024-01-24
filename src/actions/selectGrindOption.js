import { Markup } from "telegraf"

export const selectGrindOption = async (ctx) => {
    try {
        if (ctx.session.catalog.cartTotalId) {
            try {
                await ctx.deleteMessage(ctx.session.catalog.cartTotalId);
            } catch (error) {
                console.error("Error deleting cart total message:", error);
            }
        }

        if (ctx.session.catalog.cartItemsIds.length) {
            for (const id of ctx.session.catalog.cartItemsIds) {
                try {
                    await ctx.deleteMessage(id);
                } catch (error) {
                    console.error(`Error deleting cart item message (ID: ${id}):`, error);
                }
            }
        }
    } catch (error) {
        console.log("setProductsCategory general error:", error);
    }

    let [, productId] = ctx.match
    ctx.reply(
        "Please choose grind option:",
        Markup.inlineKeyboard([
            [
                Markup.button.callback("Filter", `setGrindOption ${productId} Filter`),
                Markup.button.callback("Espresso", `setGrindOption ${productId} Espresso`)
            ],
            [
                Markup.button.callback("Cold brew", `setGrindOption ${productId} Cold Brew`),
                Markup.button.callback("French press", `setGrindOption ${productId} French Press`)
            ],
            [
                Markup.button.callback("Turkish", `setGrindOption ${productId} Turkish`),
                Markup.button.callback("Moka", `setGrindOption ${productId} Moka`)
            ],
            [Markup.button.callback("In beans", `setGrindOption ${productId} In Beans`)]
        ])
    )
}