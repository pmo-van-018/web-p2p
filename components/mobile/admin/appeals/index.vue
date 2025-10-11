<template>
  <section>
    <client-only>
      <layout-wrapper :title="$t('admin.listing_appeal')">
        <template #head>
          <tabs-action
            :key="totalPendingAppeal"
            :tabs="tabsMapped"
            :active-tab="activeTab"
            @on-change-tab="onChangeTab"
          />
        </template>
        <template #body>
          <order-grid-renderer class="management-orders">
            <template #head>
              <filter-head @on-submit="onFilterOptions" />
            </template>
            <template #body>
              <list-common
                class="management-orders__list"
                :loading="isLoading"
                :items="listAppeal"
                key-field="id"
                :total="total"
                show-empty
                :reset-list="page === 1"
                @refresh="onRefresh"
                @infinite-loading="onInfinite"
              >
                <template #default="{ item }">
                  <div class="management-orders__wrapper-list">
                    <div
                      :key="item.appealId"
                      class="management-orders__item"
                    >
                      <appeal-card :appeal="item" />
                    </div>
                  </div>
                </template>
              </list-common>
            </template>
          </order-grid-renderer>
        </template>
      </layout-wrapper>
    </client-only>
  </section>
</template>
<script>
import appealListingMixin from '@/mixins/admin/appeals';
import { STATUS_APPEAL_OPEN, STATUS_HISTORY_ORDER, STATUS_PENDING_ORDER } from '@/resources/order-filters';

export default {
  components: {
    LayoutWrapper: () => import('~/components/containers/layout-wrapper/index.vue'),
    TabsAction: () => import('@/components/common/tab-action'),
    AppealCard: () => import('~/components/mobile/admin/appeals/appeal-card.vue'),
    ListCommon: () => import('~/components/mobile/commons/list/index.vue'),
    FilterHead: () => import('~/components/mobile/admin/appeals/filter-head.vue'),
    OrderGridRenderer: () => import('~/components/mobile/orders/order-grid-renderer/index.vue')
  },
  mixins: [appealListingMixin],
  data () {
    return {
      DEFAULT_LOADER: 6,
      tabs: [
        {
          title: this.$t('tabs.orders.waiting_for_progressing'),
          status: 'pending',
          isCount: true,
          count: 0,
          orderStatus: STATUS_PENDING_ORDER,
          appealStatus: STATUS_APPEAL_OPEN
        },
        {
          title: this.$t('tabs.orders.processed'),
          status: 'completed',
          isCount: false,
          count: 0,
          orderStatus: STATUS_HISTORY_ORDER,
          appealStatus: undefined
        }
      ],
      totalPendingAppeal: 0,
      defaultTab: 'pending',
      orderStatus: STATUS_PENDING_ORDER
    }
  },
  computed: {
    activeTab () {
      const routeStatus = this.$route?.query?.status || this.defaultTab;
      const activeTab = this.tabsMapped.find(tab => tab.status === routeStatus);
      return activeTab;
    },
    tabsMapped () {
      return this.tabs.map((tab) => {
        if (tab.status === 'pending') {
          return { ...tab, count: this.totalPendingAppeal };
        }
        return tab
      })
    },
    queryParams () {
      return {
        page: this.page,
        limit: this.limit,
        orderStatus: this.orderStatus ? this.orderStatus : STATUS_PENDING_ORDER,
        sort: `${this.orderField}:${this.orderDirection}`,
        ...(this.orderStatus === STATUS_PENDING_ORDER && { appealStatus: STATUS_APPEAL_OPEN }),
        ...(this.type && { type: this.type }),
        ...(this.assetType && { assetType: this.assetType }),
        ...(this.startDateFormat && { startDate: this.startDateFormat }),
        ...(this.endDateFormat && { endDate: this.endDateFormat })
      }
    }
  },
  async created () {
    await this.$_appealListingMixin_getAppealList()
    if (this.orderStatus === STATUS_PENDING_ORDER) {
      this.totalPendingAppeal = this.total
    }
  },
  methods: {
    async onChangeTab (tab) {
      this.orderStatus = tab.orderStatus
      this.page = 1
      if (tab.status === 'completed') {
        this.orderField = 'updatedAt'
        this.orderDirection = 'DESC'
      } else {
        this.orderField = 'createdAt'
        this.orderDirection = 'ASC'
      }
      await this.$_appealListingMixin_getAppealList()
      if (this.orderStatus === STATUS_PENDING_ORDER) {
        this.totalPendingAppeal = this.total
      }
    },
    async onRefresh () {
      this.page = 1
      await this.$_appealListingMixin_getAppealList()
    },
    async onInfinite () {
      if (!this.isLoading && this.page < this.totalPages) {
        this.page = this.page + 1
        await this.$_appealListingMixin_getAppealList(true)
      }
    },
    async onFilterOptions (options) {
      const {
        status,
        asset,
        type,
        startDate,
        endDate
      } = options
      this.assetType = asset
      this.orderStatus = status
      this.type = type
      this.startDate = startDate
      this.endDate = endDate
      await this.$_appealListingMixin_getAppealList()
    }
  }
}
</script>
