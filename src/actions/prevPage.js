import { getCoffeeProducts, getEquipmentProducts } from "./index.js"


export const prevPage = async (ctx) => {
    const [, table] = ctx.match
    if (ctx.session.catalog.currentPage > 1) {
        ctx.session.catalog.currentPage--;
    }
    
    if (table === "coffee") {
        await getCoffeeProducts(ctx) 
    } else if (table === "equipment") {
        await getEquipmentProducts(ctx) 
    }
}