import { ethers } from 'ethers';
import { BLOCKCHAIN, CHAIN } from '@/constants/assets';

const isEthereumWalletAddress = (address) => {
  return ethers.utils.isAddress(address)
};

export const getNetworkFromWalletAddress = (address) => {
  if (!address) {
    return null;
  }
  return isEthereumWalletAddress(address) ? BLOCKCHAIN.ETHEREUM : BLOCKCHAIN.TRON
};

export const isEnableAssetNetwork = (address, network) => {
  const currentAssetNetwork = network === CHAIN.TRON ? BLOCKCHAIN.TRON : BLOCKCHAIN.ETHEREUM
  return getNetworkFromWalletAddress(address) === currentAssetNetwork
};
