export const extractCoffeeFields = (rawProduct) => {
    const extractTextContent = (property) => (property ? property[0]?.text?.content || "" : "")
    const extractNumberContent = (property) => (property ? property.number || "" : "")
    const extractMultiSelectContent = (property) => (property ? property.multi_select?.[0]?.name || "" : "")
    const extractSelectContent = (property) => (property ? property.select?.name || "" : "")
    return {
      ID: rawProduct.id,
      Title: extractTextContent(rawProduct.properties.Title?.title),
      Process: extractTextContent(rawProduct.properties.Process?.rich_text),
      Description: extractTextContent(rawProduct.properties.Description?.rich_text),
      Size: extractTextContent(rawProduct.properties.Size?.rich_text),
      Price: extractNumberContent(rawProduct.properties.Price),
      Brand: extractSelectContent(rawProduct.properties.Brand),
      Image: rawProduct.properties.Image?.files[0]?.file?.url || "",
      Acidity: extractNumberContent(rawProduct.properties.Acidity),
      Sweetness: extractNumberContent(rawProduct.properties.Sweetness),
      Bitterness: extractNumberContent(rawProduct.properties.Bitterness),
      Category: extractMultiSelectContent(rawProduct.properties.Category),
      Quantity: extractNumberContent(rawProduct.properties.Quantity),
    }
  }