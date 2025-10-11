import { TronLinkAdapter, getNetworkInfoByTronWeb } from '@tronweb3/tronwallet-adapter-tronlink';
import { createEIP1193Provider } from '@web3-onboard/common';

export default class TronProvider {
  constructor () {
    // Use TronLinkAdapter as a connector for triggering TronLink popup
    this.connector = new TronLinkAdapter();
  }

  // Safe call wrapper for TronLink extension
  async request (func) {
    if (!this.connector.address) {
      // Force TronLink popup to appear if wallet is not unlocked
      await this.connector.connect();
    }
    return await func();
  }

  getOnboardProvider () {
    const tronProvider = createEIP1193Provider(
      {},
      {
        eth_accounts: ({ params }) => {
          return this.request(() => [this.connector.address]);
        },
        eth_chainId: ({ params }) => {
          return this.getChainId();
        },
        eth_getBalance: async ({ params }) => {
          return await this.request(() =>
            window.tronWeb.trx.getBalance(params[0])
          );
        },
        eth_requestAccounts: ({ params }) => {
          return this.request(() => [this.connector.address]);
        },
        eth_selectAccounts: async ({ params }) => {
          // Consider implementing this method when needed
          return await Promise.resolve(null);
        },
        eth_sendTransaction: async ({ params }) => {
          const { transaction } = await this.request(() =>
            window.tronWeb.trx.sendTransaction(params[0].to, params[0].value)
          );
          return transaction.txID;
        },
        eth_sign: async ({ params }) => {
          // Consider implementing this method when needed
          return await Promise.resolve(null);
        },
        eth_signTransaction: async ({ params }) => {
          // Consider implementing this method when needed
          return await Promise.resolve(null);
        },
        eth_signTypedData: async ({ params }) => {
          // Consider implementing this method when needed
          return await Promise.resolve(null);
        },
        personal_sign: async ({ params }) => {
          // Consider implementing this method when needed
          return await Promise.resolve(null);
        },
        wallet_addEthereumChain: async ({ params }) => {
          // Consider implementing this method when needed
          return await Promise.resolve(null);
        },
        wallet_switchEthereumChain: async ({ params: [{ chainId }] }) => {
          await this.request(() => this.connector.switchChain(chainId))
          return await Promise.resolve(null);
        }
      }
    );

    tronProvider.on = (event, listener) => {
      // Handle events here
    };

    return tronProvider;
  }

  async getChainId () {
    const { chainId } = await getNetworkInfoByTronWeb(window.tronWeb)
    return chainId
  }
}
