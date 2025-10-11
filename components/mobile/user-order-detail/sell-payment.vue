<template>
  <div class="sell-payment">
    <div class="sell-payment__header">
      <CountdownAction
        :time-left="timeLeft"
        :title="title"
        :sub-title="titleCountDown"
        :appeal-end-time="appealEndTime"
        class="mobile"
        is-mobile
        :is-warning="isEnableAppealSentFiatByMerchant"
        :is-visible-time-out="isVisibleTimeOut"
        :class-countdown="`sell-payment-custom countdown-action-mobile big-title ${isEnableAppealSentFiatByMerchant ? 'warning' : ''}`"
        @get-current-time="$_sellPaymentMixin_getCurrentTime"
        @time-out="$_sellPaymentMixin_onTimeOut"
      />
      <OrderInfo :order-id="orderId" :time="createdTime" />
    </div>
    <div class="sell-payment__content">
      <LayoutTitle :title="$t('transfer_seller.info.label.transaction_info')" class="mobile">
        <CommandInfo :order-info="order" class="mobile" />
      </LayoutTitle>
      <div class="sell-payment__highlight">
        <LayoutTitle :title="paymentMethodTitle" class="mobile">
          <InfoBlock :list-info="listInfo" is-mobile highlight />
        </LayoutTitle>
      </div>
      <BankNote
        v-if="order.note"
        class="payment-info__payment-methods-item"
        display-expand
        :note="order.note"
      />
      <LayoutTitle :title="$t('transfer_seller.completed.label.deposit_order')" class="mobile">
        <TransferStatus :transaction="lastTransaction" />
      </LayoutTitle>
      <AppealSecret v-if="secret" :secret="secret" />
      <div class="sell-payment__action">
        <template v-if="isPaidOrder">
          <base-button v-if="isEnableContactAdmin" variants="text" class="sell-payment__action-contact" color="primary" @click="contactAdmin">
            {{ $t('end_user_sell.waiting.label.contact_admin') }}
          </base-button>
          <base-button
            :disabled="isUserSendSuccess"
            full-width
            variants="contained"
            color="primary"
            @click="getAppealGroup"
          >
            {{ $t('action.contact_buyer') }}
          </base-button>
        </template>
        <template v-else-if="isAppealing">
          <base-button
            full-width
            variants="contained"
            color="blue"
            @click="openChatFrame"
          >
            {{ $t('action.join_appeal') }}
          </base-button>
        </template>
        <template v-else>
          <base-button variants="text" class="sell-payment__action-contact p-0" color="primary" @click="checkStatusToContact">
            {{ contactText }}
          </base-button>
          <base-button variants="contained" full-width color="primary" @click="$_sellPaymentMixin_submitPayment">
            {{ $t('action.received_enough_money') }}
          </base-button>
        </template>
      </div>
    </div>
    <ModalAppeal
      ref="modalAppeal"
      :order="order"
      :is-contact-admin="isContactAdmin"
      is-mobile
      @contact-admin="data => $emit('action', data)"
    />
  </div>
</template>

<script>
import BankNote from '@/components/common/transfer-to-seller/transfer-info/bank-note.vue';
import CommandInfo from '@/components/common/command-info.vue';
import CountdownAction from '@/components/common/countdown-action.vue';
import InfoBlock from '@/components/common/info-block.vue';
import LayoutTitle from '@/components/common/layout-title.vue';
import OrderInfo from '@/components/common/transfer-to-seller/order-info.vue';
import TransferStatus from '@/components/common/transfer-to-seller/transfer-status.vue';
import sellPaymentMixin from '@/mixins/user-order-detail/sell-payment';
import ModalAppeal from '@/components/common/modal/modal-appeal.vue';
import { SELL_ORDER_STEPS } from '@/constants/orders';
import { FULL_DATE_FORMAT } from '@/config/constant'
import { mapState } from 'vuex'
import dayjs from 'dayjs'
import AppealSecret from '@/components/common/appeal-telegram/appeal-secret.vue'

export default {
  components: {
    AppealSecret,
    CommandInfo,
    CountdownAction,
    InfoBlock,
    LayoutTitle,
    OrderInfo,
    TransferStatus,
    ModalAppeal,
    BankNote,
    BaseButton: () => import('~/components/common/base-button/index.vue')
  },
  mixins: [sellPaymentMixin],
  computed: {
    ...mapState('chat', ['chatNoti']),
    ...mapState('end-user', ['secretKey']),
    title () {
      if (this.isAppealing) {
        return this.$t('end_user_sell.waiting.label.request_admin')
      }
      return this.isPaidOrder ? this.$t('end_user_sell.label.waiting') : this.$t('common.status.confirm')
    },
    titleCountDown () {
      if (this.order?.step === SELL_ORDER_STEPS.SELL_SENDING_CRYPTO_SUCCESS) {
        return this.$t('end_user_sell.waiting.label.wait_buyer')
      }
      if (this.order?.step === SELL_ORDER_STEPS.SELL_SENDING_CRYPTO_SUCCESS_DEAL_TIME) {
        if (this.timeLeft) {
          return this.$t('end_user_sell.waiting.label.appeal_enabled')
        } else {
          return this.$t('end_user_sell.waiting.label.appeal_admin_enabled')
        }
      }
      if (this.order?.step === SELL_ORDER_STEPS.SELL_NOTIFY_SENT_FIAT_BY_MERCHANT_DEAL_TIME) {
        return this.$t('end_user_sell.waiting.label.confirm_transaction')
      }
      if (this.order?.step === SELL_ORDER_STEPS.SELL_ENABLE_APPEAL_NOTIFY_SENT_FIAT_BY_MERCHANT) {
        return this.$t('end_user_sell.waiting.label.auto_complete')
      }
      if (this.order?.step === SELL_ORDER_STEPS.SELL_APPEAL_SENT_FIAT_NOT_RECEIVED_BY_USER) {
        return this.appealLimitText
      }
      return ''
    },
    createdTime () {
      if (!this.order || !this.order.createdTime) {
        return ''
      }
      return dayjs(this.order.createdTime).format(FULL_DATE_FORMAT)
    },
    orderId () {
      return this.order?.id || ''
    },
    secret () {
      return this.order?.appeal?.secret || this.secretKey
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/mobile/user-order-detail/payment-info.scss" />
