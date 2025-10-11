import { mapActions, mapState, mapGetters } from 'vuex';
import { GET_SETTING_LIMIT_BY_OPERATOR } from '@/api/master-data';
import balanceAssetMixin from '~/mixins/balance-asset'

export default {
  data () {
    return {
      balance: 0,
      commonMasterData: null,
      levelFee: null,
      isLoadingCommonMaster: true,
      benchmarkPrice: 0,
      percent: 100
    }
  },
  mixins: [balanceAssetMixin],
  computed: {
    ...mapGetters('resources', ['networkConfigs']),
    ...mapState('user', ['user']),
    ...mapState('resources', ['assets']),
    ...mapState('payments', ['isPaymentLoading'])
  },
  methods: {
    ...mapActions('post', ['setPostClone']),
    ...mapActions('payments', ['getListPayment']),
    async getFees () {
      try {
        this.isLoadingCommonMaster = true
        const commonMasterData = await this.$axios.$get(GET_SETTING_LIMIT_BY_OPERATOR)
        this.levelFee = commonMasterData?.data?.fee
        this.commonMasterData = commonMasterData
      } catch (error) {
        /* eslint-disable no-console */
        console.error(error)
      } finally {
        this.isLoadingCommonMaster = false
      }
    },
    async getBalance (assetId) {
      const asset = this.assets.find(item => item.id === assetId)
      const isNative = this.networkConfigs?.[asset?.network]?.nativeCurrency?.symbol === asset?.symbol
      const address = this.user?.walletAddress || ''

      if (asset) {
        const balance = await this.$_balanceAssetMixin_getBalanceAsset({
          contractAddress: asset?.contract,
          walletAddress: address,
          assetNetwork: asset?.network,
          isNative
        })
        this.balance = balance
      }
    },
    onGetBenchmarkPrice (price) {
      this.benchmarkPrice = price
    },
    onChangePercent (percent) {
      this.percent = Number(percent)
    }
  }
}
