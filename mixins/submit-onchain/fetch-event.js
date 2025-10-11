import { ERROR_TYPES } from '@/mixins/open-wallet';
import { ethers } from 'ethers';
import { mapGetters, mapState } from 'vuex';
import dayjs from 'dayjs';
import axios from 'axios';
import providerFactoryMixin from '~/mixins/web3-onboard/provider-factory'

export default {
  mixins: [providerFactoryMixin],
  computed: {
    ...mapState('web3-onboard', ['web3Onboard']),
    ...mapState('user', ['user']),
    ...mapState('resources', ['allAssets']),
    ...mapGetters('resources', ['networkConfigs']),
    stateWallet () {
      return this.web3Onboard?.state?.get()?.wallets
    }
  },
  data () {
    return {
      currentTransactionTrc20: null
    }
  },
  methods: {
    async getTransactionCreatedAt (assetNetwork, hash) {
      try {
        const provider = this.$_providerFactory_getProvider(assetNetwork);
        const transaction = await provider.getTransaction(hash);

        if (!transaction || !transaction.blockNumber) {
          throw new Error('Transaction or block number not found');
        }

        const block = await provider.getBlock(transaction.blockNumber);

        if (!block || !block.timestamp) {
          throw new Error('Block or timestamp not found');
        }

        return new Date(block.timestamp * 1000).toUTCString();
      } catch (error) {
        return null;
      }
    },
    async $_fetchEventOnChain_isTransactionSentAfterOrderCreated (assetNetwork, orderCreatedAt, hash) {
      let transactionCreatedAt
      if (assetNetwork === this.networkConfigs?.Tron?.chainName) {
        transactionCreatedAt = new Date(this.currentTransactionTrc20?.block_timestamp).toUTCString() || 0
      } else {
        transactionCreatedAt = await this.getTransactionCreatedAt(assetNetwork, hash)
      }
      if (!transactionCreatedAt) {
        return false;
      }
      return dayjs(transactionCreatedAt).isAfter(dayjs(orderCreatedAt));
    },
    async $_fetchEventOnChain_fetchTRC20TransactionByAccount (address) {
      try {
        const { data } = await axios.get(`${this.networkConfigs?.Tron?.rpc?.[0]}/v1/accounts/${address}/transactions/trc20`);
        if (data?.data) {
          this.currentTransactionTrc20 = data?.data?.[0] || null
        }
      } catch (error) {
        this.currentTransactionTrc20 = null
      }
    },
    async $_fetchEventOnChain_getEventInOnChain ({ fromAddress, toAddress, assetNetwork, assetName }) {
      const wallets = this.stateWallet
      if (
        !wallets?.length ||
        wallets[0].accounts[0].address?.toLowerCase() !== fromAddress?.toLowerCase()
      ) {
        throw new Error(ERROR_TYPES.INCORRECT_FROM_ADDRESS);
      }

      const provider = this.$_providerFactory_getProvider(assetNetwork)
      const latestBlock = await provider.getBlock()
      const ABI = [
        'event Transfer(address indexed from, address indexed to, uint256 value)'
      ]
      const asset = this.allAssets.find(
        e => e.network === assetNetwork && e.name === assetName
      );
      const contract = new ethers.Contract(asset.contract, ABI, provider)
      const filterTx = contract.filters.Transfer(fromAddress, toAddress);

      const fetchEvents = async () => await contract.queryFilter(filterTx, latestBlock.number - 1000, latestBlock.number)

      let events = await fetchEvents()
      if (!events.length) {
        // retry to fetch events
        events = await fetchEvents()
      }
      return events
    },
    async $_fetchEventOnChain_fetchAndProcessEvents ({ fromAddress, toAddress, assetNetwork, assetName }) {
      if (assetNetwork === this.networkConfigs?.Tron?.chainName) {
        await this.$_fetchEventOnChain_fetchTRC20TransactionByAccount(fromAddress)
        return this.currentTransactionTrc20 ? this.currentTransactionTrc20?.transaction_id : ''
      }
      const events = await this.$_fetchEventOnChain_getEventInOnChain({
        fromAddress,
        toAddress,
        assetNetwork,
        assetName
      });
      return events.length ? events[events.length - 1]?.transactionHash || '' : '';
    }
  }
}
