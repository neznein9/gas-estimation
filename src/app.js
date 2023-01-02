import fetch from 'node-fetch'
import ethers from 'ethers'

// const GAS_STATION = 'https://api.blocknative.com/gasprices/blockprices'       //  ETHEREUM
// const GAS_STATION = 'https://gasstation-mainnet.matic.network/v2'             //  POLYGON
const GAS_STATION = 'https://gasstation-mumbai.matic.today/v2'                //  MUMBAI TESTNET

//  Sign up for a free API key from https://www.alchemy.com
const ALCHEMY_API_KEY = 'oUyr_vSEz6W9t0FbwdxP0mBpA_5ziquT'

//  Sign up for an API key from https://www.infura.io
// const INFURA_API_KEY = 'cb5bd753c8474afdb37fc8cafb74286c'

const EXTRA_TIP_FOR_MINER = 0 //  gwei

// ≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖
//  Example - fetching and estimating the gas
// ≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖
divider()
await getTransactionPropertiesViaGasStation()

divider()
await getTransactionPropertiesViaAlchemyRPC()

// divider()
// await getTransactionPropertiesViaInfuraRPC()
// ≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖


// ≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖
//  Example - sending a transaction on Mumbai with EIP-1559 gas
// ≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖
const WALLET_PKEY = '0xb5537bcfe058b4943381b9f06e1ef47a516bd0ce2384def482883ef645444ede'
const provider = new ethers.providers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com');
const signingWallet = new ethers.Wallet(WALLET_PKEY, provider)

const MUMBAI_TOKEN_ADDRESS = '0x9d96CA4524D84a4c4528D202ABF2afEf119c8c78'
const ABI = [
    "function name() public view returns (string memory)",
    "function balanceOf(address account) public view returns (uint256)",
    "function mint(address account, uint256 amount) public",
    "function transfer(address to, uint256 amount) public returns (bool)",
]

const tokenContract = new ethers.Contract(MUMBAI_TOKEN_ADDRESS, ABI, signingWallet)
divider()
console.log(`Preparing to mint 5 tokens of: ${await tokenContract.name()} to wallet ${signingWallet.address}`)

let transactionProperties = await getTransactionPropertiesViaGasStation()
// let transactionProperties = await getTransactionPropertiesViaAlchemyRPC()
// let transactionProperties = await getTransactionPropertiesViaInfuraRPC()

let transaction = await tokenContract.mint(signingWallet.address, 5, transactionProperties)

console.log(`Transaction submitted: https://mumbai.polygonscan.com/tx/${transaction.hash}`)

let receipt = await transaction.wait()

console.log(`Mined in block: ${receipt.blockNumber}`)

console.log(`Wallet now has ${await tokenContract.balanceOf(signingWallet.address)} tokens`)
// ≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖


// ≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖
//  Implementation methods
// ≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖≖
async function getTransactionPropertiesViaGasStation() {
    console.log('GETTING EIP-1559 GAS FROM GAS STATION')

    const gasStationResponse = await fetch(GAS_STATION)
    const gasStationObj = JSON.parse(await gasStationResponse.text())

    let block_number = gasStationObj.blockNumber
    let base_fee = parseFloat(gasStationObj.estimatedBaseFee)
    let max_priority_fee = gasStationObj.standard.maxPriorityFee + EXTRA_TIP_FOR_MINER
    let max_fee_per_gas = base_fee + max_priority_fee

    //  In case the network gets (up to 25%) more congested
    max_fee_per_gas += (base_fee * 0.25)

    console.log(`block_number: ${block_number}`)
    console.log(`base_fee: ${base_fee.toFixed(9)} gwei`)
    console.log(`max_priority_fee_per_gas: ${max_priority_fee} gwei`)
    console.log(`max_fee_per_gas: ${max_fee_per_gas} gwei`)

    //  cast gwei numbers to wei BigNumbers for ethers
    const maxFeePerGas = ethers.utils.parseUnits(max_fee_per_gas.toFixed(9), 'gwei')
    const maxPriorityFeePerGas = ethers.utils.parseUnits(max_priority_fee.toFixed(9), 'gwei')

    //  Final object ready to feed into a transaction
    const transactionProperties = {
        maxFeePerGas,
        maxPriorityFeePerGas
    }

    return transactionProperties
}

async function getTransactionPropertiesViaAlchemyRPC() {
    console.log('GETTING EIP-1559 GAS FROM ALCHEMY API')

    const alchemyProvider = new ethers.providers.AlchemyProvider('maticmum', ALCHEMY_API_KEY)
    const block = await alchemyProvider.getBlock('latest')
    let block_number = block.number
    let base_fee = parseFloat(ethers.utils.formatUnits(block.baseFeePerGas, 'gwei'))

    let max_priority_fee_hex = await alchemyProvider.send('eth_maxPriorityFeePerGas', [])
    let max_priority_fee_wei = ethers.BigNumber.from(max_priority_fee_hex).toNumber()
    let max_priority_fee = parseFloat(ethers.utils.formatUnits(max_priority_fee_wei, 'gwei'))
    max_priority_fee += EXTRA_TIP_FOR_MINER

    let max_fee_per_gas = base_fee + max_priority_fee

    //  In case the network gets (up to 25%) more congested
    max_fee_per_gas += (base_fee * 0.25)

    console.log(`block_number: ${block_number}`)
    console.log(`base_fee: ${base_fee.toFixed(9)} gwei`)
    console.log(`max_priority_fee_per_gas: ${max_priority_fee} gwei`)
    console.log(`max_fee_per_gas: ${max_fee_per_gas} gwei`)

    //  cast gwei numbers to wei BigNumbers for ethers
    const maxFeePerGas = ethers.utils.parseUnits(max_fee_per_gas.toFixed(8), 'gwei')
    const maxPriorityFeePerGas = ethers.utils.parseUnits(max_priority_fee.toFixed(8), 'gwei')

    //  Final object ready to feed into a transaction
    const transactionProperties = {
        maxFeePerGas,
        maxPriorityFeePerGas
    }

    return transactionProperties
}

async function getTransactionPropertiesViaInfuraRPC() {
    console.log('GETTING EIP-1559 GAS FROM INFURA API')

    const infuraProvider = new ethers.providers.InfuraProvider('maticmum', INFURA_API_KEY)
    const block = await infuraProvider.getBlock('latest')
    let block_number = block.number
    let base_fee = parseFloat(ethers.utils.formatUnits(block.baseFeePerGas, 'gwei'))

    let max_priority_fee_hex = await infuraProvider.send('eth_maxPriorityFeePerGas', [])
    let max_priority_fee_wei = ethers.BigNumber.from(max_priority_fee_hex).toNumber()
    let max_priority_fee = parseFloat(ethers.utils.formatUnits(max_priority_fee_wei, 'gwei'))
    max_priority_fee += EXTRA_TIP_FOR_MINER

    let max_fee_per_gas = base_fee + max_priority_fee

    //  In case the network gets (up to 25%) more congested
    max_fee_per_gas += (base_fee * 0.25)

    console.log(`block_number: ${block_number}`)
    console.log(`base_fee: ${base_fee.toFixed(9)} gwei`)
    console.log(`max_priority_fee_per_gas: ${max_priority_fee} gwei`)
    console.log(`max_fee_per_gas: ${max_fee_per_gas} gwei`)

    //  cast gwei numbers to wei BigNumbers for ethers
    const maxFeePerGas = ethers.utils.parseUnits(max_fee_per_gas.toFixed(8), 'gwei')
    const maxPriorityFeePerGas = ethers.utils.parseUnits(max_priority_fee.toFixed(8), 'gwei')

    //  Final object ready to feed into a transaction
    const transactionProperties = {
        maxFeePerGas,
        maxPriorityFeePerGas
    }

    return transactionProperties
}

function divider() {
    console.log()
    console.log('≖'.repeat(process.stdout.columns))
}
