<template>
  <order-grid-renderer class="management-request">
    <template #head>
      <filter-head />
    </template>
    <template #body>
      <list-common
        class="management-request__list"
        key-field="id"
        :loading="requestLoading"
        :items="items"
        :total="total"
        show-empty
        :reset-list="page === 1"
        @refresh="$commonRequestSupportMixin_onRefresh"
        @infinite-loading="$commonRequestSupportMixin_onInfiniteLoading"
      >
        <template #default="{ item }">
          <request-card :item="item" class="mt-3">
            <template #action>
              <div class="d-flex justify-content-end">
                <chat-action @click="$commonRequestSupportMixin_onOpenDetailRequest(item)">
                  {{ $t('common.message') }}
                </chat-action>
              </div>
            </template>
          </request-card>
        </template>
      </list-common>
    </template>
  </order-grid-renderer>
</template>
<script>
import processingCustomerCareMixin from '~/mixins/admin-supporter/customers-care/processing.js'

export default {
  components: {
    RequestCard: () => import('~/components/mobile/admin/customers-care/request-card.vue'),
    ListCommon: () => import('~/components/mobile/commons/list/index.vue'),
    FilterHead: () => import('~/components/mobile/admin/customers-care/filter-head.vue'),
    OrderGridRenderer: () => import('~/components/mobile/orders/order-grid-renderer/index.vue'),
    ChatAction: () => import('~/components/mobile/admin/customers-care/chat-action.vue')
  },
  mixins: [processingCustomerCareMixin],
  created () {
    this.$processingRequestMixin_onResetFilter().then(() => {
      setTimeout(() => {
        this.isSkeletonLoading = false
      }, 600)
    })
  }
}
</script>
