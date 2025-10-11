<template>
  <ModalCommon
    :id="MODAL.ADD_BANK"
    :ref="MODAL.ADD_BANK"
    :title="getTitle"
    @show-modal="onShowModal"
    @hide-modal="onHideModal"
  >
    <div class="modal-content mt-2">
      <div class="row-info">
        <div class="label">{{ $t('add_bank_modal.name') }}</div>
        <BankSelector
          ref="formData.bankName"
          :bank-name="formData.bankName"
          :filter-banks="getSupportedBanks"
          :show-bank-number="false"
          @on-select="formData.bankName = $event"
        />
      </div>
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
        @input="() => (formData.bankHolder = formData.bankHolder.toUpperCase())"
      />
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
  </ModalCommon>
</template>
<script>
import ModalCommon from '@/components/desktop/modal/modal-common.vue';
import addBank from '@/mixins/payment/add-bank';

export default {
  components: {
    ModalCommon,
    BaseButton: () => import('~/components/common/base-button/index.vue'),
    FormCheckbox: () => import('~/components/common/forms/form-checkbox/index.vue')
  },
  mixins: [addBank],
  data () {
    return {
      confirmed: false
    };
  },
  computed: {
    disable () {
      return !this.confirmed || !this.isSubmit;
    }
  }
};
</script>
<style
  scoped
  lang="scss"
  src="static/assets/scss/components/common/modal/modal-add-bank.scss"
></style>
