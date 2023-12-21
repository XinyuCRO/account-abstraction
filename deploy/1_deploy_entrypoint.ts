import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'
import { ethers } from 'hardhat'

const deployEntryPoint: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const provider = ethers.provider

  let EntryPointFactory = await ethers.getContractFactory('EntryPoint');
  EntryPointFactory = EntryPointFactory.connect(provider.getSigner())

  let nonce = await provider.getSigner().getTransactionCount();
  console.log('==nonce=', nonce);


  const tx = await EntryPointFactory.deploy({
    gasLimit: 6e6,
    nonce,
  })

  let entryPointAddress = tx.address;

  // deploy SimpleAccountFactory
  let SimpleAccountFactory = await ethers.getContractFactory('SimpleAccountFactory');
  SimpleAccountFactory = SimpleAccountFactory.connect(provider.getSigner())
  const tx2 = await SimpleAccountFactory.deploy(entryPointAddress, {
    gasLimit: 6e6,
    nonce: nonce + 1,
  })

  console.log(`
ENTRY_POINTS=${entryPointAddress}
ACCOUNT_FACTORY=${tx2.address}
  `)
}

export default deployEntryPoint