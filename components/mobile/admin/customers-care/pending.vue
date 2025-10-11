<template>
  <section>
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
                  <base-button
                    variants="contained"
                    color="primary"
                    class="management-request__action"
                    :loading="item._loadingButton"
                    :disabled="item._loadingButton"
                    @click="$pendingRequestMixin_onReceivedSupportRequest(item)"
                  >
                    {{ $t('action.received_support') }}
                  </base-button>
                </div>
              </template>
            </request-card>
          </template>
        </list-common>
      </template>
    </order-grid-renderer>
    <client-only>
      <modal-filter-search @on-filter="$pendingRequestMixin_handleFilter" />
    </client-only>
  </section>
</template>
<script>
import pendingCustomerCareMixin from '~/mixins/admin-supporter/customers-care/pending.js'

export default {
  components: {
    RequestCard: () => import('~/components/mobile/admin/customers-care/request-card.vue'),
    ListCommon: () => import('~/components/mobile/commons/list/index.vue'),
    FilterHead: () => import('~/components/mobile/admin/customers-care/filter-head.vue'),
    OrderGridRenderer: () => import('~/components/mobile/orders/order-grid-renderer/index.vue'),
    BaseButton: () => import('~/components/common/base-button/index.vue'),
    ModalFilterSearch: () => import('~/components/mobile/admin/customers-care/modal-filter.vue')
  },
  mixins: [pendingCustomerCareMixin],
  created () {
    this.$pendingRequestMixin_onResetFilter().then(() => {
      setTimeout(() => {
        this.isSkeletonLoading = false
      }, 600)
    })
    this.$pendingRequestMixin_getCountSupportRequest()
  }
}
</script>
<style lang="scss" scoped>
.management-request {
  background-color: #F5F6F8;
  .base-button {
    @include font-t12r;
    padding: 7px 11px;
    background-color: #FF8D07;
  }
}
</style>
