import { mapState, mapActions, mapGetters } from 'vuex'
import POST_API from '@/api/post'
import get from 'lodash/get';
import { POST_TYPE, USER_STATUS } from '@/config/constant';
import { mergeByProp } from '@/helper';
import isEmpty from 'lodash/isEmpty';
import { isEnableAssetNetwork } from '@/helper/wallet-address';
import balanceAssetMixin from '~/mixins/balance-asset'

export default {
  data () {
    return {
      isSkeletonLoading: true,
      isLoadingData: false,
      page: 1,
      limit: 10,
      total: 0,
      currentPage: 1,
      perPage: 10,
      items: [],
      activeItem: null,
      POST_TYPE
    }
  },
  mixins: [balanceAssetMixin],
  props: {
    cfToken: {
      type: String,
      default: ''
    },
    triggerReload: {
      type: Number,
      default: 0
    }
  },
  watch: {
    triggerReload (value) {
      if (value) {
        this.$merchantPublicViewMixin_onResetStateFilter()
        this.$merchantPublicViewMixin_getList()
      }
    }
  },
  computed: {
    ...mapState('merchant-public-view', ['merchantId', 'merchantInfo']),
    ...mapState('user', ['user', 'balance']),
    ...mapState('resources', ['assets']),
    ...mapState('payments', ['payments']),
    ...mapGetters('resources', ['networkConfigs']),
    isPaymentEmpty () {
      return !this.payments.length && !isEmpty(this.user)
    }
  },
  methods: {
    ...mapActions('user', ['setBalance']),
    ...mapActions('post', ['getPostStatus', 'setPost']),
    decimalLimit (post) {
      const asset = this.assets.find(item => item.name === post?.assetName && item.network === post?.assetNetwork)
      return this.assets.find(item => item.id === asset?.id)?.precision || 0
    },
    $merchantPublicViewMixin_onResetStateFilter () {
      this.page = 1
      this.limit = 10
    },
    $merchantPublicViewMixin__toggleDetails (item) {
      if (this.detailsRow && this.detailsRow !== item) {
        this.detailsRow._showDetails = false
      }

      this.$set(item, '_showDetails', !item._showDetails)
      this.detailsRow = item
    },
    async $merchantPublicViewMixin_getList (isMergePost = false) {
      try {
        if (this.merchantInfo?.merchantStatus !== USER_STATUS.ACTIVE) {
          return;
        }
        this.isLoadingData = true
        const path = this.user ? POST_API.SEARCH_BY_MERCHANT : POST_API.SEARCH_BRIEF_BY_MERCHANT
        const res = await this.$axios.$get(path, {
          params: {
            ...this.params,
            merchantId: this.merchantId
          }
        })
        if (res?.data?.items) {
          const items = (res.data?.items || []).map((item) => {
            item.disable = this.user && !isEnableAssetNetwork(this.user?.walletAddress, item.assetNetwork)
            return item
          })
          this.items = isMergePost ? mergeByProp(this.items, items, 'id') : items
          this.setPost(this.items)
          this.getPostStatus()
          this.total = res.data?.totalItems || 0
        }
        this.isLoadingData = false
      } catch (error) {
        if (get(error, 'response.data.errors[0].message') === 'Error: Merchant not found') {
          this.$router.replace('/404')
        }
        this.isLoadingData = false
      }
    },
    handleRowClass (item) {
      return item?.disable ? 'disable' : ''
    },
    async onRowClicked (e) {
      if (this.user) {
        if (e.disable) {
          return
        }
        if (this.$device.isDesktop) {
          this.$merchantPublicViewMixin__toggleDetails(e)
        }
        this.activeItem = e
        if (this.showDetail) {
          this.showDetail(e)
        }
        const address = this.user.walletAddress
        const asset = this.assets.find(asset => asset.network === e.assetNetwork && asset.name === e.assetName)
        const isNative = this.networkConfigs?.[asset?.network]?.nativeCurrency?.symbol === asset?.symbol
        const balance = await this.$_balanceAssetMixin_getBalanceAsset({
          contractAddress: asset?.contract,
          walletAddress: address,
          assetNetwork: asset?.network,
          isNative
        })
        this.setBalance(balance)
        return
      }
      this.$emit('on-authenticate')
    },
    selectedItem (value) {
      return {
        ...value,
        postId: value.id,
        price: parseFloat(value.price, 10),
        note: value?.note || '',
        merchant: {
          merchantId: parseInt(this.merchantId),
          nickName: this.merchantInfo.merchantName,
          monthFinishRate: this.merchantInfo.completeRate / 100,
          monthOrderCount: this.merchantInfo.transInMonth.total
        }
      }
    }
  }
}
