import { notion } from "../db/index.js"


export const updateItemQuantity = async (id, delta) => {
    const page = await notion.pages.retrieve({ page_id: id })

    if (page.properties.Quantity.number < 1) return

    return notion.pages.update({
        page_id: id,
        properties: {
            Quantity: {
                number: page.properties.Quantity.number + delta,
            }
        }
    })
}


export const getItemQuantity = async (id) => {
   const page = await notion.pages.retrieve({ page_id: id })
   return page.properties.Quantity.number
}