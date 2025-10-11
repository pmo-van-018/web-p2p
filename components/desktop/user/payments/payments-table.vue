<template>
  <div class="payments-table">
    <div class="t-head font-t14r grey-400">
      <div class="bank-name">{{ $t('user.payments.label.bank_name') }}</div>
      <div class="bank-number">{{ $t('user.payments.label.bank_number') }}</div>
      <div class="bank-account">{{ $t('user.payments.label.bank_account') }}</div>
      <div class="bank-branch">{{ $t('user.payments.label.bank_branch') }}</div>
    </div>
    <div v-if="isEmptyPayment" class="py-5">
      <NoData :title="$t('user.payments.label.no_data')" />
    </div>
    <div class="t-body grey-900 font-t14r payments-table__body">
      <div v-for="(item, index) in paymentView" :key="index" class="payment-item">
        <div class="t-col bank-name">
          <img :src="getBankFromBankName(item.bankName)?.icon">
          {{ getBankFromBankName(item.bankName)?.name }}
        </div>
        <div class="t-col bank-number">{{ item.bankNumber }}</div>
        <div class="t-col bank-account">{{ item.bankHolder }}</div>
        <div class="t-col bank-branch">
          <span>{{ item.bankRemark }}</span>
          <div class="d-flex tool">
            <svg-icon v-b-tooltip.hover :title="$t('user.payments.label.edit')" icon="edit" @click="onEdit(item)" />
            <svg-icon v-b-tooltip.hover :title="$t('user.payments.label.delete')" icon="delete" @click="onDelete(item)" />
          </div>
        </div>
      </div>
    </div>
    <div v-if="isShowPagination" class="payments-table__pagination">
      <pagination-limit
        :page="page"
        :limit="limit"
        :total="total"
        @set-limit="onChangeLimit"
        @set-page="onChangePagination"
      />
    </div>
    <ModalDeleteBank :warning-text="warningText" @on-success="onDeleteSuccess" />
  </div>
</template>

<script>
import ModalDeleteBank from '@/components/common/modal/modal-delete-bank.vue';
import payment from '@/mixins/payment/index';
export default {
  components: {
    ModalDeleteBank,
    SvgIcon: () => import('~/components/common/svg-icon/index.vue'),
    PaginationLimit: () => import('~/components/desktop/commons/pagination-limit/index.vue')
  },
  mixins: [payment],
  data () {
    return {
      warningText: ''
    }
  },
  methods: {
    async onDelete (item) {
      this.warningText = this.$t('delete_bank_modal.note');
      await this.setPaymentId(item)
      this.$bvModal.show(this.MODAL.DELETE_BANK);
    }
  }
};
</script>

<style lang="scss" scoped src="static/assets/scss/components/desktop/merchant/payments/payments-table.scss" />
