import Pagination from '@/components/common/pagination.vue'
import BaseInputLabel from '@/components/common/base-input-label.vue'
import { mapActions, mapState, mapGetters } from 'vuex'
import { findIndex } from 'lodash/array'
import { POST_TYPE } from '@/config/constant'
import { MODAL } from '@/resources/modal'
import auth from '@/mixins/auth'
import orderBy from 'lodash/orderBy'
import supportedAssetMixin from '~/mixins/supported-asset';
import balanceAssetMixin from '~/mixins/balance-asset'
export default {
  components: {
    BaseInputLabel,
    Pagination
  },
  computed: {
    ...mapState('post', [
      'assetName',
      'assetNetwork',
      'posts',
      'currentPage',
      'totalPage',
      'total',
      'perPage',
      'isLoading'
    ]),
    ...mapState('user', ['user', 'balance']),
    ...mapState('resources', ['assets', 'allAssets', 'isResourceLoading']),
    ...mapGetters('resources', ['networkConfigs']),
    isEmptyPosts () {
      return !this.posts.length && !this.isLoading
    },
    filteredTabPanels () {
      return this.tabPanels.filter(item => !item.disabled)
    },
    firstTabKey () {
      return this.filteredTabPanels.length ? this.filteredTabPanels[0].key : null
    },
    firstTab () {
      return this.filteredTabPanels.length ? this.filteredTabPanels[0] : null
    },
    activeTab () {
      const asset = this.asset || this.firstTabKey
      return findIndex(this.tabPanels, tab => tab.key === asset && !tab.disabled)
    },
    asset () {
      return this.$route.query?.asset || null
    },
    assetType () {
      if (['/marketplace', '/marketplace/buy', '/marketplace/buy/'].includes(this.$route.path)) {
        return POST_TYPE.SELL
      }
      if (['/marketplace/sell', '/marketplace/sell/'].includes(this.$route.path)) {
        return POST_TYPE.BUY
      }
      return ''
    },
    tabPanels () {
      return orderBy(this.assetsSupportedMapped, ['orderNumber', 'desc'])
    }
  },
  mixins: [auth, balanceAssetMixin, supportedAssetMixin],
  data () {
    return {
      itemActive: -1,
      firstLoading: false
    }
  },
  methods: {
    ...mapActions('post', ['onChangePage', 'clearRefreshIntervalId', 'resetIntervalId']),
    ...mapActions('user', ['setBalance']),
    ...mapActions('resources', ['getResources']),
    handlePage (page) {
      this.onChangePage(page)
      this.cancelTransaction()
    },
    async clickDetail (post) {
      this.itemActive = post.id
      this.clearRefreshIntervalId()
      this.$emit('showDetail', post)
      if (this.user && this.assetType === POST_TYPE.BUY) {
        const address = this.user.walletAddress
        const asset = this.allAssets.find(e => e.network === this.assetNetwork && e.name === this.assetName)
        const isNative = this.networkConfigs?.[asset?.network]?.nativeCurrency?.symbol === asset?.symbol
        const balance = await this.$_balanceAssetMixin_getBalanceAsset({
          contractAddress: asset.contract,
          walletAddress: address,
          assetNetwork: this.assetNetwork,
          isNative
        })
        this.setBalance(balance)
      }
    },
    cfChallengeHandle () {
      this.$bvModal.show(MODAL.CF_TURNSTILE)
      this.isShowCfVerify = true
    },
    onCfChallengeResult (token) {
      this.cfToken = token
      this.isShowCfVerify = false
      if (!this.user) {
        this.$_authMixin_onConnectUserWallet()
      }
    },
    cancelTransaction () {
      this.itemActive = -1
      this.resetIntervalId()
    },
    async onSearchPost (sortDirection) {
      let tab;
      if (this.activeTab === -1) {
        tab = this.firstTab
      } else {
        tab = this.tabPanels[this.activeTab]
      }
      if (tab) {
        const body = {
          amount: this.amount,
          assetName: tab.title,
          assetNetwork: tab.subTitle,
          type: this.assetType
        }
        if (sortDirection) {
          Object.assign(body, { sortDirection })
        }
        await this.searchPost(body);
      }
      this.firstLoading = false
    }
  }
}
