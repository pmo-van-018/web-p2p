<template>
  <client-only>
    <layout-wrapper :title="`${$t('admin.listing_appeal')}`">
      <template #head>
        <tabs-action
          :key="totalPending"
          :tabs="tabsMapped"
          :active-tab="activeTab"
          @on-change-tab="onChangeUserOrder"
        />
      </template>
      <template #body>
        <div class="order-management">
          <component :is="activatedComponent" @update-total-pending="updateTotalPending" />
        </div>
      </template>
    </layout-wrapper>
  </client-only>
</template>
<script>
import appealListingMixin from '@/mixins/admin/appeals'
import { STATUS_APPEAL_OPEN, STATUS_PENDING_ORDER } from '@/resources/order-filters';

export default {
  components: {
    LayoutWrapper: () => import('~/components/containers/layout-wrapper/index.vue'),
    TabsAction: () => import('@/components/common/tab-action'),
    PendingAppeals: () => import('~/components/desktop/admin/appeals/pending/index.vue'),
    CompletedAppeals: () => import('~/components/desktop/admin/appeals/completed/index.vue')
  },
  mixins: [appealListingMixin],
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
          title: this.$t('tabs.orders.processed'),
          status: 'completed',
          isCount: false,
          count: 0,
          component: 'CompletedAppeals'
        }
      ],
      activatedComponent: 'PendingAppeals',
      defaultTab: 'pending'
    }
  },
  computed: {
    activeTab () {
      const routeStatus = this.$route?.query?.status || this.defaultTab;
      return this.tabsMapped.find(tab => tab.status === routeStatus);
    },
    firstTab () {
      return this.tabsMapped[0];
    },
    tabsMapped () {
      return this.tabs.map((tab) => {
        if (tab.status === 'pending') {
          return { ...tab, count: this.totalPending }
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
  async created () {
    let tab;
    if (!this.activeTab) {
      tab = this.firstTab;
      this.$router.push({ path: this.$route.fullPath, query: { status: this.firstTab?.status } });
    } else {
      tab = this.activeTab;
    }
    this.activatedComponent = tab.component
    if (tab.status !== 'pending') {
      await this.$_appealListingMixin_getAppealList()
      this.totalPending = this.total
    }
  },
  methods: {
    onChangeUserOrder (tab) {
      if (tab) {
        this.$router.push({ path: this.$route.fullPath, query: { status: tab.status } });
        this.activatedComponent = tab.component
      }
    },
    updateTotalPending (total) {
      this.totalPending = total
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
