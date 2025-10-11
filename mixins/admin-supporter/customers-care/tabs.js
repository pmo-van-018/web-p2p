import { mapState } from 'vuex';
import isEmpty from 'lodash/isEmpty';
import { USER_ROLE } from '@/config/constant'
export default {
  data () {
    return {
      tabs: [
        {
          title: this.$t('tabs.customer_care.pending'),
          status: 'pending',
          isCount: true,
          count: 0,
          component: 'Pending'
        },
        {
          title: this.$t('tabs.customer_care.processing'),
          status: 'progressing',
          isCount: false,
          count: 0,
          component: 'Processing',
          roles: [USER_ROLE.ADMIN_SUPPORTER]
        },
        {
          title: this.$t('tabs.customer_care.processed'),
          status: 'processed',
          isCount: false,
          count: 0,
          component: 'Processed'
        }
      ],
      activatedComponent: 'Pending',
      defaultTab: 'pending',
      pendingCountRequest: 0
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
        if (tab.status === 'pending') {
          return { ...tab, count: this.pendingCountRequest };
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
    oncChangeTab (tab) {
      if (tab) {
        this.$router.push({ path: this.$route.fullPath, query: { status: tab.status } });
        this.activatedComponent = tab.component
      }
    },
    onUpdateTotalPending (total) {
      this.pendingCountRequest = total
    }
  }
}
