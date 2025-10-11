<template>
  <client-only>
    <layout-wrapper :title="`${$t('admin.listing_appeal')}`">
      <template #head>
        <tabs-action
          :key="totalTabs.pending"
          :tabs="tabsMapped"
          :active-tab="activeTab"
          @on-change-tab="onChangeUserOrder"
        />
      </template>
      <template #body>
        <div class="order-management">
          <component
            :is="activatedComponent"
            @update-total-pending="updateTotalPending"
            @update-total-processing="updateTotalProcessing"
          />
        </div>
      </template>
    </layout-wrapper>
  </client-only>
</template>
<script>
import { STATUS_APPEAL_OPEN, STATUS_PENDING_ORDER } from '@/resources/order-filters';
import { mapActions, mapState } from 'vuex';

export default {
  components: {
    LayoutWrapper: () => import('~/components/containers/layout-wrapper/index.vue'),
    TabsAction: () => import('@/components/common/tab-action'),
    PendingAppeals: () => import('~/components/desktop/admin/list-appeals/pending/index.vue'),
    ProcessingAppeals: () => import('~/components/desktop/admin/list-appeals/processing/index.vue'),
    CompletedAppeals: () => import('~/components/desktop/admin/list-appeals/completed/index.vue')
  },
  data () {
    return {
      tabs: [
        {
          title: this.$t('tabs.orders.waiting_for_progressing'),
          status: 'pending',
          isCount: true,
          count: 0,
          component: 'PendingAppeals'
        },
        {
          title: this.$t('tabs.orders.processing_by_you'),
          status: 'processing',
          count: 0,
          component: 'ProcessingAppeals'
        },
        {
          title: this.$t('tabs.orders.processed'),
          status: 'completed',
          isCount: false,
          count: 0,
          component: 'CompletedAppeals'
        }
      ],
      activatedComponent: 'PendingAppeals',
      defaultTab: 'pending',
      totalTabs: {
        pending: 0
      }
    }
  },
  computed: {
    ...mapState('admin-appeal', ['appealCount']),
    activeTab () {
      const routeStatus = this.$route?.query?.status || this.defaultTab;
      const activeTab = this.tabsMapped.find(tab => tab.status === routeStatus);
      return activeTab;
    },
    firstTab () {
      return this.tabsMapped[0];
    },
    tabsMapped () {
      return this.tabs.map((tab) => {
        if (tab.status === 'pending') {
          return { ...tab, count: this.appealCount }
        }
        if (tab.status === 'processing') {
          return { ...tab, count: this.totalTabs.processing }
        }
        return tab
      })
    },
    queryParams () {
      return {
        page: 1,
        limit: 1,
        orderStatus: STATUS_PENDING_ORDER,
        appealStatus: STATUS_APPEAL_OPEN
      }
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
  created () {
    let tab;
    if (!this.activeTab) {
      tab = this.firstTab;
      this.$router.push({ path: this.$route.fullPath, query: { status: this.firstTab?.status } });
    } else {
      tab = this.activeTab;
    }
    this.activatedComponent = tab.component
  },
  methods: {
    ...mapActions('admin-appeal', ['setWaitingAppealCount']),
    onChangeUserOrder (tab) {
      if (tab) {
        this.$router.push({ path: this.$route.fullPath, query: { status: tab.status } });
        this.activatedComponent = tab.component
      }
    },
    updateTotalPending (total) {
      this.setWaitingAppealCount(total)
    },
    updateTotalProcessing (total) {
      this.totalTabs.processing = total
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
