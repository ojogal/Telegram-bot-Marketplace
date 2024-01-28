import { config } from "dotenv"
config()
import {
  addToCart, cancelCheckout,
  checkoutFormStep, enterCheckoutForm,
  nextPage, orderCancel,
  orderConfirm,
  prevPage, getCoffeeCategory,
  removeFromCart, selectGrindOption,
  sendCartItems, setGrindOption,
  start, updateQuantity,
  getLanguage, setLanguage
} from "./actions/index.js"
import { getCoffeeList, retrieveTables, getEquipmentList, coffeeList, equipmentList } from "./db/index.js"
import { bot, i18n } from "./bot.js"
import { CONFIG } from "./config.js"
import { getEquipmentCategory } from "./actions/getEquipmentCategory.js"
import { setProductsCategory } from "./actions/setProductsCategory.js"
import { getRegexByKey } from './utils/getRegexByKey.js'

bot.use(
  (ctx, next) => {
    if (!ctx.session.language) ctx.session.language = ctx.message.from.language_code
    if (!ctx.session.common) ctx.session.common = {
      lastCommand: null,
      assertField: null,
    }
    if (!ctx.session.checkout) ctx.session.checkout = {
      items: [], form: { phone: '', email: '' }
    }
    if (!ctx.session.catalog) ctx.session.catalog = {
      currentPage: 1,
      totalPages: 0,
      currentMessageIds: [],
      cart: [],
      cartTotalId: null,
      cartItemsIds: [],
      selectedCategory: null
    }
    ctx.i18n = i18n
    ctx.i18n.setLocale(ctx.session.language || ctx.message.from.language_code)

    if ((ctx.update.message && ctx.update.message.entities && ctx.update.message.entities.some(e => e.type === 'bot_command')) || ctx.update?.message?.text === 'Cart' || ctx.update?.callback_query?.data?.includes?.('setLanguage')) {
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

bot.hears(getRegexByKey('menu.cart'), sendCartItems)
bot.command("cart", sendCartItems)

bot.hears(getRegexByKey('menu.coffee'), getCoffeeCategory)
bot.command("coffee", getCoffeeCategory)

bot.hears(getRegexByKey('menu.equipment'), getEquipmentCategory)
bot.command("equipment", getEquipmentCategory)

bot.hears('Checkout', enterCheckoutForm)
bot.command('checkout', enterCheckoutForm)

bot.hears(getRegexByKey('menu.language'), getLanguage)
bot.command("language", getLanguage)

bot.action(/addToCart (.+) (.+)/, addToCart)

bot.action(/setLanguage (.+)/, setLanguage)

bot.action(/setProductsCategory (.+) (.+)/, setProductsCategory)

bot.action(/prevPage (.+)/, prevPage)

bot.action(/nextPage (.+)/, nextPage)

bot.action(/updateQuantity (.+) (.+)/, updateQuantity)

bot.action(/removeFromCart (.+)/, removeFromCart)

bot.action("cancelCheckout", cancelCheckout)

bot.action(`enterCheckoutForm`, enterCheckoutForm)

bot.action(/selectGrindOption (.+)/, selectGrindOption)

bot.action(/setGrindOption (.+?) (.+)/, setGrindOption)

bot.action(CONFIG.ACTIONS.checkout.cancel, orderCancel)

bot.action(CONFIG.ACTIONS.checkout.confirm, orderConfirm)

Promise.all([
  await retrieveTables(),
  getEquipmentList(true),
  getCoffeeList(true),
]).then(() => {
  bot.launch();
  console.log(`${new Date().toLocaleString()} – Bot launched`);
})

// process.on('uncaughtException', (err) => {
//   try {
//     console.log(`${new Date().toLocaleString()} – [Attempting to handle]`, err)
//     bot.telegram.sendMessage(process.env.GROUP_BOT_ID, `<b>⚠️ Emergency Store bot restart</b>\n<br/><pre>${JSON.stringify(err)}</pre>`, { parse_mode: 'HTML' })
//     bot.stop()
//     setTimeout(() => bot.launch(), 1000)
//   } catch (error) {
//     console.log(`${new Date().toLocaleString()} –`, error)
//     process.exit(1);
//   }
// })