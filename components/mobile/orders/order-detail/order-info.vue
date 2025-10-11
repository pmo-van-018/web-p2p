<template>
  <div class="order-info">
    <div class="order-info__container">
      <div class="order-info__body">
        <div class="order-info__inner">
          <div class="order-info__left">
            <div class="order-info__content">
              <div class="order-info__type">
                <span :class="orderTypeClass">{{ orderTypeText }}</span>
                <span class="name">{{ order.assetName }}</span>
                <span class="network">({{ order.assetNetwork }})</span>
              </div>
            </div>
          </div>
          <div class="order-info__right">
            <div class="d-flex align-items-center">
              <order-status :order="order" />
              <div v-if="order?.supporter" class="modal-detail__supporter ml-2">
                <order-supporter :order="order" horizontal :is-visible-name="false" />
              </div>
            </div>
          </div>
        </div>

        <div class="order-info__inner">
          <div class="order-info__left">
            <div class="order-info__content">
              {{ $t('transfer_seller.label.time_create') }}
            </div>
          </div>
          <div class="order-info__right">
            <div class="order-info__text">
              {{ order.createdTime | formatDateTime }}
            </div>
          </div>
        </div>

        <div class="order-info__inner">
          <div class="order-info__left">
            <div class="order-info__content">
              {{ $t('transfer_seller.label.user') }}
            </div>
          </div>
          <div class="order-info__right">
            <div class="order-info__text">
              {{ order.user?.nickName || '' }}
            </div>
          </div>
        </div>

        <div v-if="order?.supporter" class="order-info__inner">
          <div class="order-info__left">
            <div class="order-info__content">
              {{ $t('transfer_seller.label.supporter') }}
            </div>
          </div>
          <div class="order-info__right">
            <div class="order-info__text">
              {{ order.supporter?.nickName || '' }}
            </div>
          </div>
        </div>

        <div class="order-info__inner">
          <div class="order-info__left">
            <div class="order-info__content">
              {{ $t('merchant.list_order.order_item.code_command') }}
            </div>
          </div>
          <div class="order-info__right">
            <div class="order-info__text">
              #{{ order.orderRefId }}
            </div>
          </div>
        </div>

        <div class="order-info__inner">
          <div class="order-info__left">
            <div class="order-info__content">
              {{ $t('merchant.list_order.order_item.ad_id') }}
            </div>
          </div>
          <div class="order-info__right">
            <div class="order-info__text">
              #{{ order.postRefId }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ORDER_TYPE } from '@/resources/order-type'

export default {
  components: {
    OrderStatus: () => import('~/components/desktop/orders/status/index.vue'),
    OrderSupporter: () => import('~/components/desktop/merchant/orders-management/order-supporter.vue')
  },
  props: {
    order: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    orderTypeClass () {
      return this.order?.type === ORDER_TYPE.BUY ? 'red' : 'green'
    },
    orderTypeText () {
      return this.order?.type === ORDER_TYPE.SELL
        ? this.$t('common.buy')
        : this.$t('common.sell')
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/mobile/orders/order-detail/info.scss">
</style>
