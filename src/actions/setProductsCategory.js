import { deletePreviousMessages } from "../utils/index.js"
import { getCoffeeProducts, getEquipmentProducts } from "./index.js"

export const setProductsCategory = async (ctx) => {
    ctx.session.catalog.currentPage = 1

    await deletePreviousMessages(ctx)

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
                    await ctx.deleteMessage(id);
                } catch (error) {
                    console.error(`Error deleting cart item message (ID: ${id}):`, error)
                }
            }
        }
    } catch (error) {
        console.log("setProductsCategory general error:", error)
    }

    let [, category, type] = ctx.match

    if (category === "Paper") category = "Paper filters"

    ctx.session.catalog.selectedCategory = category

    if (type === "coffee") {
        await getCoffeeProducts(ctx)
    } else if (type === "equipment") {
        await getEquipmentProducts(ctx)
    }
}