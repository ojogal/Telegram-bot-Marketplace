import { Markup } from "telegraf"
import { bot } from "../bot.js"
import { sendCartItems } from "./index.js"
import { getItemQuantity, updateItemQuantity } from "../utils/index.js"


export const orderConfirm = async (ctx) => {
    if (ctx.session.catalog.cart.length === 0) {
        return ctx.reply("Your cart is empty")
    }

    if (ctx.session.common.lastCommand === "cancelCheckout") {
        sendCartItems(ctx)
        return
    }

    const processItemQuantity = async (ctx) => {
        const stockItemsQuantities = []

        for (const item of ctx.session.catalog.cart) {

            const currentProductID = item.product.ID

            const stockItemQuantity = await getItemQuantity(currentProductID)

            stockItemsQuantities.push(stockItemQuantity)

            for (const qty of stockItemsQuantities) {
                if ((qty - item.quantity) < 0) {
                    const productIdx = ctx.session.catalog.cart.findIndex(item => item.product.ID === currentProductID)

                    ctx.session.checkout = { form: { phone: '', email: '' } }
                    ctx.session.common.assertField = null
                    ctx.session.catalog.cart = ctx.session.catalog.cart.filter((_, i) => i !== productIdx)
                    ctx.session.catalog.cartTotalId = null
                    ctx.session.catalog.currentPage = 1
                    return ctx.reply(`Unfortunately ${item.product.Title} is out of stock! Order can not be submitted.`)
                }
            }
        }

        for (const item of ctx.session.catalog.cart) {
            await updateItemQuantity(item.product.ID, -item.quantity)
        }
    }

    const precessItems = await processItemQuantity(ctx)

    if (!precessItems) {
        const totalCost = ctx.session.catalog.cart.reduce((acc, item) => ((item.quantity || 0) * item.product.Price) + acc, 0)
        bot.telegram.sendMessage(process.env.GROUP_BOT_ID, `<b>Client details:</b>
client: <a href="tg://user?id=${ctx.callbackQuery.from.id}">${ctx.callbackQuery.from.first_name || ''} ${ctx.callbackQuery.from.last_name || ''}</a>
${Object.entries(ctx.session.checkout.form).map(([k, v]) => `${k}: ${v}`).join('\n')}
  
<b>Client cart:</b>
${ctx.session.catalog.cart.map((item, i) =>
            `${i + 1}. ${item.product.Title}
    Quantity: ${item.quantity}
    Grind for: ${item.Grind}
    Price: ${item.product.Price * item.quantity}MDL`).join('\n')}
  
<b>Total: ${totalCost}MDL</b>`, { parse_mode: 'HTML', })

        ctx.session.checkout = { form: { phone: '', email: '' } }
        ctx.session.common.assertField = null
        ctx.session.catalog.cart = []
        ctx.session.catalog.cartTotalId = null
        ctx.session.catalog.currentPage = 1

        ctx.reply(
            "Order submitted successfully! We will contact you soon.",
            Markup.keyboard([
                [Markup.button.callback("All coffee"),
                Markup.button.callback("All equipment")
                ],
                [Markup.button.callback("Cart")],
            ])
        )
    }
}