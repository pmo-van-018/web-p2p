import { findIndex } from 'lodash/array';
import auth from '@/mixins/auth';
import { mapState } from 'vuex';

export default {
  data () {
    return {
      tabs: [
        {
          title: this.$t('tabs.merchant_view.buy'),
          status: 'buy',
          component: 'BuyAdvertise'
        },
        {
          title: this.$t('tabs.merchant_view.sell'),
          status: 'sell',
          component: 'SellAdvertise'
        }
      ],
      activatedComponent: 'BuyAdvertise',
      defaultTab: 'buy'
    }
  },
  mixins: [auth],
  computed: {
    ...mapState('merchant-public-view', ['merchantId', 'merchantInfo']),
    activeTab () {
      const routeStatus = this.$route?.query?.status || this.defaultTab
      return findIndex(this.tabs, (tab) => {
        return tab.status === routeStatus
      }) || 0
    },
    firstTabKey () {
      return this.tabs.length ? this.tabs[0].status : this.defaultTab
    },
    triggerReload () {
      return this.activeTab + Number(Boolean(this.merchantInfo?.merchantStatus))
    }
  },
  watch: {
    $route: {
      handler () {
        let tab;
        if (this.activeTab === -1) {
          tab = this.firstTabKey
          this.$router.push({ path: this.$route.fullPath, query: { status: this.firstTabKey } });
        } else {
          tab = this.tabs[this.activeTab]
        }
        this.activatedComponent = tab.component
      },
      immediate: true
    }
  },
  methods: {
    onTabChange (tab) {
      if (tab) {
        this.$router.push({ path: this.$route.fullPath, query: { status: tab.status } });
        this.activatedComponent = tab.component
      }
    },
    cfChallengeHandle (token) {
      this.cfToken = token
      this.isShowCfVerify = false
      if (!this.user) {
        this.$_authMixin_onConnectUserWallet()
      }
    }
  }
}
