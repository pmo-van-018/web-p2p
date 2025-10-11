<template>
  <section>
    <client-only>
      <template v-if="isEndUserBuyLoading">
        <detail-skeleton-loader />
      </template>
      <div v-else-if="isHasOrder" class="user-order-detail" :class="{'completed': isCompletedOrder }">
        <component :is="component" :order="buyOrderInfo" @action="$_userOrderDetail_handleAction" />
        <ModalPaymentConfirmation
          ref="popupConfirmPayment"
          :order="buyOrderInfo"
          :time-left="timeLeft"
          modal-class="mobile"
          is-visible-mercy-loading
          @submit-confirm-payment="$_userBuyOrderMixin_confirmPayment(orderRefId)"
        />
        <ModalPaymentCancellation
          ref="popupCancelPayment"
          :order-id="orderRefId"
          :type="type"
          :is-mobile="true"
          modal-class="mobile"
          @submit-cancel-payment="onCancelPayment"
        />
        <ModalSellPaymentConfirmation
          ref="popupSellConfirmPayment"
          :sell-order-info="buyOrderInfo"
          modal-class="mobile"
          :time-left="timeLeft"
          is-visible-mercy-loading
          @submit-confirm-payment="$_userBuyOrderMixin_confirmReceived(orderRefId)"
        />
        <ModalSendCryptoConfirmation
          ref="popupSendCryptoConfirmation"
          :order-info="buyOrderInfo"
          modal-class="mobile"
          :time-left="timeLeft"
          is-visible-mercy-loading
          :title-error="titleErrorOnChainSendCrypto"
          :sub-title-error="subTitleErrorOnChainSendCrypto"
          :status="statusConfirmSendCryptoInfo"
          :is-loading-submit-crypto="isConfirmSubmitTransactionCrypto"
          @on-confirm-crypto="onReConfirmedCrypto"
        />
        <ModalSendCryptoResult ref="popupSendCryptoResult" modal-class="mobile" :order-info="buyOrderInfo" :time-left="timeLeft" />
        <ModalTxConfirmation ref="popupTxConfirmation" />
      </div>
      <section404 v-else />
      <icon-chat
        v-show="isVisibleChatButton"
        class="user-order-detail__chat-action"
        :unread="chatNotiAppeal"
        bordered
        :icon="chatNotiAppeal ? 'unread-message' : 'read-message'"
        @click="onOpenChatAppeal"
      />
      <modal-chat-frame v-if="!isCompletedOrder" />
    </client-only>
  </section>
</template>

<script>
import ModalPaymentConfirmation from '@/components/common/modal/payment-confirmation.vue';
import ModalPaymentCancellation from '@/components/common/modal/payment-cancellation.vue';
import ModalSendCryptoConfirmation from '@/components/common/modal/send-crypto-confirmation.vue';
import ModalSendCryptoResult from '@/components/common/modal/send-crypto-result.vue';
import ModalSellPaymentConfirmation from '@/components/common/modal/sell-payment-confirmation.vue';
import ModalTxConfirmation from '@/components/mobile/modal/tx-confirm';
import userOrderDetailMixin from '@/mixins/user-order-detail/index';
import { ORDER_BUY_STEP, ORDER_SELL_STEP } from '@/resources/transfer-to-seller/index.js';
import { mapActions, mapState } from 'vuex'
import { ORDER_STATUS, USER_ROLE } from '@/config/constant'
import { MODAL } from '@/resources/modal'
import userSubmitOnChainMixin from '~/mixins/submit-onchain/end-user'

export default {
  components: {
    ModalPaymentConfirmation,
    ModalPaymentCancellation,
    ModalSendCryptoConfirmation,
    ModalSendCryptoResult,
    ModalSellPaymentConfirmation,
    ModalTxConfirmation,
    DetailSkeletonLoader: () => import('~/components/mobile/user-order-detail/loader.vue'),
    Section404: () => import('~/components/common/404/index.vue'),
    ModalChatFrame: () => import('~/components/mobile/modal/chat/index.vue'),
    IconChat: () => import('~/components/common/icons/icon-chat.vue')
  },
  mixins: [userOrderDetailMixin, userSubmitOnChainMixin],
  data () {
    return {
      timeLeft: 0
    }
  },
  computed: {
    ...mapState('chat', ['isVisibleChat', 'order']),
    ...mapState({
      chatNotiAppeal: state => state.chat.chatNoti
    }),
    orderId () {
      return this.buyOrderInfo?.id || ''
    },
    orderRefId () {
      return this.buyOrderInfo?.id || ''
    },
    roomId () {
      return this.buyOrderInfo?.roomId || ''
    },
    type () {
      return this.buyOrderInfo?.postType
    },
    isCompletedOrder () {
      return [ORDER_STATUS.COMPLETED, ORDER_STATUS.CANCELLED].includes(this.buyOrderInfo?.status)
    },
    isRoleUser () {
      return this.user?.type === USER_ROLE.USER
    },
    isVisibleChatButton () {
      return this.isRoleUser && !this.isCompletedOrder && this.buyOrderInfo?.roomId && this.$route.name === 'type-order-detail-orderRefId'
    },
    component () {
      if (this.isBuyOrder) {
        return ORDER_BUY_STEP[this.buyOrderInfo?.step]?.componentMobile || null
      } else {
        if (this.isSellOrderUnknownTransaction) {
          return ORDER_SELL_STEP.SELL_SENDING_CRYPTO_FAILED.componentMobile
        }
        return ORDER_SELL_STEP[this.buyOrderInfo?.step]?.componentMobile || null
      }
    }
  },
  watch: {
    order: {
      async handler (newOrder, oldOrder) {
        if (newOrder?.roomId) {
          const roomIds = [newOrder?.roomId]
          if (roomIds.length) {
            await this.getLastMessages(roomIds)
            this.initSocketList(roomIds)
          }
        }
      }
    }
  },
  methods: {
    ...mapActions('chat', ['setOrder', 'setVisibleChat', 'getLastMessages']),
    onOpenChatAppeal () {
      if (!this.isVisibleChat) {
        this.setOrder(this.buyOrderInfo)
        this.setVisibleChat(true)
        this.$bvModal.show(MODAL.CHAT_FRAME)
      }
    },
    async onReConfirmedCrypto () {
      await this.$_userSubmitTransactionOnChain_onFetchTxEventsOnChain({
        fromAddress: this.user.walletAddress,
        toAddress: this.buyOrderInfo?.merchant?.walletAddress,
        orderId: this.orderRefId,
        assetNetwork: this.buyOrderInfo?.assetNetwork,
        assetName: this.buyOrderInfo?.assetName,
        orderCreatedAt: this.buyOrderInfo?.createdTime
      })
    }
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/mobile/user-order-detail/index.scss" />
