<template>
  <ModalCommon
    :id="MODAL.CONFIRM_PAY"
    :ref="MODAL.CONFIRM_PAY"
    :title="$t('label.payment_confirmation')"
    :modal-class="`payment-confirm-custom ${modalClass}`"
    @hide-modal="hideModal"
  >
    <template #countdown>
      <Countdown
        v-if="timeLeft > 0"
        :time-left="timeLeft"
        class="payment-confirmation__countdown"
        :is-visible-mercy-loading="isVisibleMercyLoading"
        @time-out="onTimeOut"
      />
    </template>
    <div class="payment-confirmation" :class="modalClass">
      <div class="payment-confirmation__img">
        <img :src="require('~imageRoot/common/orders/confirm-money.svg')" alt="icon confirm">
      </div>
      <div class="payment-confirmation__title">
        {{ $t('home.buy') }}
        <span>{{ `#${ order?.id }` }}</span>
      </div>
      <div class="payment-confirmation__desc">
        {{ $t('modal.payment_confirmation.transfer_money_to_seller') }}
      </div>
      <div class="payment-confirmation__content-info">
        <InfoBlock :list-info="listInfo" :is-show-select-bank="isShowSelectBank"/>
      </div>
      <div class="payment-confirmation__note">
        <span class="icon-question payment-confirmation__note-icon" />
        <div class="payment-confirmation__note-desc">{{ $t('transfer_seller.info.modal_note_2') }}</div>
      </div>
      <b-form-checkbox v-model="isConfirm" class="primary payment-confirmation__checkbox">{{ $t('transfer_seller.info.modal_note_3') }}</b-form-checkbox>
      <div class="payment-confirmation__action">
        <base-button
          variants="contained"
          color="primary"
          full-width
          :disabled="!isConfirm"
          @click="submit"
        >
          {{ $t('action.confirm') }}
        </base-button>
      </div>
    </div>
  </ModalCommon>
</template>
<script>
import { mapState } from 'vuex';
import Countdown from '@/components/common/countdown.vue';
import ModalCommon from '@/components/desktop/modal/modal-common.vue';
import InfoBlock from '@/components/common/info-block.vue';
import { BANK } from '@/resources/bank.js';
import { MODAL } from '@/resources/modal'
import { SELL_ORDER_STEPS } from '@/constants/orders';

export default {
  components: {
    ModalCommon,
    Countdown,
    InfoBlock,
    BaseButton: () => import('~/components/common/base-button/index.vue')
  },
  props: {
    order: {
      type: Object,
      default: () => {}
    },
    timeLeft: {
      type: Number,
      default: 0
    },
    modalClass: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    },
    isVisibleMercyLoading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isConfirm: false,
      MODAL
    }
  },
  computed: {
    ...mapState('payments', ['isShowSelectBank']),
    listInfo () {
      return [
        {
          title: this.$t('label.bank_name'),
          value: BANK.find(e => e.bankName === this.order?.bankName)?.name || '',
          icon: BANK.find(e => e.bankName === this.order?.bankName)?.icon || ''
        },
        {
          title: this.$t('label.bank_account'),
          value: this.order?.bankNumber || ''
        },
        {
          title: this.$t('label.full_name'),
          value: this.order?.bankAccountName || '',
          valueClass: 'uppercase'
        },
        {
          title: this.$t('label.amount_money'),
          value: `${this.order?.fiatSymbol || ''} ${this.$options.filters.formatMoney(this.order?.totalPrice || 0)}`,
          valueCopy: this.order?.totalPrice || ''
        },
        {
          title: this.$t('label.transfer_contents'),
          value: this.order && this.order.transCode,
          labelNote: this.$t('transfer_seller.info.note_transfer_contents')
        }
      ]
    }
  },
  methods: {
    show () {
      this.$bvModal.show(MODAL.CONFIRM_PAY)
    },
    close () {
      this.$bvModal.hide(MODAL.CONFIRM_PAY)
    },
    onTimeOut () {
      if (!this.isVisibleMercyLoading || this.order?.step === SELL_ORDER_STEPS.SELL_SENDING_CRYPTO_SUCCESS_DEAL_TIME) {
        this.$bvModal.hide(MODAL.CONFIRM_PAY)
      }
    },
    submit () {
      this.close();
      this.$emit('submit-confirm-payment')
    },
    hideModal () {
      this.isConfirm = false
    }
  }
}
</script>
<style scoped lang="scss" src="static/assets/scss/components/common/modal/payment-confirmation.scss"></style>
