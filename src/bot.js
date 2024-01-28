import { Telegraf } from "telegraf"
import { I18n } from "i18n"
import path from "path"
import LocalSession from "telegraf-session-local"


export const i18n = new I18n({
    locales: ['en', 'ru'],
    directory: path.resolve("src", "locales"),
    allowMissing: true,
    defaultLanguage: "ru",
    objectNotation: true
  })

  
const bot = new Telegraf(process.env.BOT_TOKEN, { handlerTimeout: Infinity })
  
bot.use((new LocalSession({ database: 'local/session.json' })).middleware())

export { bot }