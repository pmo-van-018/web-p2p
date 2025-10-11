<template>
  <div class="order-info">
    <div class="order-info__container">
      <template v-if="isCancelStatus || isCompletedStatus && disablePaymentStatusCompleted">
        <div v-if="isShowHeader" class="order-info__head">
          <div class="order-info__title">{{ $t('merchant.transaction_detail.payment_methods') }}</div>
        </div>
        <div class="order-info__cancelled">{{ $t('merchant.transaction_detail.note_cancelled_admin') }}</div>
      </template>
      <template v-else>
        <template v-if="isCancelStatus && !isShowAll">
          <div v-if="isShowHeader" class="order-info__head">
            <div class="order-info__title">{{ $t('merchant.transaction_detail.payment_methods') }}</div>
          </div>
          <div class="order-info__cancelled">{{ $t('merchant.transaction_detail.note_cancelled') }}</div>
        </template>
        <template v-else-if="isCompletedStatus && !isShowAll">
          <div v-if="isShowHeader" class="order-info__head">
            <div class="order-info__title">{{ $t('merchant.transaction_detail.payment_methods') }}</div>
          </div>
          <div class="order-info__completed">
            <div class="order-info__completed-info">{{ $t('merchant.transaction_detail.buyer_paid_to_you') }}</div>
            <div class="order-info__completed-content">
              <div class="order-info__completed-wrapper">
                <p class="order-info__completed-text">{{ $t('label.transfer_contents') }}</p>
                <p class="order-info__completed-text order-info__completed-text--grey">{{ bankNote }}</p>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div v-if="isShowQrCode && !isShowHeader" class="order-info__qr-code">
            <bank-qr-code v-if="isVisibleQrCode" :qr-code-url="order.bankQrCode" :show-note="false" :size="144" />
          </div>
          <div v-if="isShowHeader" class="order-info__head">
            <div class="d-flex align-items-center justify-content-between">
              <div class="order-info__title">{{ $t('merchant.transaction_detail.payment_methods') }}</div>
              <base-button v-if="isVisibleQrCode" variants="text" @click="onOpenPaymentDetail">
                <span class="icon-qrcode"></span>
              </base-button>
            </div>
          </div>
          <div class="order-info__body">
            <div class="order-info__inner">
              <div class="order-info__left">
                <div class="order-info__content">
                  {{ $t('merchant.transaction_detail.bank_name') }}
                </div>
              </div>
              <div class="order-info__right">
                <div class="order-info__bank">
                  <img class="order-info__bank-img" :src="bankIcon" alt="Bank">
                  <span class="font-t12m grey-900">{{ bankName }}</span>
                </div>
              </div>
            </div>

            <div class="order-info__inner">
              <div class="order-info__left">
                <div class="order-info__content">
                  {{ $t('merchant.transaction_detail.account_no') }}
                </div>
              </div>
              <div class="order-info__right">
                <div class="order-info__text">
                  <span>{{ bankNumber }}</span>
                  <copy-button v-if="bankNumber" id="detail-method-bank-number" :value="bankNumber" />
                </div>
              </div>
            </div>

            <div class="order-info__inner">
              <div class="order-info__left">
                <div class="order-info__content">
                  {{ $t('merchant.transaction_detail.account_name') }}
                </div>
              </div>
              <div class="order-info__right">
                <div class="order-info__text">
                  <span>{{ bankAccountName }}</span>
                  <copy-button v-if="bankAccountName" id="detail-method-bank-account" :value="bankAccountName" />
                </div>
              </div>
            </div>

            <div class="order-info__inner">
              <div class="order-info__left">
                <div class="order-info__content">
                  {{ $t('label.amount_money') }}
                </div>
              </div>
              <div class="order-info__right">
                <div class="order-info__text">
                  {{ fiatSymbol }} {{ amount | formatMoney }}<copy-button v-if="amount" id="detail-method-amount" :value="amount" />
                </div>
              </div>
            </div>

            <div class="order-info__inner">
              <div class="order-info__left">
                <div class="order-info__content">
                  <div class="d-flex align-items-center">
                    <span class="mr-1">{{ $t('merchant.transaction_detail.bank_note') }}</span>
                    <span v-b-tooltip.hover class="icon-info" :title="$t('transfer_seller.info.note_transfer_contents')" />
                  </div>
                </div>
              </div>
              <div class="order-info__right">
                <div class="order-info__text">
                  <span>{{ bankNote }}</span> <copy-button v-if="bankNote" id="detail-method-bank-note" :value="bankNote" />
                </div>
              </div>
            </div>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>
<script>
import { BANK } from '@/resources/bank.js'
import { ORDER_STATUS } from '@/config/constant'
import { MODAL } from '@/resources/modal'
import { ORDER_TYPE } from '@/resources/order-type'

export default {
  components: {
    CopyButton: () => import('~/components/common/copy-button.vue'),
    BaseButton: () => import('~/components/common/base-button/index.vue'),
    BankQrCode: () => import('~/components/common/transfer-to-seller/transfer-info/bank-qrcode.vue')
  },
  props: {
    order: {
      type: Object,
      default: () => ({})
    },
    isShowQrCode: {
      type: Boolean,
      default: false
    },
    isShowHeader: {
      type: Boolean,
      default: true
    },
    isShowAll: {
      type: Boolean,
      default: false
    },
    disablePaymentStatusCompleted: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    bankAccountName () {
      return this.order.bankAccountName ? this.order.bankAccountName.toUpperCase() : ''
    },
    fiatSymbol () {
      return this.order?.fiatSymbol || ''
    },
    bankNumber () {
      return this.order?.bankNumber || ''
    },
    bankName () {
      return BANK.find(e => e.bankName === this.order?.bankName)?.name || ''
    },
    bankIcon () {
      return BANK.find(e => e.bankName === this.order?.bankName)?.icon
    },
    bankNote () {
      return this.order?.transCode || ''
    },
    amount () {
      return this.order?.totalPrice || ''
    },
    isCancelStatus () {
      return this.order?.status === ORDER_STATUS.CANCELLED
    },
    isCompletedStatus () {
      return this.order?.status === ORDER_STATUS.COMPLETED
    },
    isVisibleQrCode () {
      return this.order?.type === ORDER_TYPE.SELL && this.isShowQrCode
    }
  },
  methods: {
    onOpenPaymentDetail () {
      this.$bvModal.show(MODAL.PAYMENT_DETAIL_INFO)
    }
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/mobile/orders/order-detail/info.scss">
</style>
