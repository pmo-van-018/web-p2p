<template>
  <section>
    <client-only>
      <template #placeholder>
        <div class="my-2 mx-2">
          <order-filter-skeleton-loader />
          <order-filter-skeleton-loader class="my-2" />
          <order-card-skeleton-loader v-for="key in DEFAULT_LOADER" :key="key" />
        </div>
      </template>
      <layout-wrapper>
        <template #head>
          <tabs-action
            :key="orderWaitingCount"
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
            />
          </div>
        </template>
      </layout-wrapper>
    </client-only>
  </section>
</template>
<script>
import tabsListOrderMixin from '~/mixins/user/tab-list-order'

export default {
  components: {
    LayoutWrapper: () => import('~/components/containers/layout-wrapper/index.vue'),
    TabsAction: () => import('@/components/common/tab-action'),
    PendingOrders: () => import('~/components/mobile/user/orders-management/pending-orders/index.vue'),
    AppealOrders: () => import('~/components/mobile/user/orders-management/appeal-orders/index.vue'),
    CompletedOrders: () => import('~/components/mobile/user/orders-management/completed-orders/index.vue'),
    CancelledOrders: () => import('~/components/mobile/user/orders-management/cancelled-orders/index.vue'),
    OrderCardSkeletonLoader: () => import('~/components/mobile/commons/loader/order/index.vue'),
    OrderFilterSkeletonLoader: () => import('~/components/mobile/commons/loader/filters/index.vue')
  },
  mixins: [tabsListOrderMixin],
  data () {
    return {
      DEFAULT_LOADER: 6
    }
  }
}
</script>
