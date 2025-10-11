import { mapActions, mapState } from 'vuex';
import { POST_TYPE, USER_ROLE } from '@/config/constant';
import { BUY_ORDER_GROUPS, ORDER_GROUPS, SELL_ORDER_GROUPS } from '@/resources/order-filters';

export default {
  data () {
    return {
      tabs: [
        {
          title: this.$t('tabs.orders.completed'),
          status: 'completed',
          isCount: false,
          count: 0,
          component: 'CompletedOrders'
        },
        {
          title: this.$t('tabs.orders.cancelled'),
          status: 'cancelled',
          isCount: false,
          count: 0,
          component: 'CancelledOrders'
        }
      ],
      activatedComponent: 'CompletedOrders',
      defaultTab: 'completed',
      totalPendingOrder: 0,
      orderIds: []
    }
  },
  computed: {
    ...mapState('user', ['user']),
    ...mapState('statistics', ['statistics']),
    ...mapState('resources', ['assets']),
    orderWaitingCount () {
      return this.statistics?.orderWaitingCount || 0
    },
    userType () {
      return this.user?.type || ''
    },
    activeTab () {
      const routeStatus = this.$route?.query?.status || this.defaultTab;
      const activeTab = this.tabsMapped.find(tab => tab.status === routeStatus);
      return activeTab;
    },
    firstTab () {
      return this.tabsMapped?.[0];
    },
    tabsMapped () {
      return this.tabs.map((tab) => {
        if (tab.status === 'completed') {
          return { ...tab, count: this.totalPendingOrder };
        }
        return tab
      })
    }
  },
  mounted () {
    if (!this.assets.length) {
      this.getResources()
    }
  },
  watch: {
    $route: {
      handler () {
        let tab;
        if (!this.activeTab) {
          tab = this.firstTab;
          this.$router.push({ path: this.$route.fullPath, query: { status: this.firstTab?.status } });
        } else {
          tab = this.activeTab;
        }
        this.activatedComponent = tab.component;
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions('resources', ['getResources']),
    onChangeUserOrder (tab) {
      if (tab) {
        this.$router.push({ path: this.$route.fullPath, query: { status: tab.status } });
        this.activatedComponent = tab.component
      }
    },
    updateTotalPending (totalPendingOrder) {
      this.totalPendingOrder = totalPendingOrder
    },
    hasGroupOrder (order) {
      if (![USER_ROLE.USER, USER_ROLE.MERCHANT_OPERATOR].includes(this.userType)) {
        return false
      }
      const orderGroupType = order.postType === POST_TYPE.SELL ? BUY_ORDER_GROUPS : SELL_ORDER_GROUPS
      return orderGroupType[this.userType][ORDER_GROUPS.WAITING.toUpperCase()]?.includes(order.step)
    }
  }
}
