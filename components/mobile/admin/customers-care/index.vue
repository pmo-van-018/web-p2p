<template>
  <section class="management-list">
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
            :key="activeTab"
            :tabs="tabsMapped"
            :active-tab="activeTab"
            @on-change-tab="oncChangeTab"
          />
        </template>
        <template #body>
          <div class="order-management">
            <component
              :is="activatedComponent"
              @update-total-pending="onUpdateTotalPending"
            />
          </div>
        </template>
      </layout-wrapper>
    </client-only>
  </section>
</template>
<script>
import tabCustomerCareMixin from '~/mixins/admin-supporter/customers-care/tabs.js'

export default {
  components: {
    LayoutWrapper: () => import('~/components/containers/layout-wrapper/index.vue'),
    TabsAction: () => import('@/components/common/tab-action'),
    Pending: () => import('~/components/mobile/admin/customers-care/pending.vue'),
    Processing: () => import('~/components/mobile/admin/customers-care/processing.vue'),
    Processed: () => import('~/components/mobile/admin/customers-care/processed.vue'),
    OrderCardSkeletonLoader: () => import('~/components/mobile/commons/loader/order/index.vue'),
    OrderFilterSkeletonLoader: () => import('~/components/mobile/commons/loader/filters/index.vue')
  },
  mixins: [tabCustomerCareMixin],
  data () {
    return {
      DEFAULT_LOADER: 6
    }
  }
}
</script>
<style lang="scss" scoped>
.management-list {
  min-height: inherit;
  height: inherit;
  background-color: $neutrals-10;
}
:deep(.layout-wrapper__head) {
  background-color: $white;
}
</style>
