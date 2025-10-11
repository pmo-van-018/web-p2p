<template>
  <div class="payments-table">
    <div v-if="isEmptyPayment" class="py-5">
      <NoData :title="$t('user.payments.label.no_data')" />
    </div>
    <list-common
      :loading="loading"
      :items="paymentView"
      :total="total"
      key-field="id"
      :reset-list="page === 1"
      @refresh="getPayments"
      @infinite-loading="getMorePayment"
    >
      <template #default="{ item }">
        <div class="payment-item">
          <div class="payment-item_row d-flex justify-content-between">
            <div>
              <div class="bank-name grey-900 font-t14r"><img :src="getBankFromBankName(item.bankName)?.icon"> {{ getBankFromBankName(item.bankName)?.name }}</div>
            </div>
            <div>
              <svg-icon :id="'edit'+ item.id " icon="edit" class="payment-item__icon" @click="onEdit(item)" />
            </div>
          </div>
          <div class="payment-item_row d-flex justify-content-between">
            <div class="font-t14r grey-400">{{ $t('user.payments.label.bank_number') }}</div>
            <div class="payment-item__text-value text-right grey-900 font-t14r">{{ item.bankNumber }}</div>
          </div>
          <div class="payment-item_row d-flex justify-content-between">
            <div class="font-t14r grey-400">{{ $t('user.payments.label.bank_account') }}</div>
            <div class="payment-item__text-value text-right grey-900 font-t14r">{{ item.bankHolder }}</div>
          </div>
          <div class="payment-item_row d-flex justify-content-between">
            <div class="font-t14r grey-400">{{ $t('user.payments.label.bank_branch') }}</div>
            <div class="payment-item__text-value text-right grey-900 font-t14r">{{ item.bankRemark }}</div>
          </div>
        </div>
      </template>
    </list-common>
  </div>
</template>

<script>

import payment from '@/mixins/payment/index';
export default {
  components: {
    SvgIcon: () => import('~/components/common/svg-icon/index.vue'),
    ListCommon: () => import('~/components/mobile/commons/list/index.vue')
  },
  mixins: [payment]
};
</script>

<style lang="scss" scoped src="static/assets/scss/components/mobile/merchant/payments/payments-table.scss" />
