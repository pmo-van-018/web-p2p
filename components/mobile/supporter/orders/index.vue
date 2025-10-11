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
      <layout-wrapper :title="$t('merchant.supporter.title.list_order')">
        <template #head>
          <tabs-action
            :key="key"
            :tabs="tabs"
            :active-tab="activeTab"
            @on-change-tab="onChangeTab"
          />
        </template>
        <template #body>
          <div class="order-management">
            <component
              :is="activatedComponent"
              :key="$route.fullPath"
              :total="total"
              :is-loading="isLoading"
              :orders="orders"
              :page="page"
              @on-refresh="$_supporterMixin_onFilter"
              @on-filters="$_supporterMixin_onFilter"
              @infinite-loading="$_supporterMixin_onInfiniteLoadingOrder"
              @on-open-bank-qrcode="$_supporterMixin_onOpenBankQrcode"
              @pick-order="updateTotalCount"
            />
          </div>
        </template>
      </layout-wrapper>
      <modal-bank-qrcode :qr-code-url="bankQrCode" />
    </client-only>
  </section>
</template>
<script>
import supporterMixin from '@/mixins/merchant/supporter/tab';
export default {
  components: {
    LayoutWrapper: () => import('~/components/containers/layout-wrapper/index.vue'),
    TabsAction: () => import('@/components/common/tab-action'),
    PendingOrders: () => import('~/components/mobile/supporter/orders/pending.vue'),
    ProcessingOrders: () => import('~/components/mobile/supporter/orders/processing.vue'),
    OrderCardSkeletonLoader: () => import('~/components/mobile/commons/loader/order/index.vue'),
    ModalBankQrcode: () => import('@/components/common/modal/modal-bank-qrcode.vue'),
    OrderFilterSkeletonLoader: () => import('~/components/mobile/commons/loader/filters/index.vue')
  },
  mixins: [supporterMixin]
}
</script>
