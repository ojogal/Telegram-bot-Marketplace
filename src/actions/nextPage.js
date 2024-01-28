import { getCoffeeProducts, getEquipmentProducts } from "./index.js"


export const nextPage = async (ctx) => {
    const [, type] = ctx.match
    if (ctx.session.catalog.currentPage < ctx.session.catalog.totalPages) {
        ctx.session.catalog.currentPage++ 
    }

    if (type === "coffee") {
        await getCoffeeProducts(ctx) 
    } else if (type === "equipment") {
        await getEquipmentProducts(ctx) 
    }
}