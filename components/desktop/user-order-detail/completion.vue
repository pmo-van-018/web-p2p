<template>
  <div class="completion">
    <div class="completion__wrapper">
      <div class="completion__inner">
        <order-description-header :order="order" class="cancellation__inner" />
      </div>
      <div class="completion__inner">
        <LayoutTitle :title="$t('transfer_seller.info.label.transaction_info')">
          <CommandInfo :order-info="order" style-card="grey" />
        </LayoutTitle>
      </div>
      <div class="completion__inner">
        <LayoutTitle :title="$t('transfer_seller.completed.label.payment_methods')">
          <InfoBlock />
        </LayoutTitle>
      </div>
      <div class="completion__inner">
        <LayoutTitle :title="$t('transfer_seller.completed.label.deposit_order')">
          <TransferStatus :transaction="lastTransaction" class="completion__status" :class="{'completion__status--sell': !isBuyOrder}" />
        </LayoutTitle>
      </div>
      <div class="completion__inner">
        <LayoutTitle v-if="contentMessageSystem" :title="$t('transfer_seller.info.label.message_system')">
          <message-order :content="contentMessageSystem" />
        </LayoutTitle>
      </div>
    </div>
    <div v-if="orderTypeText" class="completion__text-inner">
      <nuxt-link class="completion__text-link" :to="linkRedirectHome">{{ orderTypeText }}</nuxt-link>
    </div>
  </div>
</template>

<script>
import TransferStatus from '@/components/common/transfer-to-seller/transfer-status.vue';
import completionMixin from '@/mixins/user-order-detail/completion'
import CommandInfo from '@/components/common/command-info.vue';
import InfoBlock from '@/components/common/info-block.vue';
import LayoutTitle from '@/components/common/layout-title.vue';
import sellPaymentMixin from '@/mixins/user-order-detail/sell-payment';

export default {
  components: {
    TransferStatus,
    CommandInfo,
    InfoBlock,
    LayoutTitle,
    OrderDescriptionHeader: () => import('~/components/desktop/orders/order-description-header/index.vue'),
    MessageOrder: () => import('~/components/desktop/orders/message-order/index.vue')
  },
  mixins: [sellPaymentMixin, completionMixin]
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/user-order-detail/completion.scss" />
