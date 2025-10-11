<template>
  <div :class="['detail-card', { 'none-border': noBorder }]">
    <div class="title">{{ $t('merchant.transaction_detail.payment_methods') }}</div>
    <template v-if="isCancelStatus || isCompletedStatus && disablePaymentStatusCompleted">
      <div class="detail-card__cancelled">{{ $t('merchant.transaction_detail.note_cancelled_admin') }}</div>
    </template>
    <template v-else>
      <template v-if="isCancelStatus && !isShowAll">
        <div class="detail-card__cancelled">{{ $t('merchant.transaction_detail.note_cancelled') }}</div>
      </template>
      <template v-else-if="isCompletedStatus && !isShowAll">
        <div class="detail-card__info">
          <div class="detail-card__payment-info">{{ $t('merchant.transaction_detail.buyer_paid_to_you') }}</div>
          <div class="detail-card__payment-content">
            <div class="detail-card__payment-wrapper">
              <p class="detail-card__content">{{ $t('label.transfer_contents') }}</p>
              <p class="detail-card__content detail-card__content--grey">{{ bankNote }}</p>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="detail-card__wrapper">
          <div class="info-list">
            <div class="row-info">
              <div class="label">{{ $t('merchant.transaction_detail.bank_name') }}</div>
              <div class="value bank-name"><img :src="bankIcon" alt="Bank">{{ bankName }}</div>
            </div>
            <div class="row-info">
              <div class="label">{{ $t('merchant.transaction_detail.account_no') }}</div>
              <div class="value">
                <span>{{ bankNumber }}</span> <CopyButton v-if="bankNumber" id="detail-method-bank-number" :value="bankNumber" />
              </div>
            </div>
            <div class="row-info">
              <div class="label">{{ $t('merchant.transaction_detail.account_name') }}</div>
              <div class="value"><span>{{ bankAccountName }}</span> <CopyButton v-if="bankAccountName" id="detail-method-bank-account" :value="bankAccountName" /></div>
            </div>
            <div class="row-info">
              <div class="label">{{ $t('label.amount_money') }}</div>
              <div class="value">₫ {{ amount | formatMoney }}<CopyButton v-if="amount" id="detail-method-amount" :value="amount" /></div>
            </div>
            <div class="row-info">
              <div class="label">
                <span>{{ $t('merchant.transaction_detail.bank_note') }}</span>
                <span v-b-tooltip.hover class="ml-1 icon-info info-block__icon" :title="$t('transfer_seller.info.note_transfer_contents')" />
              </div>
              <div class="value">
                <span class="note">{{ bankNote }}</span> <CopyButton v-if="bankNote" id="detail-method-bank-note" :value="bankNote" />
              </div>
            </div>
          </div>
          <BankQrCode v-if="isVisibleQrCode" :qr-code-url="orderDetail.bankQrCode" :show-note="$device.isMobile" />
        </div>
      </template>
    </template>
  </div>
</template>
<script>
import CopyButton from '@/components/common/copy-button.vue'
import { BANK } from '@/resources/bank.js'
import { ORDER_STATUS, POST_TYPE } from '@/config/constant'
import BankQrCode from '@/components/common/transfer-to-seller/transfer-info/bank-qrcode.vue'

export default {
  components: { CopyButton, BankQrCode },
  props: {
    orderDetail: {
      type: Object,
      default: () => ({})
    },
    noBorder: {
      type: Boolean,
      default: false
    },
    isShowAll: {
      type: Boolean,
      default: false
    },
    isShowQrCode: {
      type: Boolean,
      default: true
    },
    disablePaymentStatusCompleted: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    bankAccountName () {
      return this.orderDetail.bankAccountName ? this.orderDetail.bankAccountName.toUpperCase() : ''
    },
    bankNumber () {
      return this.orderDetail.bankNumber ? this.orderDetail.bankNumber : ''
    },
    bankName () {
      return BANK.find(e => e.bankName === this.orderDetail?.bankName)?.name || ''
    },
    bankIcon () {
      return BANK.find(e => e.bankName === this.orderDetail?.bankName)?.icon
    },
    bankNote () {
      return this.orderDetail.transCode || ''
    },
    amount () {
      return this.orderDetail.totalPrice ? this.orderDetail.totalPrice : ''
    },
    isCancelStatus () {
      return this.orderDetail?.status === ORDER_STATUS.CANCELLED
    },
    isCompletedStatus () {
      return this.orderDetail?.status === ORDER_STATUS.COMPLETED
    },
    isVisibleQrCode () {
      return this.orderDetail?.postType === POST_TYPE.BUY && this.isShowQrCode
    }
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/merchant/order-detail/order-info.scss" />
