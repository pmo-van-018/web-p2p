<template>
  <div class="cancellation">
    <order-description-header :order="order" class="cancellation__inner mt-4" />
    <LayoutTitle :title="$t('transfer_seller.cancel.label.transaction_info')" class="cancellation__inner">
      <CommandInfo :order-info="order" style-card="grey" />
    </LayoutTitle>
    <LayoutTitle :title="$t('transfer_seller.cancel.label.payment_methods')" :class="{'hide-border': !isCancelledBuyUser}" class="cancellation__inner">
      <BoxInfo :title="$t('transfer_seller.cancel.info_seller')" />
    </LayoutTitle>
    <LayoutTitle v-if="contentMessageSystem" :title="$t('transfer_seller.info.label.message_system')" class="cancellation__inner">
      <message-order :content="contentMessageSystem" />
    </LayoutTitle>
    <div v-if="orderTypeText" class="cancellation__text-inner">
      <nuxt-link class="cancellation__text-link" :to="linkRedirectHome">{{ orderTypeText }}</nuxt-link>
    </div>
  </div>
</template>

<script>
import BoxInfo from '@/components/common/transfer-to-seller/box-info.vue';
import CommandInfo from '@/components/common/command-info.vue';
import LayoutTitle from '@/components/common/layout-title.vue';
import { ORDER_BUY_STEP } from '@/resources/transfer-to-seller/index.js';
import completionMixin from '@/mixins/user-order-detail/completion'

export default {
  components: {
    BoxInfo,
    CommandInfo,
    LayoutTitle,
    OrderDescriptionHeader: () => import('~/components/desktop/orders/order-description-header/index.vue'),
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
    isCancelledBuyUser () {
      return this.order?.step === ORDER_BUY_STEP.BUY_ORDER_CANCELLED_BY_USER.name
    }
  },
  mounted () {
    this.$bvModal.hide('modalPaymentCancellation')
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/user-order-detail/cancellation.scss">
</style>
