<template>
  <ModalCommon
    :id="id"
    :ref="id"
    :title="$t('modal.send_crypto_confirmation.title')"
    :modal-class="modalClass"
    @hide-modal="isConfirm = false"
  >
    <template #countdown>
      <Countdown
        v-if="timeOut"
        class="ml-3"
        :time-left="timeOut"
        :class="{ warning: isRedCountdown }"
        :is-visible-mercy-loading="isVisibleMercyLoading"
        @time-out="onProcessTimeOut"
      />
    </template>
    <client-only>
      <template #placeholder>
        <div class="confirm-order">
          <div class="loading">
            <root-img class="loading__img" src="/assets/images/common/loading-icon.svg" alt="loading" />
            <div class="loading__desc">{{ $t('merchant.modal_confirm_order.loading') }}...</div>
          </div>
        </div>
      </template>
      <div class="confirm-order">
        <img alt="confirm-send" class="confirm-order__img" src="/assets/images/common/orders/resentmoney.svg">
        <div class="confirm-order__info">
          <span v-if="orderDetail.postType === ORDER_TYPE.BUY" class="buy-color">{{ $t('merchant.transaction_detail.buy') }}</span>
          <span v-else class="sell-color">{{ $t('merchant.transaction_detail.sell') }}</span> #{{ orderDetail.id }}
        </div>
        <template v-if="orderDetail.status === STATUS_ORDER_BUY.TO_BE_PAID.upercaseName">
          <div class="confirm-order__descript">
            <p class="mb-1">{{ $t('merchant.modal_confirm_order.receive_enough') }} <span>{{ orderDetail.fiatSymbol }} {{ orderDetail && orderDetail.totalPrice | formatMoney }}</span> {{ $t('merchant.modal_confirm_order.from_buyer') }}</p>
            <div class="d-flex align-items-center">
              <div class="mr-2 transfer-text">
                {{ $t('merchant.modal_confirm_order.transfer_contents') }}
              </div>
              <div class="d-flex align-items-center content-transfer">
                <span>{{ orderDetail.transCode }}</span>
                <copy-button :id="`${orderDetail.id}_${orderDetail.transCode}`" :value="orderDetail.transCode" class="copy-content__button" />
              </div>
            </div>
          </div>
          <b-form-checkbox
            v-model="isConfirm"
            class="primary confirm-order__check-box"
          >
            {{ $t('merchant.modal_confirm_order.check_box') }}
          </b-form-checkbox>
          <div class="confirm-order__amount w-100 text-center">
            {{ $t('merchant.modal_confirm_send_crypto.amount_send') }} <span>{{ showAmount }} {{ orderDetail.assetName }}</span>
          </div>
          <base-button
            variants="contained"
            color="primary"
            full-width
            :disabled="!isConfirm"
            @click="confirm"
          >
            {{ $t('merchant.modal_confirm_order.button', { assetName }) }}
          </base-button>
        </template>
        <template v-else>
          <div class="confirm-order__descript">
            {{ $t('merchant.modal_confirm_order.desc_1') }} <br>
            {{ $t('merchant.modal_confirm_order.desc_2') }}
          </div>
          <div class="confirm-order__amount w-100 text-center mb-0">
            {{ $t('merchant.modal_confirm_send_crypto.amount_send') }} <span>{{ showAmount }} {{ orderDetail.assetName }}</span>
          </div>
        </template>
      </div>
    </client-only>
  </ModalCommon>
</template>
<script>
import Countdown from '@/components/common/countdown.vue';
import ModalCommon from '@/components/desktop/modal/modal-common.vue';
import { ORDER_BUY_STEP, STATUS_ORDER_BUY } from '@/resources/transfer-to-seller';
import { ORDER_TYPE } from '@/resources/order-type.js';
import { mapState } from 'vuex';
import { MODAL } from '@/resources/modal'

export default {
  components: {
    ModalCommon,
    Countdown,
    CopyButton: () => import('~/components/common/copy-button.vue'),
    BaseButton: () => import('~/components/common/base-button/index.vue'),
    RootImg: () => import('~/components/common/root-img.vue')

  },
  props: {
    modalClass: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      default: MODAL.CONFIRM_ORDER
    },
    isVisibleMercyLoading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      ORDER_TYPE,
      STATUS_ORDER_BUY,
      MODAL,
      isConfirm: false
    };
  },
  computed: {
    ...mapState('merchant-orders', ['orderDetail']),
    timeOut () {
      return this.$options.filters.convertToMilliseconds(
        this.orderDetail?.timeout
      );
    },
    isRedCountdown () {
      const steps = [
        ORDER_BUY_STEP.BUY_ORDER_CREATED_BY_USER_DEAL_TIME.name,
        ORDER_BUY_STEP.BUY_ENABLE_APPEAL_WHILE_CONFIRMING_FIAT_BY_MERCHANT.name
      ];
      return steps.includes(this.orderDetail?.step);
    },
    showAmount () {
      return this.orderDetail.amount && this.$options.filters.formatCrypto(this.orderDetail.amount)
    },
    assetName () {
      return this.orderDetail?.assetName || 'VIC'
    }
  },
  methods: {
    confirm () {
      if (this.isConfirm) {
        this.$emit('confirm', this.orderDetail)
      }
    },
    onProcessTimeOut () {
      if (!this.isVisibleMercyLoading) {
        this.$bvModal.hide(MODAL.CONFIRM_ORDER)
      }
    }
  }
};
</script>
<style scoped lang="scss" src="static/assets/scss/components/common/modal/modal-confirm-order.scss"></style>
