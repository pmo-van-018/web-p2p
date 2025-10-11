<template>
  <div class="payment-info">
    <div class="payment-info__header">
      <CountdownAction
        :time-left="timeLeft"
        :title="titleCountDown"
        :sub-title="subTitleCountDown"
        class="mobile"
        :class-countdown="`countdown-action-mobile ${isBuyEnableWhileSending ? 'warning' : 'big-title'}`"
        :is-warning="isBuyEnableWhileSending"
        :appeal-end-time="appealEndTime"
        :is-visible-time-out="isVisibleTimeOut"
        :is-visible-mercy-loading="buyStepMercy || sellStepMercy"
        is-mobile
        @get-current-time="$_toBePaid_getCurrentTime"
      />
      <OrderInfo :order-id="orderId" :time="createdTime" />
    </div>
    <div class="payment-info__content">
      <LayoutTitle :title="$t('transfer_seller.info.label.transaction_info')" class="mobile">
        <CommandInfo :order-info="order" class="mobile" style-card="grey" />
      </LayoutTitle>
      <LayoutTitle :title="$t('transfer_seller.info.label.payment_methods')" class="mobile hide-border flex-grow-1">
        <div class="payment-info__payment-methods">
          <div class="payment-info__highlight">
            <InfoBlock tooltip-class="payment-info__tooltip" :list-info="listInfo" class="payment-info__payment-methods-item mobile" />
            <BankQrCode :qr-code-url="order.bankQrCode" />
          </div>
        </div>
      </LayoutTitle>
      <BankNote
        v-if="order.note"
        class="payment-info__payment-methods-item"
        display-expand
        :note="order.note"
      />
      <Note :notes="$t('transfer_seller.info.notes')" class="payment-info__payment-methods-note mobile" display-expand />
      <AppealSecret v-if="secret" :secret="secret" />
      <div class="payment-info__action">
        <base-button
          v-if="!isUserRequestSupport"
          variants="text"
          color="primary"
          class="p-0 payment-info__button-cancelled"
          @click="$_toBePaid_cancelPayment"
        >
          {{ $t('action.cancel_transaction') }}
        </base-button>
        <base-button
          v-if="isContactMerchant"
          full-width
          variants="contained"
          color="primary"
          :disabled="isPaidWaitingConfirm"
          @click="getAppealGroup()"
        >
          {{ isDealingWhileNotPaid ? $t('action.transferred_contact_merchant') : $t('action.contact_merchant') }}
        </base-button>
        <base-button
          v-else-if="isBuyEnableWhileSending"
          variants="contained"
          color="danger"
          full-width
          @click="contactAdmin"
        >
          {{ $t('action.contact_support') }}
        </base-button>
        <base-button
          v-else-if="isUserRequestSupport"
          variants="contained"
          color="blue"
          full-width
          @click="openChatFrame"
        >
          <div class="d-flex align-items-center">
            <span class="payment-info__button-icon icon-complaint" />
            {{ $t('action.join_chat_appeal') }}
          </div>
        </base-button>
        <base-button
          v-else
          variants="contained"
          color="primary"
          size="small"
          full-width
          @click="$_toBePaid_submitPayment"
        >
          {{ $t('action.submit_transferred') }}
        </base-button>
      </div>
    </div>
    <ModalAppeal
      ref="modalAppeal"
      :order="order"
      :is-contact-admin="isContactAdmin"
      is-mobile
      @contact-admin="data => $emit('action', data)"
    />
    <loading v-if="isLoading" />
  </div>
</template>

<script>
import BankNote from '@/components/common/transfer-to-seller/transfer-info/bank-note.vue';
import BankQrCode from '@/components/common/transfer-to-seller/transfer-info/bank-qrcode.vue';
import CommandInfo from '@/components/common/command-info.vue';
import CountdownAction from '@/components/common/countdown-action.vue';
import InfoBlock from '@/components/common/info-block.vue';
import LayoutTitle from '@/components/common/layout-title.vue';
import ModalAppeal from '@/components/common/modal/modal-appeal.vue';
import Note from '@/components/common/transfer-to-seller/transfer-info/note.vue';
import OrderInfo from '@/components/common/transfer-to-seller/order-info.vue';
import toBePaidMixin from '@/mixins/user-order-detail/to-be-paid'
import { FULL_DATE_FORMAT } from '@/config/constant'
import { mapState } from 'vuex'
import dayjs from 'dayjs'
import AppealSecret from '@/components/common/appeal-telegram/appeal-secret.vue'

export default {
  components: {
    AppealSecret,
    BankNote,
    BankQrCode,
    CommandInfo,
    CountdownAction,
    InfoBlock,
    LayoutTitle,
    Note,
    OrderInfo,
    ModalAppeal,
    BaseButton: () => import('~/components/common/base-button/index.vue')
  },
  mixins: [toBePaidMixin],
  computed: {
    ...mapState('chat', ['chatNoti']),
    ...mapState('end-user', ['secretKey']),
    titleCountDown () {
      if (this.isDealingWhileNotPaid || this.isBuyEnableWhileSending) {
        return this.$t('transfer_seller.dealing.title_mb')
      } else if (this.isPaidWaitingConfirm || this.isPaidDealing) {
        return this.$t('transfer_seller.info.label.waiting_merchant_confirm_mb')
      } else if (this.isUserRequestSupport) {
        return this.$t('transfer_seller.note.transfer_requested_support.countdown_text')
      } else {
        return this.$t('action.pay_for_seller')
      }
    },
    subTitleCountDown () {
      if (this.isDealingWhileNotPaid || this.isPaidDealing) {
        return this.$t('transfer_seller.dealing.desc_mb')
      } else if (this.isBuyEnableWhileSending) {
        return this.$t('transfer_seller.note.transfer_waiting_end_time.countdown_text')
      } else if (this.isPaidWaitingConfirm) {
        return this.$t('transfer_seller.waiting.label.problem_transaction')
      } else if (this.isUserRequestSupport) {
        return this.$t('appeal.title', { durations: this.durations, unit: this.$t(`datetime_unit.${this.unit}`) })
      } else {
        return this.$t('transfer_seller.info.label.confirm_after_transfer')
      }
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
