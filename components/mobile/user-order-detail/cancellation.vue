<template>
  <div class="cancellation">
    <div class="cancellation__header">
      <div class="user-order-info">
        <div class="user-order-info__type" :class="orderTypeClass">
          {{ orderText }} <span>({{ order?.assetName }})</span>
        </div>
        <div class="user-order-info__text">{{ order?.type === "BUY" ? $t('common.from') : $t('common.to') }}</div>
        <div class="user-order-info__nickname">{{ order?.managerName }}</div>
      </div>
      <OrderInfo :order-id="orderId" :time="createdTime" />
    </div>
    <div class="cancellation__content mt-4">
      <div class="cancellation__content-item">
        <order-description-header :order="order" />
      </div>
      <div class="cancellation__content-item">
        <layout-info :title="$t('transfer_seller.info.label.transaction_info')">
          <order-information :order-info="order" />
        </layout-info>
      </div>
      <div class="cancellation__content-item">
        <layout-info :title="$t('transfer_seller.cancel.label.payment_methods')">
          <div class="font-t12r">
            {{ $t('transfer_seller.cancel.info_seller') }}
          </div>
        </layout-info>
      </div>
      <div v-if="contentMessageSystem" class="cancellation__content-item">
        <layout-info :title="$t('transfer_seller.info.label.message_system')">
          <message-order :content="contentMessageSystem" />
        </layout-info>
      </div>
      <div v-if="orderTypeText" class="cancellation__text-inner">
        <nuxt-link class="cancellation__text-link" :to="linkRedirectHome">{{ orderTypeText }}</nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
import OrderInfo from '@/components/common/transfer-to-seller/order-info.vue';
import { ORDER_BUY_STEP, ORDER_SELL_STEP } from '@/resources/transfer-to-seller/index.js';
import { ORDER_TYPE } from '@/resources/order-type.js';
import { FULL_DATE_FORMAT } from '@/config/constant'
import completionMixin from '@/mixins/user-order-detail/completion'
import dayjs from 'dayjs'

export default {
  components: {
    OrderInfo,
    OrderDescriptionHeader: () => import('~/components/desktop/orders/order-description-header/index.vue'),
    LayoutInfo: () => import('~/components/mobile/orders/layout-info/index.vue'),
    OrderInformation: () => import('~/components/mobile/orders/order-info/index.vue'),
    MessageOrder: () => import('~/components/desktop/orders/message-order/index.vue')
  },
  mixins: [completionMixin],
  props: {
    order: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    isBuyOrder () {
      return this.orderInfo?.type === ORDER_TYPE.BUY
    },
    isCancelledBuyUser () {
      return this.order?.step === ORDER_BUY_STEP.BUY_ORDER_CANCELLED_BY_USER.name
    },
    isCancelledSellUser () {
      return this.order?.step === ORDER_SELL_STEP.SELL_ORDER_CANCELLED_BY_USER.name
    },
    createdTime () {
      if (!this.order || !this.order.createdTime) {
        return ''
      }
      return dayjs(this.order.createdTime).format(FULL_DATE_FORMAT)
    },
    title () {
      return this.isCancelledBuyUser
        ? this.$t('transfer_seller.cancel.label.title')
        : this.isCancelledSellUser
          ? this.$t('end_user_sell.note.transfer_cancel.title')
          : this.$t('transfer_seller.note.transfer_cancel_system.title')
    },
    subTitle () {
      return this.isCancelledBuyUser
        ? this.$t('transfer_seller.cancel.label.sub_title')
        : this.$t('transfer_seller.note.transfer_cancel_system.title')
    },
    orderId () {
      return this.order?.id || ''
    }
  },
  mounted () {
    this.$bvModal.hide('modalPaymentCancellation')
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/mobile/user-order-detail/payment-info.scss" />
