<template>
  <ModalCommon
    :id="MODAL.CONFIRM_EDIT_BANK"
    :ref="MODAL.CONFIRM_EDIT_BANK"
    :title="$t('update_bank_modal.title')"
  >
    <div class="modal-content mt-2">
      <div class="text-center">
        <img :src="require('~imageRoot/common/method/warning-updatep-payment.svg')" alt="icon warning" width="200">
      </div>
      <p class="modal-content__txt font-t16r mb-0 text-center">{{ getWarningNote() }}</p>
      <base-button
        variants="contained"
        color="primary"
        full-width
        @click="submit"
      >
        {{ $t('update_bank_modal.btn') }}
      </base-button>
    </div>
  </ModalCommon>
</template>
<script>
import ModalCommon from '@/components/desktop/modal/modal-common.vue';
import { MODAL } from '@/resources/modal.js';
import { mapActions, mapState } from 'vuex';

export default {
  components: {
    ModalCommon,
    BaseButton: () => import('~/components/common/base-button/index.vue')
  },
  props: {
    warningText: {
      type: String,
      default: ''
    },
    paymentMethodId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      MODAL
    }
  },
  computed: {
    ...mapState('payments', ['payments'])
  },
  methods: {
    ...mapActions('payments', ['setPaymentDetail']),
    getWarningNote () {
      return this.warningText;
    },
    submit () {
      this.$bvModal.hide(MODAL.CONFIRM_EDIT_BANK)
      this.$bvModal.show(MODAL.ADD_BANK)
    }
  }
};
</script>
<style scoped lang="scss" src="static/assets/scss/components/common/modal/modal-delete-bank.scss"></style>
