import { ethers } from 'ethers'
import { mapGetters } from 'vuex';
import { CHAIN } from '@/constants/assets';
import { ERC20_ABI } from '~/resources/erc20-abi'
import providerFactoryMixin from '~/mixins/web3-onboard/provider-factory'
export default {
  mixins: [providerFactoryMixin],
  computed: {
    ...mapGetters('resources', ['networkConfigs']),
    vChainChainName () {
      return this.networkConfigs?.VChain?.chainName || CHAIN.VCHAIN
    },
    tronNameNetwork () {
      return this.networkConfigs?.Tron?.chainName || CHAIN.TRON
    }
  },
  methods: {
    async $_balanceAssetMixin_getBalanceAsset ({
      contractAddress,
      walletAddress,
      assetNetwork,
      isNative = false
    }) {
      if (isNative) {
        return this.$_balanceAssetMixin_getNativeBalance({ assetNetwork, walletAddress })
      }

      let assetBalance = { decimal: null, balance: 0 }
      try {
        const provider = this.$_providerFactory_getProvider(assetNetwork)
        switch (assetNetwork) {
          case this.vChainChainName:
            assetBalance.balance = await provider.getBalance(walletAddress);
            break;
          case this.tronNameNetwork: {
            const result = await this.$_balanceAssetMixin_getBalanceTrc20Token({
              provider,
              contractAddress,
              walletAddress
            });
            assetBalance = result;
            break;
          }
          default:
            // Get the balance for the ERC20 token.
            assetBalance = await this.$_balanceAssetMixin_getBalanceErc20Token({
              provider,
              walletAddress,
              contractAddress,
              assetNetwork
            });
            break;
        }
      } catch (error) {
        console.error(error)
        assetBalance = { balance: 0, decimal: null }
      }
      return parseFloat(ethers.utils.formatUnits(assetBalance.balance, assetBalance.decimal))
    },
    async $_balanceAssetMixin_getBalanceErc20Token ({
      provider,
      walletAddress,
      contractAddress,
      assetNetwork
    }) {
      try {
        const contract = new ethers.Contract(contractAddress, ERC20_ABI, provider);
        if (!contract) {
          return { decimal: null, balance: 0 }
        }
        const [decimal, balance] = await Promise.all([
          contract.decimals(),
          contract.balanceOf(walletAddress)
        ]);

        // Return the decimal and balance.
        return { decimal, balance }
      } catch (e) {
        console.error(e)
        return { decimal: null, balance: 0 }
      }
    },
    // All TRC-20 Smart Contract coins on TRON blockchain
    async $_balanceAssetMixin_getBalanceTrc20Token ({
      provider,
      contractAddress,
      walletAddress
    }) {
      try {
        if (!provider) {
          return { balance: 0, decimal: null }
        }
        provider.setAddress(contractAddress);
        const contract = await provider.contract().at(contractAddress);
        if (!contract) {
          return { balance: 0, decimal: null };
        }
        const [balance, decimal] = await Promise.all([
          contract.balanceOf(walletAddress).call(),
          contract.decimals().call()
        ]);

        return { balance, decimal };
      } catch (error) {
        console.log(error);
        console.error(error);
        return { balance: 0, decimal: null };
      }
    },
    async $_balanceAssetMixin_getNativeBalance ({ assetNetwork, walletAddress }) {
      try {
        const provider = this.$_providerFactory_getProvider(assetNetwork);
        const balance = await provider.getBalance(walletAddress);
        const decimals = this.networkConfigs?.[assetNetwork]?.nativeCurrency?.decimals;
        return parseFloat(ethers.utils.formatUnits(balance, decimals))
      } catch (error) {
        console.error(error)
        return { balance: 0, decimal: null }
      }
    }
  }
}
