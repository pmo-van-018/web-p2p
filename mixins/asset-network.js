import { mapGetters } from 'vuex';
import { CHAIN } from '@/constants/assets';
export default {
  computed: {
    ...mapGetters('resources', ['networkConfigs'])
  },
  methods: {
    $_assetNetwork_openExploreTransactionHash (network, hash) {
      const explorerUrl = this.networkConfigs[network]?.explorerUrls[0] || ''
      if (explorerUrl) {
        const pathPage = network === CHAIN.TRON ? '/#/transaction/' : '/tx/'
        const linkTx = new URL(pathPage + hash, explorerUrl)
        window.open(linkTx)
      }
    }
  }
}
