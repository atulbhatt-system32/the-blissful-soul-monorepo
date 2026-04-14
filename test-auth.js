require("dotenv").config({ path: "apps/backend/.env" })
const util = require("util")
const exec = util.promisify(require("child_process").exec)

async function test() {
  const result = await fetch("http://localhost:9000/custom/check-account?email=nynisaso@rxzig.com")
  console.log(await result.text())
}
test()
