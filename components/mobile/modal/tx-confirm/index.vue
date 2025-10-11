<template>
  <b-modal
    :id="modalId"
    :ref="modalId"
    modal-class="modal-custom"
    centered
    hide-header
    hide-footer
    no-close-on-backdrop
    no-close-on-esc
  >
    <div class="modal-tx-confirm">
      <div class="modal-tx-confirm__container">
        <div class="modal-tx-confirm__head">
          <span class="modal-tx-confirm__icon-head icon-chevron-right1" @click="close()" />
          <div class="d-flex align-items-center">
            <div class="modal-tx-confirm__text">Xác nhận chuyển tiền mã hoá</div>
          </div>
        </div>
        <div class="modal-tx-confirm__body">
          <div class="tx-confirm">
            <div class="tx-confirm__icon">
              <img
                alt="tx-confirm-icon"
                src="/assets/images/common/orders/tx-confirm.svg"
                class="tx-confirm__icon-img"
              >
            </div>
            <div class="tx-confirm__desc">
              <span>{{ $t('modal.send_crypto_confirmation.tx_confirm_desc_1') }}</span>
              <span>{{ $t('modal.send_crypto_confirmation.tx_confirm_desc_2') }}</span>
            </div>
            <div class="tx-confirm__form">
              <div class="form-title">
                <div>
                  {{ $t('modal.send_crypto_confirmation.tx_confirm_form_title') }}
                  <span v-b-tooltip.hover class="icon-info" :title="$t('modal.send_crypto_confirmation.tx_confirm_tooltip')" />
                </div>
                <p @click="$refs.popupTxGuide.show()">{{ $t('modal.send_crypto_confirmation.guide_get_txid') }}</p>
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
            <div :class="['tx-confirm__action', { 'mt-2': !error }]">
              <base-button
                variants="contained"
                color="primary"
                full-width
                :class="[{disabled: !txHash, loading: confirming}]"
                :disabled="!!error || !txHash"
                @click="submit"
              >
                <div class="tx-confirm__action-inner">
                  <img
                    v-if="confirming"
                    alt="tx-confirm-loading"
                    src="/assets/images/common/orders/confirm-loading.svg"
                    class="tx-confirm__action-loading"
                  >
                  <span>{{ actionText }}</span>
                </div>
              </base-button>
            </div>
          </div>
        </div>
      </div>
      <ModalTxGuide ref="popupTxGuide" />
    </div>
  </b-modal>
</template>
<script>
import { mapState } from 'vuex';
import { MODAL } from '@/resources/modal';
import USER_ORDER_API from '@/api/user-order';
import MERCHANT_ORDER_API from '@/api/merchant-order.js';
import { USER_ROLE } from '@/config/constant'
import { TRANSACTION_VALIDATE_REGEX } from '@/constants/transaction'

export default {
  components: {
    BaseButton: () => import('~/components/common/base-button/index.vue'),
    ModalTxGuide: () => import('~/components/mobile/modal/tx-guide')
  },
  data () {
    return {
      modalId: MODAL.TX_CONFIRMATION,
      domain: this.$config.STATIC_DOMAIN,
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
    show () {
      this.$refs.modalTxConfirmation.show();
    },
    close () {
      this.$refs.modalTxConfirmation.hide();
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
          return result;
        }
      } catch (e) {
        console.log(e)
      } finally {
        this.confirming = false
        this.txHash = ''
        this.$bvModal.hide(MODAL.TX_CONFIRMATION)
      }
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/mobile/modal/tx-confirm/index.scss">
</style>
