import { mapActions, mapState } from 'vuex';
import isEmpty from 'lodash/isEmpty';
import { USER_ROLE } from '@/config/constant';

export default {
  data () {
    return {
      tabs: [
        {
          title: this.$t('tabs.orders.pending'),
          status: 'pending',
          isCount: true,
          count: 0,
          component: 'PendingOrders',
          roles: [USER_ROLE.USER]
        },
        {
          title: this.$t('tabs.orders.waiting_for_progressing'),
          status: 'pending-progress',
          isCount: true,
          count: 0,
          component: 'PendingOrders',
          roles: [USER_ROLE.MERCHANT_OPERATOR, USER_ROLE.MERCHANT_MANAGER]
        },
        {
          title: this.$t('tabs.orders.waiting_for_user_to_confirm'),
          status: 'pending-user-confirm',
          isCount: false,
          count: 0,
          component: 'WaitingConfirmationOrders',
          roles: [USER_ROLE.MERCHANT_OPERATOR, USER_ROLE.MERCHANT_MANAGER]
        },
        {
          title: this.$t('tabs.orders.appeal'),
          status: 'appeal',
          isCount: false,
          count: 0,
          component: 'AppealOrders'
        },
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
      activatedComponent: 'PendingOrders',
      defaultTab: 'pending'
    }
  },
  computed: {
    ...mapState('user', ['user']),
    ...mapState('statistics', ['statistics']),
    orderWaitingCount () {
      return this.statistics?.orderWaitingCount || 0
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
        if (tab.status === 'pending' || tab.status === 'pending-progress') {
          return { ...tab, count: this.orderWaitingCount };
        }
        return tab
      }).filter(item => isEmpty(item.roles) || item.roles.includes(this.user?.type))
    }
  },
  async created () {
    await this.getResources()
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
    updateTotalPending (total) {
      // TODO: update order count
    }
  }
}
