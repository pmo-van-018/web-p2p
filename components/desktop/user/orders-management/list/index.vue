<template>
  <client-only>
    <layout-wrapper :title="`${$t('title_head.transaction')}`" center>
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
          <component :is="activatedComponent" @update-total-pending="updateTotalPending" />
        </div>
      </template>
    </layout-wrapper>
  </client-only>
</template>
<script>
import tabsListOrderMixin from '~/mixins/user/tab-list-order';

export default {
  components: {
    LayoutWrapper: () => import('~/components/containers/layout-wrapper/index.vue'),
    TabsAction: () => import('@/components/common/tab-action'),
    CompletedOrders: () => import('~/components/desktop/user/orders-management/completed-orders/index.vue'),
    CancelledOrders: () => import('~/components/desktop/user/orders-management/cancelled-orders/index.vue')
  },
  mixins: [tabsListOrderMixin]
}
</script>
<style lang="scss" scoped>

</style>
