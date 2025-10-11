<template>
  <div class="user-order-detail">
    <client-only>
      <template v-if="isEndUserBuyLoading">
        <div class="user-order-detail__loader">
          <detail-skeleton-loader />
        </div>
      </template>
      <template v-else-if="isHasOrder">
        <div class="user-order-detail__header">
          <div class="user-order-detail__header-content">
            <div class="user-order-detail__header-left">
              <div class="user-order-info">
                <div class="user-order-info__type" :class="orderTypeClass">
                  {{ orderText }} <span>({{ buyOrderInfo?.assetName }})</span>
                </div>
                <div class="user-order-info__text">{{ order?.type === "BUY" ? $t('common.from') : $t('common.to') }}</div>
                <div class="user-order-info__nickname">{{ buyOrderInfo?.managerName }}</div>
              </div>
            </div>
            <div class="user-order-detail__header-right">
              <div class="d-flex align-items-center justify-content-between py-2">
                <div class="user-order-detail__order">
                  {{ $t("transfer_seller.label.order_number") }}
                  <span class="user-order-detail__order--highlight">
                    {{ '#' + refId }}
                  </span>
                </div>
                <div class="user-order-detail__time">
                  {{ $t("transfer_seller.label.time_create") }}
                  <span class="user-order-detail__time--highlight">
                    {{ createdTime }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="user-order-detail__content container">
          <div class="user-order-detail__content__wrapper">
            <StepperOrder v-if="displayStep" :steps="steps" :current-step="currentStep" />
            <component :is="component" :key="buyOrderInfo.step" :order="buyOrderInfo" @action="$_userOrderDetail_handleAction" />
          </div>
        </div>
        <ModalPaymentConfirmation
          ref="popupConfirmPayment"
          :order="buyOrderInfo"
          :time-left="timeLeft"
          is-visible-mercy-loading
          @submit-confirm-payment="$_userBuyOrderMixin_confirmPayment(refId)"
        />
        <ModalPaymentCancellation ref="popupCancelPayment" :order-id="refId" :type="type" @submit-cancel-payment="onCancelPayment" />
        <ModalSellPaymentConfirmation
          ref="popupSellConfirmPayment"
          :sell-order-info="buyOrderInfo"
          :time-left="timeLeft"
          is-visible-mercy-loading
          @submit-confirm-payment="$_userBuyOrderMixin_confirmReceived(refId)"
        />
        <ModalSendCryptoConfirmation
          ref="popupSendCryptoConfirmation"
          :order-info="buyOrderInfo"
          :time-left="timeLeft"
          is-visible-mercy-loading
          :title-error="titleErrorOnChainSendCrypto"
          :sub-title-error="subTitleErrorOnChainSendCrypto"
          :status="statusConfirmSendCryptoInfo"
          :is-loading-submit-crypto="isConfirmSubmitTransactionCrypto"
          @on-confirm-crypto="onReConfirmedCrypto"
        />
        <ModalSendCryptoResult
          ref="popupSendCryptoResult"
          is-visible-mercy-loading
          :order-info="buyOrderInfo"
          :time-left="timeLeft"
        />
        <ModalTxConfirmation
          ref="popupTxConfirmation"
          @on-tx-guide="$refs.popupTxGuide.show()"
        />
        <ModalTxGuide ref="popupTxGuide" @on-tx-confirm="$refs.popupTxConfirmation.show()" />
      </template>
      <section404 v-else />
      <template>
        <keep-alive>
          <order-chat v-if="buyOrderInfo?.roomId && isOrderProcessing" @on-expand="onOpenChatAppeal" />
        </keep-alive>
      </template>
    </client-only>
  </div>
</template>

<script>
import StepperOrder from '@/components/common/stepper-order.vue';
import ModalPaymentConfirmation from '@/components/common/modal/payment-confirmation.vue';
import ModalPaymentCancellation from '@/components/common/modal/payment-cancellation.vue';
import ModalSellPaymentConfirmation from '@/components/common/modal/sell-payment-confirmation.vue';
import ModalSendCryptoConfirmation from '@/components/common/modal/send-crypto-confirmation.vue';
import ModalSendCryptoResult from '@/components/common/modal/send-crypto-result.vue';
import ModalTxConfirmation from '@/components/common/modal/modal-tx-confirmation.vue';
import ModalTxGuide from '@/components/common/modal/modal-tx-guide.vue';
import userOrderDetailMixin from '@/mixins/user-order-detail/index'
import { ORDER_BUY_STEP, ORDER_SELL_STEP } from '@/resources/transfer-to-seller/index.js';
import { mapActions, mapState } from 'vuex'
import { ORDER_TYPE } from '@/resources/order-type'
import { ORDER_STATUS } from '@/config/constant'
import userSubmitOnChainMixin from '~/mixins/submit-onchain/end-user'

export default {
  components: {
    StepperOrder,
    ModalPaymentConfirmation,
    ModalPaymentCancellation,
    ModalSellPaymentConfirmation,
    ModalSendCryptoConfirmation,
    ModalSendCryptoResult,
    ModalTxConfirmation,
    ModalTxGuide,
    DetailSkeletonLoader: () => import('~/components/desktop/user-order-detail/loader.vue'),
    Section404: () => import('~/components/common/404/index.vue'),
    ChatButtonAction: () => import('~/components/desktop/user-order-detail/chat-action.vue'),
    IconChat: () => import('~/components/common/icons/icon-chat.vue'),
    OrderChat: () => import('@/components/desktop/user-order-detail/order-chat.vue'),
    BaseButton: () => import('~/components/common/base-button/index.vue')
  },
  mixins: [userOrderDetailMixin, userSubmitOnChainMixin],
  data () {
    return {
      timeLeft: 0
    }
  },
  computed: {
    ...mapState('chat', ['isVisibleChat', 'chatNoti']),
    component () {
      if (this.isBuyOrder) {
        return ORDER_BUY_STEP[this.buyOrderInfo?.step]?.component || null
      } else {
        if (this.isSellOrderUnknownTransaction) {
          return ORDER_SELL_STEP.SELL_SENDING_CRYPTO_FAILED.component
        }
        return ORDER_SELL_STEP[this.buyOrderInfo?.step]?.component || null
      }
    },
    title () {
      return this.$t(this.transferInfo?.title, { assetName: this.buyOrderInfo?.assetName })
    },
    nickName () {
      const status = ORDER_BUY_STEP[this.buyOrderInfo?.step]?.status || ORDER_SELL_STEP[this.buyOrderInfo?.step]?.status
      return !['info', 'successful'].includes(status)
        ? this.buyOrderInfo?.managerName
        : null
    },
    orderId () {
      return this.buyOrderInfo?.id || ''
    },
    refId () {
      return this.buyOrderInfo?.id || ''
    },
    type () {
      return this.buyOrderInfo?.postType
    },
    currentStep () {
      return this.buyOrderInfo?.step
    },
    orderTypeClass () {
      return this.buyOrderInfo?.type === ORDER_TYPE.BUY ? 'buy' : 'sell'
    },
    orderText () {
      return this.buyOrderInfo?.type === ORDER_TYPE.BUY ? this.$t('common.buy') : this.$t('common.sell')
    },
    isOrderProcessing () {
      return ![ORDER_STATUS.COMPLETED, ORDER_STATUS.CANCELLED].includes(this.buyOrderInfo?.status)
    },
    isVisibleChatFrame () {
      return (this.buyOrderInfo?.appeal || null) && this.isOrderProcessing
    }
  },
  watch: {
    isVisibleChat: {
      handler (value) {
        if (value) {
          this.setVisibleChatSupportRequest(false)
        }
      }
    }
  },
  methods: {
    ...mapActions('chat', ['toggleVisibleChat', 'setOrder']),
    ...mapActions({
      setVisibleChatSupportRequest: 'chat-support-request/setVisibleChat'
    }),
    onOpenChatAppeal () {
      this.setOrder(this.buyOrderInfo)
      this.toggleVisibleChat()
      this.setVisibleChatSupportRequest(false)
    },
    async onReConfirmedCrypto () {
      await this.$_userSubmitTransactionOnChain_onFetchTxEventsOnChain({
        fromAddress: this.user.walletAddress,
        toAddress: this.buyOrderInfo?.merchant?.walletAddress,
        orderId: this.orderId,
        assetNetwork: this.buyOrderInfo?.assetNetwork,
        assetName: this.buyOrderInfo?.assetName,
        orderCreatedAt: this.buyOrderInfo?.createdTime
      })
    }
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/user-order-detail/index.scss" />
