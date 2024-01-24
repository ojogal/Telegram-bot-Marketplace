import { coffeeList, equipmentList } from "../db/index.js"

export const addToCart = (ctx) => {
    const [, productId, productType] = ctx.match

    let selectedProduct = null
    
    if (productType === "coffee") {
        selectedProduct = coffeeList.find((product) => product.ID === productId)
    } else if (productType === "equipment") {
        selectedProduct = equipmentList.find((product) => product.ID === productId)
    }

    if (selectedProduct) {
        if (ctx.session.catalog.cart.findIndex(({ product }) => product.ID === selectedProduct.ID) > -1) return ctx.answerCbQuery(`Product ${selectedProduct.Title} is already in the cart`)
        ctx.session.catalog.cart.push({ product: selectedProduct, quantity: 1, Grind: "None(in beans)", productType: productType  })
        ctx.answerCbQuery(`Added ${selectedProduct.Title} to the cart`)
    } else {
        ctx.answerCbQuery("Product not found")
    }
}