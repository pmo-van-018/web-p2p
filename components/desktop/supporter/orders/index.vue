<template>
  <client-only>
    <layout-wrapper :title="$t('merchant.supporter.title.list_order')">
      <template #head>
        <tabs-action
          :tabs="tabs"
          :active-tab="activeTab"
          @on-change-tab="onChangeTab"
        />
      </template>
      <template #body>
        <div class="order-management">
          <component
            :is="activatedComponent"
            :key="activatedComponent"
            :page="page"
            :limit="limit"
            :total="total"
            :is-loading="isLoading"
            :orders="orders"
            :is-open-chat="isOpenChat"
            @on-search="onSearchOrder"
            @on-refresh="$_supporterMixin_onFilter"
            @on-filters="$_supporterMixin_onFilter"
            @change-sort="$_supporterMixin_handleChangeSort"
            @change-pagination="$_supporterMixin_onChangePage"
            @pick-order="updateTotalCount"
            @on-open-chat="onOpenChat"
          />
        </div>
      </template>
    </layout-wrapper>
  </client-only>
</template>
<script>
import supporterMixin from '@/mixins/merchant/supporter/tab';

export default {
  components: {
    LayoutWrapper: () => import('~/components/containers/layout-wrapper/index.vue'),
    TabsAction: () => import('@/components/common/tab-action'),
    PendingOrders: () => import('~/components/desktop/supporter/orders/pending.vue'),
    ProcessingOrders: () => import('~/components/desktop/supporter/orders/processing.vue')
  },
  mixins: [supporterMixin],
  data () {
    return {
      isOpenChat: false
    }
  },
  methods: {
    onOpenChat () {
      this.isOpenChat = !this.isOpenChat
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
