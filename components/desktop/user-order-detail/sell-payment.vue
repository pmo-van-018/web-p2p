<template>
  <div class="sell-payment">
    <LayoutTitle :title="$t('transfer_seller.completed.label.transaction_info')">
      <CommandInfo :order-info="order" />
    </LayoutTitle>
    <LayoutTitle :title="paymentMethodTitle">
      <InfoBlock :list-info="listInfo" show-note highlight :note="order?.note" />
    </LayoutTitle>
    <LayoutTitle :title="$t('transfer_seller.completed.label.deposit_order')">
      <TransferStatus :transaction="lastTransaction" />
    </LayoutTitle>
    <AppealSecret v-if="secret" :secret="secret" />
    <CountdownAction
      :time-left="timeLeft"
      :title="countDownText.title"
      :sub-title="countDownText.sub"
      :appeal-end-time="appealEndTime"
      :is-warning="isEnableAppealSentFiatByMerchant"
      :is-visible-time-out="isVisibleTimeOut"
      :class-countdown="isEnableAppealSentFiatByMerchant ? 'warning' : ''"
      @get-current-time="$_sellPaymentMixin_getCurrentTime"
      @time-out="$_sellPaymentMixin_onTimeOut"
    >
      <div class="sell-payment__action">
        <template v-if="isPaidOrder">
          <base-button
            variants="contained"
            color="primary"
            :disabled="isUserSendSuccess"
            @click="getAppealGroup"
          >
            {{ $t('action.contact_buyer') }}
          </base-button>
          <base-button
            v-if="isEnableContactAdmin"
            variants="text"
            color="primary"
            :disabled="isUserSendSuccess"
            @click="contactAdmin"
          >
            {{ $t('end_user_sell.waiting.label.contact_admin') }}
          </base-button>
        </template>
        <template v-else-if="!isAppealing">
          <base-button variants="contained" color="primary" @click="$_sellPaymentMixin_submitPayment">
            {{ $t('action.received_enough_money') }}
          </base-button>
          <base-button variants="text" color="primary" @click="checkStatusToContact">
            {{ contactText }}
          </base-button>
        </template>
      </div>
    </CountdownAction>
    <ModalAppeal
      ref="modalAppeal"
      :order="order"
      :is-contact-admin="isContactAdmin"
      @contact-admin="data => $emit('action', data)"
    />
    <loading v-if="isLoading" />
  </div>
</template>

<script>
import CommandInfo from '@/components/common/command-info.vue';
import CountdownAction from '@/components/common/countdown-action.vue';
import InfoBlock from '@/components/common/info-block.vue';
import LayoutTitle from '@/components/common/layout-title.vue';
import TransferStatus from '@/components/common/transfer-to-seller/transfer-status.vue';
import sellPaymentMixin from '@/mixins/user-order-detail/sell-payment'
import ModalAppeal from '@/components/common/modal/modal-appeal.vue';
import { SELL_ORDER_STEPS } from '@/constants/orders';
import AppealSecret from '@/components/common/appeal-telegram/appeal-secret.vue'
import { mapState } from 'vuex'

export default {
  components: {
    AppealSecret,
    CommandInfo,
    CountdownAction,
    InfoBlock,
    LayoutTitle,
    TransferStatus,
    ModalAppeal,
    BaseButton: () => import('~/components/common/base-button/index.vue')
  },
  mixins: [sellPaymentMixin],
  computed: {
    ...mapState('end-user', ['secretKey']),
    countDownText () {
      let title = '';
      let sub = ''
      if (this.order?.step === SELL_ORDER_STEPS.SELL_SENDING_CRYPTO_SUCCESS) {
        title = this.$t('end_user_sell.waiting.label.wait_buyer')
      }
      if (this.order?.step === SELL_ORDER_STEPS.SELL_SENDING_CRYPTO_SUCCESS_DEAL_TIME) {
        if (this.timeLeft) {
          title = this.$t('end_user_sell.waiting.label.appeal_buyer')
          sub = this.$t('end_user_sell.waiting.label.appeal_enabled')
        } else {
          title = this.$t('end_user_sell.waiting.label.wait_buyer_timeout')
          sub = this.$t('end_user_sell.waiting.label.appeal_admin_enabled')
        }
      }
      if (this.order?.step === SELL_ORDER_STEPS.SELL_NOTIFY_SENT_FIAT_BY_MERCHANT_DEAL_TIME) {
        title = this.$t('end_user_sell.waiting.label.confirm_transaction')
        sub = this.$t('user_orders.process.SELL_NOTIFY_SENT_FIAT_BY_MERCHANT_DEAL_TIME')
      }
      if (this.order?.step === SELL_ORDER_STEPS.SELL_ENABLE_APPEAL_NOTIFY_SENT_FIAT_BY_MERCHANT) {
        title = this.$t('end_user_sell.waiting.label.auto_complete')
        sub = this.$t('end_user_sell.waiting.label.buyer_sent')
      }
      if (this.order?.step === SELL_ORDER_STEPS.SELL_APPEAL_SENT_FIAT_NOT_RECEIVED_BY_USER) {
        title = this.appealLimitText
        sub = this.$t('appeal.desc')
      }
      return { title, sub }
    },
    secret () {
      return this.order?.appeal?.secret || this.secretKey
    }
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/user-order-detail/sell-payment.scss" />
