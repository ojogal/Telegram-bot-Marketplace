import * as locales from '../locales/index.js'


export function getRegexByKey(path = null) {
    if (!path) return '' 
    const slugs = path.split('.') 
    const results = [] 
    for (const [lang, locale] of Object.entries(locales)) {
        let tempResult = locale.default 
        for (const slug of slugs) {
           tempResult = tempResult[slug]
        }
        if (!results.includes(tempResult)) results.push(tempResult) 
    }
    const regex = new RegExp(`^(${results.join('|')})$`)
    return regex
}