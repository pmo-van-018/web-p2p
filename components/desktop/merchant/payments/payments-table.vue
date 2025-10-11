<template>
  <div class="payments-table">
    <div class="t-head font-t14r grey-400">
      <div class="bank-name">{{ $t('merchant.payments.label.bank_name') }}</div>
      <div class="bank-number">{{ $t('merchant.payments.label.bank_number') }}</div>
      <div class="bank-account">{{ $t('merchant.payments.label.bank_account') }}</div>
      <div class="bank-branch">{{ $t('merchant.payments.label.bank_branch') }}</div>
    </div>
    <div v-if="isEmptyPayment" class="py-5">
      <NoData :title="$t('merchant.payments.label.no_data')" />
    </div>
    <div class="t-body grey-900 font-t14r">
      <div v-for="(item, index) in paymentView" :key="index" class="payment-item">
        <div class="t-col bank-name">
          <img :src="getBankFromBankName(item.bankName)?.icon" alt="bank icon">
          {{ getBankFromBankName(item.bankName)?.name }}
        </div>
        <div class="t-col bank-number">{{ item.bankNumber }}</div>
        <div class="t-col bank-account">{{ item.bankHolder }}</div>
        <div class="t-col bank-branch">
          <span>{{ item.bankRemark }}</span>
          <div class="d-flex tool">
            <svg-icon v-b-tooltip.hover :title="$t('merchant.payments.label.edit')" icon="edit" @click="onEdit(item)" />
            <svg-icon v-b-tooltip.hover :title="$t('merchant.payments.label.delete')" icon="delete" @click="onDelete(item)" />
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
    <ModalConfirmEditBank :warning-text="warningText" :payment-method-id="paymentMethodId" />
  </div>
</template>

<script>
import ModalDeleteBank from '@/components/common/modal/modal-delete-bank.vue';
import ModalConfirmEditBank from '@/components/common/modal/modal-confirm-edit-bank.vue';
import payment from '@/mixins/payment/index';
import { MODAL } from '@/resources/modal';
import { mapActions } from 'vuex';
import { CONFIRM_TYPE, RESPONSE_ICON } from '@/resources/message'

export default {
  components: {
    ModalDeleteBank,
    ModalConfirmEditBank,
    SvgIcon: () => import('~/components/common/svg-icon/index.vue'),
    PaginationLimit: () => import('~/components/desktop/commons/pagination-limit/index.vue')
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
      try {
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
        this.setPaymentDetail(item)
        if (result.hasPost) {
          this.warningText = this.$t('update_bank_modal.warning');
          this.paymentMethodId = item.id
          this.$bvModal.show(MODAL.CONFIRM_EDIT_BANK)
          return
        }
        this.$bvModal.show(MODAL.ADD_BANK)
      } catch (e) {
        console.error(e)
        this.showResponseModal({
          title: '',
          content: this.$t('modal.message.payment_update_failed'),
          description: this.$t('modal.message.error_system'),
          icon: RESPONSE_ICON.PAYMENT_METHOD_FAILED,
          show: true
        })
      }
    },
    async onDelete (item) {
      try {
        const result = await this.getPaymentMethodAvailability(item.id)
        if (result.hasOrder) {
          this.showResponseModal({
            title: '',
            content: this.$t('modal.message.disable_delete_payment'),
            description: this.$t('modal.message.CAN_NOT_STORE_PAYMENT_METHOD_WHEN_EXISTING_ORDER'),
            icon: RESPONSE_ICON.DELETE_PAYMENT_METHOD_FAILED,
            show: true
          })
          return
        }

        this.warningText = this.$t('delete_bank_modal.note');
        if (result.hasPost) {
          this.warningText = this.$t('delete_bank_modal.warning');
        }

        this.setPaymentId(item)
        this.$bvModal.show(this.MODAL.DELETE_BANK);
      } catch (e) {
        this.showResponseModal({
          title: '',
          content: this.$t('modal.message.payment_delete_failed'),
          description: this.$t('modal.message.error_system'),
          icon: RESPONSE_ICON.DELETE_PAYMENT_METHOD_FAILED,
          show: true
        })
      }
    }
  }
};
</script>

<style lang="scss" scoped src="static/assets/scss/components/desktop/merchant/payments/payments-table.scss" />
