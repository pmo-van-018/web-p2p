import { mapState } from 'vuex';
import isEmpty from 'lodash/isEmpty';

export default {
  data () {
    return {
      totalPendingOrders: 0,
      tabs: [
        {
          title: this.$t('tabs.orders.waiting_for_progressing'),
          status: 'pending-progress',
          isCount: true,
          count: 0,
          component: 'PendingOrders'
        },
        {
          title: this.$t('tabs.orders.waiting_for_user_to_confirm'),
          status: 'pending-user-confirm',
          isCount: false,
          count: 0,
          component: 'WaitingConfirmationOrders'
        }
      ],
      activatedComponent: 'PendingOrders',
      defaultTab: 'pending'
    }
  },
  computed: {
    ...mapState('user', ['user']),
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
          return { ...tab, count: this.totalPendingOrders };
        }
        return tab
      }).filter(item => isEmpty(item.roles) || item.roles.includes(this.user?.type))
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
    onChangeUserOrder (tab) {
      if (tab) {
        this.$router.push({ path: this.$route.fullPath, query: { status: tab.status } });
        this.activatedComponent = tab.component
      }
    }
  }
}
