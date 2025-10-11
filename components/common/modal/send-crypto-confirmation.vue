<template>
  <ModalCommon
    :id="MODAL.SEND_CRYPTO_CONFIRMATION"
    :ref="MODAL.SEND_CRYPTO_CONFIRMATION"
    :title="modalTitle"
    :modal-class="`${modalClass}`"
    @show-modal="onShowModal"
    @hide-modal="$emit('hide-modal')"
    @on-close="$emit('on-close')"
  >
    <template #countdown>
      <Countdown
        v-if="timeLeft > 0"
        :time-left="timeLeft"
        :is-visible-mercy-loading="isVisibleMercyLoading"
        class="send-crypto-confirmation__countdown mt-md-0 mt-1 ml-0 ml-md-3"
        @time-out="onTimeOut"
      />
    </template>
    <div class="send-crypto-confirmation" :class="modalClass">
      <div class="send-crypto-confirmation__icon">
        <img :src="srcIcon" class="send-crypto-confirmation__icon-img" alt="send crypto confirmation" width="120" height="120">
      </div>
      <div v-if="isFailedStatus" class="send-crypto-confirmation__title send-crypto-confirmation__title--medium">
        {{ errorTitle }}
      </div>
      <template v-else>
        <div class="send-crypto-confirmation__title">
          {{ $t('home.sell') }}
          <span>{{ '#' + orderId }}</span>
        </div>
      </template>
      <div class="send-crypto-confirmation__note" v-html="note" />
      <template v-if="!isFailedStatus">
        <div class="send-crypto-confirmation__desc">
          <span>{{ $t('modal.send_crypto_confirmation.fiat_send') }}</span>
          <strong class="d-block d-md-inline-block text-center text-md-left">{{ amount | formatCrypto }} {{ assetName }}</strong>
        </div>
        <template v-if="isVisibleReConfirmedSendCrypto">
          <div class="send-crypto-confirmation__note">
            <div class="crypto-note">
              <div class="crypto-note__top">
                <span class="icon-question" />
                <span class="crypto-note__title">{{ $t('merchant.modal_confirm_send_crypto.note.title') }}</span>
              </div>
              <div class="crypto-note__bottom">
                <ul class="crypto-note__list">
                  <li class="crypto-note__item">
                    {{ $t('merchant.modal_confirm_send_crypto.note.confirm_when_completed') }}
                  </li>
                  <li class="crypto-note__item">
                    {{ $t('merchant.modal_confirm_send_crypto.note.reconfirm_warning') }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="send-crypto-confirmation__action">
            <base-button
              variants="contained"
              color="primary"
              full-width
              :disabled="disabledActionReConfirmed"
              :loading="disabledActionReConfirmed"
              @click="onReconfirmedSendingCrypto"
            >
              {{ $t('action.reconfirmed_sending_crypto') }}
            </base-button>
          </div>
        </template>
      </template>
    </div>
  </ModalCommon>
</template>
<script>
import Countdown from '@/components/common/countdown.vue';
import ModalCommon from '@/components/desktop/modal/modal-common.vue';
import { MODAL } from '@/resources/modal'
import { BUY_ORDER_STEPS, SELL_ORDER_STEPS } from '@/constants/orders';
import dayjs from 'dayjs';
import { SENDING_CRYPTO_STATUS, USER_ROLE } from '@/config/constant';
import { mapState } from 'vuex';

export default {
  components: {
    ModalCommon,
    Countdown,
    BaseButton: () => import('~/components/common/base-button/index.vue')
  },
  props: {
    orderInfo: {
      type: Object,
      default: () => {}
    },
    status: {
      type: String,
      default: 'processing'
    },
    timeLeft: {
      type: Number,
      default: 0
    },
    modalClass: {
      type: String,
      default: ''
    },
    isVisibleMercyLoading: {
      type: Boolean,
      default: false
    },
    isLoadingSubmitCrypto: {
      type: Boolean,
      default: false
    },
    titleError: {
      type: String,
      default: ''
    },
    subTitleError: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      MODAL,
      timeCount: 0,
      intervalId: null,
      secondVisibleReConfirmedCrypto: 30,
      isLoadingCurrentOrder: false
    }
  },
  computed: {
    ...mapState('user', ['user']),
    modalTitle () {
      return (this.titleError && this.isFailedStatus) ? this.$t('modal.message.system_notification') : this.$t('modal.send_crypto_confirmation.title');
    },
    orderId () {
      return this.orderInfo?.id || ''
    },
    step () {
      return this.orderInfo?.step || ''
    },
    amount () {
      return this.orderInfo?.amount || 0
    },
    decisionAt () {
      return this.orderInfo?.appeal?.decisionAt || ''
    },
    updatedTime () {
      return this.orderInfo?.updatedTime || ''
    },
    assetName () {
      return this.orderInfo?.assetName || ''
    },
    assetNetwork () {
      return this.orderInfo?.assetNetwork || ''
    },
    srcIcon () {
      return this.isFailedStatus ? '/assets/images/common/orders/transfer-fail.svg' : '/assets/images/common/orders/confirm-sending-crypto.svg';
    },
    errorTitle () {
      return this.titleError || this.$t('modal.send_crypto_confirmation.has_error');
    },
    note () {
      return this.isFailedStatus
        ? (this.subTitleError || this.$t('merchant.modal_confirm_send_crypto.note_failed'))
        : this.$t('merchant.modal_confirm_send_crypto.note_processing')
    },
    isFailedStatus () {
      return this.status === SENDING_CRYPTO_STATUS.FAILED;
    },
    secondsLeft () {
      return Math.max(Math.floor(this.timeCount / 1000), 0);
    },
    isVisibleReConfirmedSendCrypto () {
      return this.isStepVisibleConfirmedCrypto && this.secondsLeft > this.secondVisibleReConfirmedCrypto
    },
    disabledActionReConfirmed () {
      return this.isLoadingSubmitCrypto && this.isLoadingCurrentOrder
    },
    isStepVisibleConfirmedCrypto () {
      if (this.user?.type === USER_ROLE.USER) {
        return [
          SELL_ORDER_STEPS.SELL_ORDER_CREATED_BY_USER,
          SELL_ORDER_STEPS.SELL_SENDING_CRYPTO_FAILED
        ].includes(this.step)
      }
      return this.user?.type === USER_ROLE.MERCHANT_OPERATOR &&
          [
            BUY_ORDER_STEPS.BUY_CONFIRMED_FIAT_BY_MERCHANT,
            BUY_ORDER_STEPS.BUY_CONFIRMED_FIAT_BY_MERCHANT_DEAL_TIME,
            BUY_ORDER_STEPS.BUY_SENDING_CRYPTO_FAILED,
            SELL_ORDER_STEPS.SELL_ORDER_CREATED_BY_USER,
            SELL_ORDER_STEPS.SELL_SENDING_CRYPTO_FAILED
          ].includes(this.step)
    }
  },
  watch: {
    orderId: {
      handler (newValue, oldValue) {
        this.isLoadingCurrentOrder = newValue === oldValue
      }
    }
  },
  destroyed () {
    this.startCountUp();
  },
  methods: {
    onShowModal () {
      this.startCountUp();
    },
    getTimeoutMilliseconds () {
      if (this.orderInfo?.appeal) {
        return this.decisionAt ? dayjs().diff(dayjs(this.decisionAt), 'seconds') * 1000 : 0
      }
      return this.updatedTime ? dayjs().diff(dayjs(this.updatedTime), 'seconds') * 1000 : 0
    },
    onReconfirmedSendingCrypto () {
      this.isLoadingCurrentOrder = true
      this.$emit('on-confirm-crypto')
    },
    startCountUp () {
      this.clearCountUpInterval();
      this.timeCount = this.getTimeoutMilliseconds();
      if (this.isVisibleReConfirmedSendCrypto) {
        return;
      }
      this.intervalId = setInterval(() => {
        if (this.isVisibleReConfirmedSendCrypto) {
          clearInterval(this.intervalId);
          this.intervalId = null;
        } else {
          this.timeCount += 1000;
        }
      }, 1000);
    },
    clearCountUpInterval () {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
    },
    showPopup () {
      this.$bvModal.show(MODAL.SEND_CRYPTO_CONFIRMATION)
    },
    onTimeOut () {
      if (!this.isVisibleMercyLoading || this.orderInfo?.step === BUY_ORDER_STEPS.BUY_CONFIRMED_FIAT_BY_MERCHANT_DEAL_TIME) {
        this.$bvModal.hide(MODAL.SEND_CRYPTO_CONFIRMATION)
      }
    },
    closePopup () {
      this.$bvModal.hide(MODAL.SEND_CRYPTO_CONFIRMATION)
    }
  }
}
</script>
<style scoped lang="scss" src="static/assets/scss/components/common/modal/send-crypto-confirmation.scss"></style>
