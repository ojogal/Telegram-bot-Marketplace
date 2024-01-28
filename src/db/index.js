import { Client } from "@notionhq/client"
import { extractCoffeeFields } from "../utils/index.js"
import { config } from "dotenv"
config()

export const notion = new Client({ auth: process.env.NOTION_KEY })
const TABLES = {}
let coffeeList = []
let equipmentList = []

// This function retrieves all tables from a page
export const retrieveTables = async () => {
    const blocks = await fetch(`https://api.notion.com/v1/blocks/${process.env.NOTION_DB_ID}/children`, {
        headers: {
            "Notion-Version": "2022-06-28",
            "Authorization": `Bearer ${process.env.NOTION_KEY}`
        }
    }).then(response => response.json())


    for (const block of blocks.results) {
        if (block.type !== 'child_database') continue
        TABLES[block[block.type].title] = block.id
    }
}

export const getCoffeeList = async (refresh = false) => {
    if (refresh) {
        coffeeList = []
        const products = await notion.databases.query({ database_id: TABLES.Coffee })
        for (let i = 0; i < products.results.length; i++) {
            if (products.results[i].properties.Quantity.number > 0) {
                const product = extractCoffeeFields(products.results[i])
                coffeeList.push(product)
            }
        }
        return coffeeList
    }
    return coffeeList
}

export const getEquipmentList = async (refresh = false) => {
    if (refresh) {
        equipmentList = []
        const products = await notion.databases.query({ database_id: TABLES.Equipment })
        for (let i = 0; i < products.results.length; i++) {
            if (products.results[i].properties.Quantity.number > 0) {
                const product = extractCoffeeFields(products.results[i])
                equipmentList.push(product)
            }
        }
        return equipmentList
    }
    return equipmentList
}

setInterval(() => {
    Promise.all([getCoffeeList(true), getEquipmentList(true)]).then(() => console.log("Database content revalidated!"))
}, 5 * 60 * 1000)

export { coffeeList, equipmentList }