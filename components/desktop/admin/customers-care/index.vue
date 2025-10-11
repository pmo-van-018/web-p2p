<template>
  <section class="list-management">
    <client-only>
      <layout-wrapper :title="`${$t('title_head.request_supporter')}`">
        <template #head>
          <tabs-action
            :key="$route.fullPath"
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
    Pending: () => import('~/components/desktop/admin/customers-care/pending.vue'),
    Processing: () => import('~/components/desktop/admin/customers-care/processing.vue'),
    Processed: () => import('~/components/desktop/admin/customers-care/processed.vue')
  },
  mixins: [tabCustomerCareMixin]
}
</script>
<style lang="scss" scoped>
.list-management {
  &__chat-action {
    position: fixed;
    bottom: 3rem;
    right: 4rem;
  }
}
</style>
