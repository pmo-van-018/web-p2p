<template>
  <div class="payments-table">
    <div v-if="isEmptyPayment" class="py-5">
      <NoData :title="$t('merchant.payments.label.no_data')" />
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
              <span :id="'edit'+item.id" role="button" class="icon-edit grey-400" @click="onEdit(item)" />
            </div>
          </div>
          <div class="payment-item_row d-flex justify-content-between">
            <div class="font-t14r grey-400">{{ $t('merchant.payments.label.bank_number') }}</div>
            <div class="text-right grey-900 font-t14r">{{ item.bankNumber }}</div>
          </div>
          <div class="payment-item_row d-flex justify-content-between">
            <div class="font-t14r grey-400">{{ $t('merchant.payments.label.bank_account') }}</div>
            <div class="text-right grey-900 font-t14r">{{ item.bankHolder }}</div>
          </div>
          <div class="payment-item_row d-flex justify-content-between">
            <div class="font-t14r grey-400" v-html="$t('merchant.payments.label.bank_branch_mb')" />
            <div class="text-right grey-900 font-t14r">{{ item.bankRemark }}</div>
          </div>
        </div>
      </template>
    </list-common>
    <!-- item -->
    <ModalConfirmEditBank :warning-text="warningText" :payment-method-id="paymentMethodId" />
  </div>
</template>

<script>

import payment from '@/mixins/payment/index';
import { MODAL } from '@/resources/modal';
import ModalConfirmEditBank from '@/components/common/modal/modal-confirm-edit-bank';
import { mapActions } from 'vuex';
import { CONFIRM_TYPE, RESPONSE_ICON } from '@/resources/message'

export default {
  components: {
    ModalConfirmEditBank,
    ListCommon: () => import('~/components/mobile/commons/list/index.vue')
  },
  mixins: [payment],
  data () {
    return {
      warningText: '',
      paymentMethodId: ''
    }
  },
  methods: {
    ...mapActions('modal-response', ['showResponseModal']),
    async onEdit (item) {
      const result = await this.getPaymentMethodAvailability(item.id)
      if (result.hasOrder) {
        this.showResponseModal({
          title: '',
          content: this.$t('modal.message.disable_update_payment'),
          description: this.$t('modal.message.CAN_NOT_STORE_PAYMENT_METHOD_WHEN_EXISTING_ORDER'),
          icon: RESPONSE_ICON.PAYMENT_METHOD_FAILED,
          show: true,
          confirmAction: this.$t('action.confirm'),
          confirmActionType: CONFIRM_TYPE.CLOSE
        })
        return;
      }
      if (result.hasPost) {
        this.warningText = this.$t('update_bank_modal.warning');
        this.paymentMethodId = item.id
        this.$bvModal.show(MODAL.CONFIRM_EDIT_BANK)
        return
      }
      this.setPaymentDetail(item)
      this.$bvModal.show(MODAL.ADD_BANK)
    }
  }
};
</script>

<style lang="scss" scoped src="static/assets/scss/components/mobile/merchant/payments/payments-table.scss" />
