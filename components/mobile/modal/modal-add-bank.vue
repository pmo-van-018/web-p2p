<template>
  <b-modal
    :id="MODAL.ADD_BANK"
    modal-class="modal-custom"
    centered
    hide-header
    hide-footer
    @show="onShowModal"
    @hide="onHideModal"
  >
    <div class="header d-flex align-items-center">
      <span class="header__icon icon-chevron-right1 mr-2 pr-1" @click="$bvModal.hide(MODAL.ADD_BANK)" />
      <span class="title">{{ getTitle }}</span>
      <div v-if="paymentDetail?.id" id="btn-delete" class="btn-delete">
        <svg-icon icon="delete" class="payment-delete-icon" @click="onDelete(paymentDetail)" />
        <b-tooltip
          target="btn-delete"
          triggers="hover"
        >
          {{ $t('merchant.payments.label.delete') }}
        </b-tooltip>
      </div>
    </div>
    <div class="content">
      <div class="row-info">
        <div class="label">{{ $t('add_bank_modal.name') }}</div>
        <BankSelector
          ref="formData.bankName"
          :bank-name="formData.bankName"
          :filter-banks="getSupportedBanks"
          :show-bank-number="false"
          @on-select="formData.bankName=$event"
        />
      </div>
      <div class="row-info">
        <BaseInputLabel
          ref="bankNumber"
          v-model="formData.bankNumber"
          class="input mb-0"
          required="required"
          :label="$t('add_bank_modal.number')"
          special-character
          :error-required="$t('add_bank_modal.validator.bank')"
          :placeholder="$t('add_bank_modal.placeholder_number')"
          :max-length="20"
          :error-max-length="$t('add_bank_modal.validator.bank_number_max_length')"
          class-name="add-bank-custom"
          type="text"
        />
      </div>
      <div class="row-info">
        <BaseInputLabel
          ref="bankHolder"
          v-model="formData.bankHolder"
          class="input mb-0"
          required="required"
          :label="$t('add_bank_modal.holder')"
          full-name-character
          :error-full-name-character="$t('add_bank_modal.validator.name_special')"
          :placeholder="$t('add_bank_modal.placeholder_holder')"
          type="text"
          :error-required="$t('add_bank_modal.validator.name')"
          :max-length="32"
          :error-max-length="$t('add_bank_modal.validator.common_max_length')"
          class-name="add-bank-custom"
          @input="() => formData.bankHolder = formData.bankHolder.toUpperCase()"
        />
      </div>
      <div class="row-info">
        <BaseInputLabel
          ref="bankRemark"
          v-model="formData.bankRemark"
          class="input mb-0"
          :max-length="32"
          :error-max-length="$t('add_bank_modal.validator.common_max_length')"
          :label="$t('add_bank_modal.branch')"
          :placeholder="$t('add_bank_modal.placeholder_branch')"
          type="text"
        />
      </div>
      <div class="row-info">
        <div class="note">
          <span class="icon-question" />
          <div class="note-text">{{ $t('add_bank_modal.note') }}</div>
        </div>
        <form-checkbox
          class="add-bank-checkbox"
          aria-describedby="selected"
          aria-controls="selected"
          @input="confirmed = $event"
        >
          {{ $t('add_bank_modal.confirmed_checkbox') }}
        </form-checkbox>
        <base-button
          variants="contained"
          color="primary"
          full-width
          :loading="isSubmitPaymentLoading"
          :disabled="disable"
          @click="submit"
        >
          {{ buttonActionText }}
        </base-button>
      </div>
    </div>
    <ModalDeleteBank :warning-text="warningText" />
  </b-modal>
</template>
<script>
import ModalDeleteBank from '@/components/mobile/modal/modal-delete-bank.vue';
import addBank from '@/mixins/payment/add-bank';
import { mapActions } from 'vuex';
import { RESPONSE_ICON } from '@/resources/message';

export default {
  components: {
    ModalDeleteBank,
    BaseButton: () => import('~/components/common/base-button/index.vue'),
    SvgIcon: () => import('~/components/common/svg-icon/index.vue'),
    FormCheckbox: () => import('~/components/common/forms/form-checkbox/index.vue')
  },
  mixins: [addBank],
  props: {
    isMerchant: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      warningText: '',
      confirmed: false
    }
  },
  computed: {
    disable () {
      return !this.confirmed || !this.isSubmit;
    }
  },
  methods: {
    ...mapActions('payments', ['setPaymentId']),
    async onDelete (item) {
      if (item.hasOrder) {
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
      if (item.hasPost) {
        this.warningText = this.$t('delete_bank_modal.warning');
      }

      await this.setPaymentId(item);
      this.$bvModal.show(this.MODAL.DELETE_BANK);
    }
  }
};
</script>
<style scoped lang="scss" src="static/assets/scss/components/mobile/modal/modal-add-bank.scss"></style>
