<template>
  <div class="completion">
    <div class="completion__header">
      <div class="user-order-info">
        <div class="user-order-info__type" :class="orderTypeClass">
          {{ orderText }} <span>({{ order?.assetName }})</span>
        </div>
        <div class="user-order-info__text">{{ order?.type === "BUY" ? $t('common.from') : $t('common.to') }}</div>
        <div class="user-order-info__nickname">{{ order?.managerName }}</div>
      </div>
      <order-info :order-id="orderId" :time="createdTime" />
    </div>
    <div class="completion__wrapper">
      <div class="completion__inner">
        <order-description-header :order="order" />
      </div>
      <div class="completion__inner">
        <layout-info :title="$t('transfer_seller.info.label.transaction_info')">
          <order-information :order-info="order" />
        </layout-info>
      </div>
      <div class="completion__inner">
        <layout-info :title="$t('transfer_seller.cancel.label.payment_methods')">
          <div class="font-t12r">
            {{ $t('end_user_sell.info.payment.title') }}
          </div>
        </layout-info>
      </div>
      <div class="completion__inner">
        <layout-info :title="$t('transfer_seller.completed.label.deposit_order')">
          <TransferStatus :transaction="lastTransaction" class="completion__status" />
        </layout-info>
      </div>
      <div v-if="contentMessageSystem" class="completion__inner">
        <layout-info :title="$t('transfer_seller.info.label.message_system')">
          <message-order :content="contentMessageSystem" />
        </layout-info>
      </div>
    </div>
    <div v-if="orderTypeText" class="completion__text-inner text-center">
      <nuxt-link class="completion__text-link" :to="linkRedirectHome">{{ orderTypeText }}</nuxt-link>
    </div>
  </div>
</template>

<script>
import TransferStatus from '@/components/common/transfer-to-seller/transfer-status.vue';
import completionMixin from '@/mixins/user-order-detail/completion';

export default {
  components: {
    TransferStatus,
    OrderInfo: () => import('~/components/common/transfer-to-seller/order-info.vue'),
    OrderDescriptionHeader: () => import('~/components/desktop/orders/order-description-header/index.vue'),
    LayoutInfo: () => import('~/components/mobile/orders/layout-info/index.vue'),
    OrderInformation: () => import('~/components/mobile/orders/order-info/index.vue'),
    MessageOrder: () => import('~/components/desktop/orders/message-order/index.vue')
  },
  mixins: [completionMixin],
  computed: {
    orderId () {
      return this.order?.id || ''
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/mobile/user-order-detail/completion.scss" />
