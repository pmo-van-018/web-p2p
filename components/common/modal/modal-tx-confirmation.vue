<template>
  <ModalCommon
    :id="MODAL.TX_CONFIRMATION"
    :ref="MODAL.TX_CONFIRMATION"
    :title="$t('modal.send_crypto_confirmation.tx_confirm_title')"
  >
    <div class="tx-confirmation">
      <div class="tx-confirmation__icon">
        <img
          alt="tx-confirmation-icon"
          src="/assets/images/common/orders/tx-confirm.svg"
          class="tx-confirmation__icon-img"
        >
      </div>
      <div class="tx-confirmation__desc">
        <span>{{ $t('modal.send_crypto_confirmation.tx_confirm_desc_1') }}</span>
        <span>{{ $t('modal.send_crypto_confirmation.tx_confirm_desc_2') }}</span>
      </div>
      <div class="tx-confirmation__form">
        <div class="form-title">
          <div>
            {{ $t('modal.send_crypto_confirmation.tx_confirm_form_title') }}
            <span v-b-tooltip.hover class="icon-info" :title="$t('modal.send_crypto_confirmation.tx_confirm_tooltip')" />
          </div>
          <p @click="onTxGuide">{{ $t('modal.send_crypto_confirmation.guide_get_txid') }}</p>
        </div>
        <div class="form-value">
          <b-form-textarea
            v-model="txHash"
            :class="[{'has-value': txHash}, {'error': error}]"
            placeholder="Nhập TxID"
            rows="2"
          />
        </div>
        <div class="form-error">
          <span>{{ error }}</span>
        </div>
        <div v-if="isShowConsult && submitHashTimeRemaining" class="form-consult" v-html="$t('modal.send_crypto_confirmation.consult', {count: submitHashTimeRemaining})" />
      </div>
      <div :class="['tx-confirmation__action', { 'mt-2': !error }]">
        <base-button
          variants="contained"
          color="primary"
          full-width
          :class="[{disabled: !txHash, loading: confirming}]"
          :disabled="!!error || !txHash"
          @click="submit"
        >
          <div class="tx-confirmation__action-inner">
            <img
              v-if="confirming"
              alt="tx-confirmation-loading"
              src="/assets/images/common/orders/confirm-loading.svg"
              class="tx-confirmation__action-loading"
            >
            <span>{{ actionText }}</span>
          </div>
        </base-button>
      </div>
    </div>
  </ModalCommon>
</template>
<script>
import ModalCommon from '@/components/desktop/modal/modal-common.vue';
import { mapActions, mapState } from 'vuex';
import { MODAL } from '@/resources/modal';
import USER_ORDER_API from '@/api/user-order';
import MERCHANT_ORDER_API from '@/api/merchant-order.js';
import { USER_ROLE } from '@/config/constant'
import { TRANSACTION_VALIDATE_REGEX } from '@/constants/transaction'
import { ERROR_TYPE } from '@/resources/message';

export default {
  components: {
    ModalCommon,
    BaseButton: () => import('~/components/common/base-button/index.vue')
  },
  data () {
    return {
      MODAL,
      txHash: '',
      error: '',
      confirming: false
    }
  },
  computed: {
    ...mapState('user', ['user']),
    ...mapState('end-user', ['buyOrderInfo', 'submitHashTimeRemaining']),
    ...mapState('merchant-orders', ['orderDetail']),
    actionText () {
      return this.error ? this.$t('action.resend') : (this.confirming ? this.$t('action.confirming') : this.$t('action.confirm'))
    },
    isShowConsult () {
      return this.user?.type === USER_ROLE.USER
    }
  },
  watch: {
    txHash () {
      if (!this.txHash) {
        this.error = '';
        return false
      }
      const isTronNetwork = this.buyOrderInfo?.assetNetwork === 'Tron' || this.orderDetail?.assetNetwork === 'Tron'
      if ((!isTronNetwork && !(TRANSACTION_VALIDATE_REGEX.ERC_HASH).test(this.txHash)) ||
     (isTronNetwork && !(TRANSACTION_VALIDATE_REGEX.TRON_HASH).test(this.txHash))) {
        this.error = this.$t('tx_confirm.err_invalid_hash');
        return false
      }
      this.error = '';
      return true
    }
  },
  methods: {
    ...mapActions('modal-message', ['initModal']),
    show () {
      this.$refs.modalTxConfirmation.show();
    },
    close () {
      this.$refs.modalTxConfirmation.close();
    },
    onTxGuide () {
      this.close()
      this.$emit('on-tx-guide')
    },
    async submit () {
      try {
        if (this.txHash) {
          this.confirming = true
          const url = this.user?.type === USER_ROLE.USER ? USER_ORDER_API.SUBMIT_CRYPTO_TRANSACTION : MERCHANT_ORDER_API.SUBMIT_CRYPTO_TRANSACTION;
          const orderId = this.user?.type === USER_ROLE.USER ? this.buyOrderInfo.id : this.orderDetail.id
          const result = await this.$axios.$post(url, {
            orderId,
            hash: this.txHash,
            isUpdate: true
          });
          if (result?.errors?.length) {
            this.initModal({
              type: ERROR_TYPE.MANUAL,
              message: result?.errors,
              api: '',
              isShow: true
            })
          }
          return result;
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e)
      } finally {
        this.confirming = false
        this.txHash = ''
        this.$bvModal.hide(MODAL.TX_CONFIRMATION)
      }
    }
  }
}
</script>
<style scoped lang="scss" src="static/assets/scss/components/desktop/modal/modal-tx-confirmation.scss"></style>
