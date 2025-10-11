<template>
  <ModalCommon
    :id="MODAL.DELETE_BANK"
    :ref="MODAL.DELETE_BANK"
    :title="$t('delete_bank_modal.title')"
    @show-modal="onShowModal"
  >
    <div class="delete-bank modal-content mt-2">
      <div class="text-center">
        <img :src="require('~imageRoot/common/method/delete.svg')" alt="icon delete" width="120">
      </div>
      <p class="delete-bank__text modal-content__txt font-t16r mb-0 text-center">{{ getWarningNote() }}</p>
      <base-button
        variants="contained"
        color="primary"
        full-width
        :loading="isDeletePaymentLoading"
        :disabled="isDeletePaymentLoading"
        @click="submit"
      >
        {{ $t('delete_bank_modal.btn') }}
      </base-button>
    </div>
  </ModalCommon>
</template>
<script>
import ModalCommon from '@/components/desktop/modal/modal-common.vue';
import { MODAL } from '@/resources/modal.js';
import { mapActions, mapState } from 'vuex';
import { RESPONSE_ICON } from '@/resources/message';
export default {
  components: {
    ModalCommon,
    BaseButton: () => import('~/components/common/base-button/index.vue')
  },
  props: {
    warningText: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      MODAL,
      paymentMethodId: '',
      isDeletePaymentLoading: false
    }
  },
  computed: {
    ...mapState('payments', ['selectedPaymentId'])
  },
  methods: {
    ...mapActions('payments', ['setPaymentDetail', 'deletePayment', 'deleteUserPayment']),
    ...mapActions('modal-response', ['showResponseModal']),
    onShowModal () {
      this.idBank = this.selectedPaymentId
    },
    getWarningNote () {
      return this.warningText;
    },
    async submit () {
      try {
        let result = null;
        this.isDeletePaymentLoading = true
        if (window.location.host.includes(this.$config.OPERATION_PREFIX)) {
          result = await this.deletePayment(this.idBank)
        } else {
          result = await this.deleteUserPayment(this.idBank)
        }

        if (result?.errors?.length) {
          const errorKey = result?.errors[0]?.key || 'error_system';
          this.handleShowError(errorKey)
        }
        this.$emit('on-success')
        this.$bvModal.hide(MODAL.DELETE_BANK)
        this.isDeletePaymentLoading = false
      } catch (error) {
        const errorKey = error?.response?.data?.errors?.[0]?.key || 'error_system';
        this.handleShowError(errorKey)
      } finally {
        this.isDeletePaymentLoading = false
      }
    },
    handleShowError (errorKey) {
      this.showResponseModal({
        title: '',
        content: this.$t('modal.message.payment_delete_failed'),
        description: this.$t(`modal.message.${errorKey}`),
        icon: RESPONSE_ICON.DELETE_PAYMENT_METHOD_FAILED,
        show: true
      })
    }
  }
};
</script>
<style scoped lang="scss" src="static/assets/scss/components/common/modal/modal-delete-bank.scss"></style>
