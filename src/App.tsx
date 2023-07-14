import { useEffect, useState } from 'react'
import { evmBlockchainFactories, EVMNetwork, REGISTRY_ABI, EVM_CONTRACTS, EthereumBlockchainController, EVM_RPCS } from '@ylide/ethereum'
import { Ylide } from '@ylide/sdk'
import Web3 from 'web3'
import { AbiItem } from 'web3-utils'

import { OwnerList } from './components'

import './App.css'

const maxLogSize = 3000;

function App() {
  const [blockchainController, setBlockchainController] = useState<EthereumBlockchainController>()
  const [currentLogOffset, setCurrentLogOffset] = useState(0)
  const [currentLogLatest, setCurrentLogLatest] = useState(0)
  const [users, setUsers] = useState([]);
  const [web3, setWeb3] = useState<Web3>();

  Ylide.registerBlockchainFactory(evmBlockchainFactories[EVMNetwork.ETHEREUM])

  const loadBlockchainController = async () => {
    const controller = await evmBlockchainFactories[EVMNetwork.ETHEREUM].create() as EthereumBlockchainController;
    setBlockchainController(controller);
    //setWeb3(controller.web3Readers[0].web3);
    setWeb3(new Web3(EVM_RPCS[EVMNetwork.ARBITRUM][0].rpc));
  }

  const getYlideAddresses = async () => {
    if (!blockchainController || !web3) return

    const latestBlock = await web3.eth.getBlockNumber()
    console.log(`latest block: ${latestBlock}`)

    setCurrentLogOffset(latestBlock - maxLogSize)

    const contract = new web3.eth.Contract(REGISTRY_ABI.abi as AbiItem[], EVM_CONTRACTS[EVMNetwork.ARBITRUM].registry.address);
    console.log('contract!', contract)

    // const logs = await web3.eth.getPastLogs({
    //   topics: [web3.utils.sha3('KeyAttached(address indexed addr, uint256 publicKey, uint64 keyVersion)')]
    // })
    const logs = await contract.getPastEvents('KeyAttached', {
      fromBlock: 'earliest', // currentLogOffset,
      toBlock: 'latest', // currentLogLatest ?? undefined,
      // filter: {
      //  addr: '0x15a33D60283e3D20751D6740162D1212c1ad2a2d'
      // }
     });
    console.log('raw logs!', logs)

    const addresses = await Promise.all(logs.map(async ({ address }) => {
      console.log(address)
      const key = await blockchainController.extractPublicKeyFromAddress(address || '')
      return key
    }))
    console.log('Addresses:', addresses)
    // const filtered = logs.filter((log, index) => addresses[index] != null)
    // console.log('Filtered:', filtered)

  }

  useEffect(() => {
    try {
      loadBlockchainController()
    }
    catch(e) {
      console.error(e)
    }
  }, [])

  useEffect(() => {
    getYlideAddresses()
  }, [blockchainController])

  return (
    <OwnerList />
  )
}

export default App
