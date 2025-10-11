<template>
  <div class="detail-card">
    <div class="title">{{ $t('merchant.transaction_detail.payment_methods') }}</div>
    <div class="row-info">
      <div class="label">{{ $t('merchant.transaction_detail.bank_name') }}</div>
      <div class="value"><img :src="bankIcon">{{ bankName }}</div>
    </div>
    <div class="row-info">
      <div class="label">{{ $t('merchant.transaction_detail.account_no') }}</div>
      <div class="value">
        {{ bankNumber }}
      </div>
    </div>
    <div class="row-info">
      <div class="label">{{ $t('merchant.transaction_detail.account_name') }}</div>
      <div class="value">{{ bankAccountName }}</div>
    </div>
    <div class="row-info">
      <div class="label">{{ $t('label.amount_money') }}</div>
      <div class="value">₫ {{ amount | formatMoney }}<CopyButton v-if="amount" id="detail-method-amount" :value="amount" /></div>
    </div>
    <div class="row-info">
      <div class="label">{{ $t('merchant.transaction_detail.bank_note') }}</div>
      <div class="value">
        {{ bankNote }} <CopyButton v-if="bankNote" id="detail-method-bank-note" :value="bankNote" />
      </div>
    </div>
  </div>
</template>
<script>
import CopyButton from '@/components/common/copy-button.vue';
import { BANK } from '@/resources/bank.js';
export default {
  components: { CopyButton },
  props: {
    orderDetail: {
      type: Object,
      default: () => ({})
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
      return BANK.find(e => e.bankName === this.bankName)?.icon
    },
    bankNote () {
      return this.orderDetail.transCode || ''
    },
    amount () {
      return this.orderDetail.totalPrice ? this.orderDetail.totalPrice : ''
    }
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/merchant/order-detail/order-info.scss" />
