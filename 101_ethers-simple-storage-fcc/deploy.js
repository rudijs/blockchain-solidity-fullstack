const ethers = require("ethers")
const fs = require("fs-extra")
require("dotenv").config()

// const requiredEnvironmanetVars = ["RPC_URL", "PRIVATE_KEY"]

// requiredEnvironmanetVars.forEach((item) => {
//   if (!process.env[item]) {
//     throw new Error(`Required environment variable missing: ${item}`)
//   }
// })

async function main() {
  // First, compile this!
  // And make sure to have your ganache network up!
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL)
  //   let provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL)
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider)

  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf-8")

  const binary = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.bin", "utf-8")

  // ethers deploy

  const contractFactory = new ethers.ContractFactory(abi, binary, wallet)

  console.log("==> Deploying, please wait...")

  const contract = await contractFactory.deploy()

  // console.log("contract :>> ", contract)

  await contract.deployTransaction.wait(1)

  // Contract Interactions

  // Get Number

  const currentFavoriteNumber = await contract.retrieve()
  console.log("currentFavoriteNumber :>> ", currentFavoriteNumber.toString())

  // Update Number
  const transactionResponse = await contract.store("7")
  await transactionResponse.wait(1)

  // Get Number
  const updatedFavoriteNumber = await contract.retrieve()
  console.log("updateFavoriteNumber :>> ", updatedFavoriteNumber.toString())
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
