import { mapActions, mapGetters, mapState } from 'vuex'
import { ethers, BigNumber } from 'ethers'
import { SUBMIT_CRYPTO_TRANSACTION } from '@/api/merchant-order.js'
import { ORDER_TYPE } from '@/resources/order-type.js'
import { ERC20_ABI } from '@/resources/erc20-abi'
import { RESPONSE_ICON } from '@/resources/message.js'
import { MODAL } from '@/resources/modal.js';
import { ORDER_STATUS, SENDING_CRYPTO_STATUS } from '@/config/constant';
import { NETWORK_CONFIGS } from '@/resources/wallet';
import modalMixin from '~/mixins/modal'
import web3OnboardMixin from '~/mixins/web3-onboard'

export const ERROR_TYPES = {
  INCORRECT_CHAIN: 'INCORRECT_CHAIN',
  INCORRECT_FROM_ADDRESS: 'INCORRECT_FROM_ADDRESS',
  INSUFFICIENT_FUNDS: 'INSUFFICIENT_FUNDS'
}

export default {
  data () {
    return {
      qrCode: '',
      transactionInterval: null,
      enableSubmit: false,
      provider: null
    }
  },
  mixins: [modalMixin, web3OnboardMixin],
  computed: {
    ...mapState('user', ['user']),
    ...mapState('resources', ['assets', 'allAssets']),
    ...mapGetters('resources', ['networkConfigs']),
    tronNetworkDecimal () {
      return this.networkConfigs?.Tron?.nativeCurrency?.decimals || NETWORK_CONFIGS.Tron.nativeCurrency.decimals
    }
  },
  beforeDestroy () {
    clearInterval(this.transactionInterval);
  },
  methods: {
    ...mapActions('send-crypto', ['setConfirm', 'setResult', 'reset']),
    ...mapActions('end-user', ['submitCryptoTransaction', 'fetchDataBuyInfo']),
    ...mapActions('modal-response', ['showResponseModal']),
    async submitTransaction (hash, orderDetail) {
      try {
        if (orderDetail.postType === ORDER_TYPE.SELL) {
          this.reset()
          const res = await this.$axios.$post(SUBMIT_CRYPTO_TRANSACTION, {
            orderId: orderDetail.id,
            hash
          })
          this.setResult({
            status: res.data.status,
            hash: res.data.hash,
            network: orderDetail.assetNetwork,
            orderId: orderDetail.orderId
          })
        } else {
          await this.submitCryptoTransaction({
            orderId: orderDetail.id,
            hash
          })
        }
      } catch (error) {
        console.error('Fail to submit tx', error)
      }
    },
    async checkChainId (provider, network) {
      try {
        const chainIdHex = await provider.request({ method: 'eth_chainId' })
        const configChainIdHex = ethers.utils.hexValue(Number(this.networkConfigs?.[network]?.chainId));
        if (chainIdHex !== configChainIdHex) {
          if (this.$device.isDesktop) {
            this.$_modalMixin_closeExceptModal(MODAL.MESSAGE)
            this.showResponseModal({
              title: '',
              content: this.$t('modal.message.invalid_network'),
              description: this.$t('modal.message.CHOOSE_NETWORK_AGAIN'),
              icon: RESPONSE_ICON.SWITCH_NETWORK,
              show: true
            })
          }

          await Promise.all([
            new Promise((resolve, reject) =>
              provider.on('chainChanged', (nextChainId) => {
                if (nextChainId === configChainIdHex) {
                  resolve(nextChainId);
                }
              })
            ),
            provider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: configChainIdHex }] })
          ])
        }
      } catch (switchError) {
        if (switchError.code === 4902) {
          await this.addNetworkMetaMask(provider, this.networkConfigs[network])
        } else {
          throw switchError
        }
      }
    },
    async addNetworkMetaMask (provider, networkConfig) {
      try {
        const { chainId, rpc, chainName, explorerUrls, nativeCurrency } = networkConfig
        await provider.send('wallet_addEthereumChain', [
          {
            chainId: ethers.utils.hexValue(Number(chainId)),
            rpcUrls: rpc,
            chainName,
            blockExplorerUrls: explorerUrls,
            nativeCurrency
          }
        ]);
      } catch (error) {
        console.error('Add network fail', error)
        throw error
      }
    },
    async sendErc20Token (signer, contractAddress, toAddress, amount) {
      const contract = new ethers.Contract(contractAddress, ERC20_ABI, signer);
      const decimals = await contract.decimals();
      const value = ethers.utils.parseUnits(amount.toString(), decimals);
      const connection = await contract.connect(signer);
      return await connection.transfer(toAddress, value);
    },
    async sendTrc20Token (provider, contractAddress, toAddress, amount) {
      const [account] = await provider.send('eth_accounts');
      const { abi } = await window.tronWeb.trx.getContract(contractAddress);

      const contract = window.tronWeb.contract(abi.entrys, contractAddress);

      const decimals = await contract.methods.decimals().call();

      const transferAmount = ethers.utils.parseUnits(
        amount.toString(),
        decimals
      );

      const currentBalance = await contract.methods.balanceOf(account).call();

      if (currentBalance.lt(transferAmount)) {
        throw new Error(ERROR_TYPES.INSUFFICIENT_FUNDS);
      }

      const txId = await contract.methods
        .transfer(
          toAddress,
          ethers.utils.parseUnits(amount.toString(), decimals)
        )
        .send();
      return txId;
    },
    async sendEvmNativeToken (signer, provider, toAddress, amount, decimals) {
      const transferAmount = ethers.utils.parseUnits(
        amount.toString(),
        decimals
      );

      const transactionParameters = {
        to: toAddress,
        value: transferAmount
      };

      const fromAddress = await signer.getAddress();

      const balance = await provider.getBalance(fromAddress)

      if (BigNumber.from(balance).lt(transferAmount)) {
        throw new Error(ERROR_TYPES.INSUFFICIENT_FUNDS);
      }

      return await signer.sendTransaction(transactionParameters);
    },
    async sendTrcNativeToken (provider, fromAddress, toAddress, amount) {
      const transferAmount = ethers.utils.parseUnits(
        amount.toString(),
        this.tronNetworkDecimal
      );
      const transactionParameters = {
        to: toAddress,
        value: transferAmount
      };
      const balance = await provider.send('eth_getBalance', [
        fromAddress
      ]);
      const currentBalance = ethers.utils.parseUnits(balance.toString(), this.tronNetworkDecimal);
      if (currentBalance.lt(transferAmount)) {
        throw new Error(ERROR_TYPES.INSUFFICIENT_FUNDS);
      }
      return await provider.send('eth_sendTransaction', [transactionParameters])
    },
    async transferCrypto (order, endUserConfirmedPaid = false) {
      this.enableSubmit = true
      let isSuccess = true
      this.setConfirm({
        status: SENDING_CRYPTO_STATUS.PROCESSING,
        amount: order.amount,
        asset: order.assetName,
        orderId: order.id || order.orderRefId
      })
      const wallets = this.stateWallet
      if (wallets && wallets.length) {
        let provider;
        try {
          await this.checkChainId(wallets[0].provider, order.assetNetwork)
          provider = new ethers.providers.Web3Provider(
            wallets[0].provider,
            'any'
          )
        } catch (error) {
          if (error.code === 4001) {
            this.$bvModal.hide(MODAL.MESSAGE)
          }
          console.error('Provider not support to check and switch network ', error)
          return
        }

        try {
          const currentProviderNetwork = await provider.getNetwork()
          if (ethers.utils.hexValue(Number(currentProviderNetwork.chainId)) !== ethers.utils.hexValue(Number(this.networkConfigs?.[order.assetNetwork]?.chainId))) {
            throw new Error(ERROR_TYPES.INCORRECT_CHAIN)
          }
          let hash = null
          const isTron = order.assetNetwork === this.networkConfigs?.Tron?.chainName
          const fromAddress = this.user.walletAddress;
          const toAddress = order.type === ORDER_TYPE.BUY ? order.user.walletAddress : order.merchant.walletAddress

          if (
            wallets[0].accounts[0].address?.toLowerCase() !==
            fromAddress?.toLowerCase()
          ) {
            throw new Error(ERROR_TYPES.INCORRECT_FROM_ADDRESS);
          }

          if (order.status === ORDER_STATUS.PAID || endUserConfirmedPaid) {
            this.$_modalMixin_closeAllModal()
            this.$nextTick(() => {
              this.$bvModal.show(MODAL.SEND_CRYPTO_CONFIRMATION)
            })
          }

          if (
            (isTron && order.assetNetwork === this.networkConfigs?.Tron?.chainName && order.assetName === 'TRX') ||
            (order.assetNetwork === this.networkConfigs?.KDONG?.chainName && order.assetName === this.networkConfigs?.KDONG?.nativeCurrency?.symbol)
          ) {
            if (isTron) {
              hash = await this.sendTrcNativeToken(
                provider,
                wallets[0].accounts[0].address,
                toAddress,
                order.amount
              )
            } else {
              const txResult = await this.sendEvmNativeToken(
                provider.getSigner(),
                provider,
                toAddress,
                order.amount,
                this.networkConfigs?.[order.assetNetwork]?.nativeCurrency?.decimals
              )
              hash = txResult.hash
            }
          } else {
            // Process transfer erc20 token or trc20 token
            const asset = this.allAssets.find(
              e => e.network === order.assetNetwork && e.name === order.assetName
            );

            if (isTron) {
              hash = await this.sendTrc20Token(
                provider,
                asset.contract,
                toAddress,
                order.amount
              );
            } else {
              const signer = provider.getSigner();
              const tx = await this.sendErc20Token(
                signer,
                asset.contract,
                toAddress,
                order.amount
              );
              hash = tx.hash;
            }
          }
          if (hash && this.enableSubmit) {
            this.$_modalMixin_closeAllModal()
            await this.submitTransaction(hash, order)
          }
          return true
        } catch (error) {
          console.error(error)
          isSuccess = false
          if (
            [4001, -32603, 'ACTION_REJECTED', 200001].includes(error.code) ||
            // TronLink error when user reject confirmation on desktop
            error === 'Confirmation declined by user' ||
            // TronLink error when user cancel confirmation on IOS
            error === 'cancel' ||
            // TronLink error when user cancel confirmation on Android (Spelling mistake)
            error === 'cancle'
          ) {
            this.setConfirm({
              status: 'failed',
              amount: 0,
              asset: '',
              orderId: ''
            })
            this.statusSendCrypto = 'failed'
          } else {
            if (this.isNotEnoughBalanceError(error)) {
              this.showResponseModal({
                title: '',
                content: this.$t('modal.message.not_enough_balance'),
                description: this.$t('modal.message.RECHECK_BALANCE_WALLET'),
                icon: RESPONSE_ICON.CONNECT_ERROR_WALLET,
                show: true
              })
              return
            }
            if (error.message?.includes(ERROR_TYPES.INCORRECT_CHAIN)) {
              this.$_modalMixin_closeExceptModal(MODAL.MESSAGE)
              this.showResponseModal({
                title: '',
                content: this.$t('modal.message.invalid_network'),
                description: this.$t('modal.message.CHOOSE_NETWORK_AGAIN'),
                icon: RESPONSE_ICON.SWITCH_NETWORK,
                show: true
              })
              return
            }
            if (error.message?.includes(ERROR_TYPES.INCORRECT_FROM_ADDRESS)) {
              this.showResponseModal({
                title: '',
                content: this.$t('modal.message.incorrect_from_wallet'),
                description: this.$t('modal.message.INCORRECT_FROM_ADDRESS'),
                icon: RESPONSE_ICON.CONNECT_ERROR_WALLET,
                show: true
              })
              return
            }
            if (this.underpriced(error)) {
              this.showResponseModal({
                title: '',
                content: this.$t('modal.message.system_failed'),
                description: this.$t('modal.message.TRANSACTION_UNDERPRICED'),
                icon: RESPONSE_ICON.CONNECT_ERROR_WALLET,
                show: true
              })
              return
            }
          }
        } finally {
          this.enableSubmit = false
          this.$bvModal.hide(MODAL.CONFIRM_ORDER)
        }
      }
      return isSuccess
    },
    isNotEnoughBalanceError (error) {
      return ['INSUFFICIENT_FUNDS', 'UNPREDICTABLE_GAS_LIMIT'].includes(error.code) ||
      error.data?.message?.includes('insufficient funds') || error.message?.includes(ERROR_TYPES.INSUFFICIENT_FUNDS)
    },
    underpriced (error) {
      return (error.message || error.data?.message)?.includes('transaction underpriced')
    }
  }
}
