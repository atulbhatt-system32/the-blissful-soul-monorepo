const { default: Medusa } = require("@medusajs/js-sdk")
const sdk = new Medusa({ baseUrl: "http://localhost:9000" })
console.log(sdk.auth.update)
