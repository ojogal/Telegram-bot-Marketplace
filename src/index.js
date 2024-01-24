import { config } from "dotenv"
config()
import { session } from "telegraf"
import { addToCart, cancelCheckout, 
  checkoutFormStep, enterCheckoutForm, 
  nextPage, orderCancel, 
  orderConfirm, 
  prevPage, productsFilters, 
  removeFromCart, selectGrindOption, 
  sendCartItems, setGrindOption, 
  start, updateQuantity } from "./actions/index.js"
import { getCoffeeList, retrieveTables, getEquipmentList } from "./db/index.js"
import { bot } from "./bot.js"
import { CONFIG } from "./config.js"
import { getEquipmentCategory } from "./actions/getEquipmentCategory.js"
import { setProductsCategory } from "./actions/setProductsCategory.js"


bot.use(session(),
  (ctx, next) => {
    if (!ctx.session) ctx.session = {
      common: {
        lastCommand: null,
        assertField: null,
      },
      checkout: { items: [], form: { phone: '', email: '' } },
      catalog: {
        currentPage: 1,
        totalPages: 0,
        currentMessageIds: [],
        cart: [],
        cartTotalId: null,
        selectedFilter: null,
        selectedCategory: null,
        cartItemsIds: []
      }
    }
    if ((ctx.update.message && ctx.update.message.entities && ctx.update.message.entities.some(e => e.type === 'bot_command')) || ctx.update?.message?.text === 'Cart') {
      ctx.session.common.lastCommand = ctx.update?.message?.text || null
      ctx.session.catalog.cartTotalId = null
    }
    return next()
  },
  (ctx, next) => {
    if ((ctx.session.catalog.cart.length && ctx.session.common.assertField && !ctx.session.checkout.form[ctx.session.common.assertField]) && ctx.update?.callback_query?.data !== 'cancelCheckout') {
      ctx.session.checkout.form[ctx.session.common.assertField] = ctx.update?.message?.text
      return checkoutFormStep(ctx)
    }
    return next()
  }
)

bot.command("start", start)

bot.hears("Cart", sendCartItems)
bot.command("cart", sendCartItems)

bot.hears("All coffee", productsFilters)
bot.command("coffee", productsFilters)

bot.hears("All equipment", getEquipmentCategory)
bot.command("equipment", getEquipmentCategory)

bot.hears('Checkout', enterCheckoutForm)
bot.command('checkout', enterCheckoutForm)

bot.action(/addToCart (.+) (.+)/, addToCart)

bot.action(/setProductsCategory (.+) (.+)/, setProductsCategory)

bot.action(/prevPage (.+)/, prevPage)

bot.action(/nextPage (.+)/, nextPage)

bot.action(/updateQuantity (.+) (.+)/, updateQuantity)

bot.action(/removeFromCart (.+)/, removeFromCart)

bot.action("cancelCheckout", cancelCheckout)

bot.action(`enterCheckoutForm`, enterCheckoutForm)

bot.action(/selectGrindOption (.+)/, selectGrindOption)

bot.action(/setGrindOption (.+?) (.+)/, setGrindOption)

bot.action(CONFIG.LOCALES.order.cancel, orderCancel)

bot.action(CONFIG.LOCALES.order.confirm, orderConfirm)

await Promise.all([
  await retrieveTables(),
  await getEquipmentList(),
  await getCoffeeList(),
]).then(() => bot.launch())

process.on('uncaughtException', (err) => {
  bot.telegram.sendMessage(process.env.GROUP_BOT_ID, `<b>⚠️ Emergency Store bot restart</b>\n<br/><pre>${JSON.stringify(err)}</pre>`, { parse_mode: 'HTML' })
  bot.stop();
  setTimeout(bot.start)
})