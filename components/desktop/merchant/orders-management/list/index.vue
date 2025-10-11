<template>
  <section class="list-management">
    <client-only>
      <layout-wrapper :title="`${$t('title_head.transaction')}`">
        <template #head>
          <tabs-action
            :key="orderWaitingCount"
            :tabs="tabsMapped"
            :active-tab="activeTab"
            @on-change-tab="onChangeUserOrder"
          />
        </template>
        <template #body>
          <div class="order-management">
            <component
              :is="activatedComponent"
              :key="activatedComponent"
              :is-open-detail-order="isOpenDetail"
              @update-total-pending="updateTotalPending"
              @on-open-bank-qrcode="$commonOrdersMixin_onOpenBankQrcode"
              @on-selected-order="rowOrderSelected = $event"
              @on-open-detail-order="isOpenDetail = false"
              @on-open-chat="onOpenChat($event)"
            />
          </div>
        </template>
      </layout-wrapper>
      <modal-result-transaction />
      <modal-confirm-send-crypto show-countdown-order-detail is-visible-mercy-loading />
      <modal-confirm-order is-visible-mercy-loading @confirm="$commonOrdersMixin_onOpenModalConfirmPaid" />
      <modal-appeal
        :id="modalAppealId"
        :order="orderDetail"
        :is-open-chat="isOpenChat"
        @on-transfer="$commonOrdersMixin_onOpenModalConfirmTransfer"
        @on-pay="$commonOrdersMixin_onOpenModalSendCrypto"
        @on-open-detail-order="onOpenDetailOrder"
      />
      <modal-payment-confirmation
        :order="orderDetail"
        :time-left="timeLeft"
        :loading="orderDetailLoading"
        is-visible-mercy-loading
        @submit-confirm-payment="$commonOrdersMixin_onConfirmSent(orderDetail.orderRefId)"
      />
      <modal-bank-qrcode :qr-code-url="bankQrCode" />
      <modal-send-crypto-confirmation
        :order-info="orderDetail"
        :time-left="timeLeft"
        is-visible-mercy-loading
        :title-error="titleErrorOnChainSendCrypto"
        :sub-title-error="subTitleErrorOnChainSendCrypto"
        :status="statusConfirmSendCryptoInfo"
        :is-loading-submit-crypto="isConfirmSubmitTransactionCrypto"
        @on-confirm-crypto="onReConfirmedCrypto"
        @on-close="checkToShowConfirm"
      />
      <modal-transaction-rpc :order="orderDetail" @on-continue="$commonOrdersMixin_onContinueConfirmTransactionRpc" />
    </client-only>
  </section>
</template>
<script>
import { MODAL } from '@/resources/modal';
import commonOrdersMixin from '@/mixins/merchant/orders/common';
import { mapState, mapActions } from 'vuex';
import walletMixin from '@/mixins/open-wallet.js'
import { SENDING_CRYPTO_STATUS } from '@/config/constant';
import modalMixin from '~/mixins/modal'
import tabsListOrderMixin from '~/mixins/tabs-list-orders'
import merchantSubmitOnChainMixin from '~/mixins/submit-onchain/merchant'

export default {
  components: {
    LayoutWrapper: () => import('~/components/containers/layout-wrapper/index.vue'),
    TabsAction: () => import('@/components/common/tab-action'),
    PendingOrders: () => import('~/components/desktop/merchant/orders-management/pending-orders/index.vue'),
    WaitingConfirmationOrders: () => import('~/components/desktop/merchant/orders-management/waiting-confirmation-orders/index.vue'),
    AppealOrders: () => import('~/components/desktop/merchant/orders-management/appeal-orders/index.vue'),
    CompletedOrders: () => import('~/components/desktop/merchant/orders-management/completed-orders/index.vue'),
    CancelledOrders: () => import('~/components/desktop/merchant/orders-management/cancelled-orders/index.vue'),
    ModalConfirmSendCrypto: () => import('@/components/desktop/modal/confirmed-send-crypto.vue'),
    ModalResultTransaction: () => import('@/components/desktop/modal/result-send-crypto.vue'),
    ModalAppeal: () => import('~/components/desktop/merchant/orders-management/modal/appeal/index.vue'),
    ModalConfirmOrder: () => import('@/components/common/modal/modal-confirm-order.vue'),
    ModalPaymentConfirmation: () => import('@/components/common/modal/payment-confirmation.vue'),
    ModalBankQrcode: () => import('@/components/common/modal/modal-bank-qrcode.vue'),
    ModalSendCryptoConfirmation: () => import('~/components/common/modal/send-crypto-confirmation.vue'),
    ModalTransactionRpc: () => import('@/components/common/modal/transaction-rpc/index.vue')
  },
  mixins: [tabsListOrderMixin, modalMixin, commonOrdersMixin, walletMixin, merchantSubmitOnChainMixin],
  data () {
    return {
      modalAppealId: MODAL.MERCHANT_APPEAL,
      isOpenDetail: false,
      isOpenChat: false
    }
  },
  computed: {
    ...mapState('merchant-orders', ['orderDetail']),
    ...mapState('send-crypto', ['confirmSendCryptoInfo']),
    ...mapState('chat', ['isVisibleChat']),
    statusConfirmSendCryptoInfo () {
      return this.confirmSendCryptoInfo?.status || ''
    },
    timeLeft () {
      return this.orderDetail.timeout
        ? this.$options.filters.convertToMilliseconds(this.orderDetail.timeout) : 0
    }
  },
  async created () {
    if (this.activatedComponent !== 'PendingOrders') {
      await this.getSupporterProcess()
    }
  },
  methods: {
    ...mapActions('merchant-orders', ['getSupporterProcess', 'updateOrderDetail']),
    ...mapActions('chat', ['setFocusInput']),
    onOpenDetailOrder () {
      if (!this.isOpenDetail) {
        this.isOpenDetail = true
      }
    },
    onOpenChat (order) {
      this.updateOrderDetail(order)
      this.isOpenChat = !this.isOpenChat
    },
    async onReConfirmedCrypto () {
      await this.$_merchantSubmitTransactionOnChain_onFetchTxEventsOnChain({
        fromAddress: this.user.walletAddress,
        toAddress: this.orderDetail?.user?.walletAddress,
        orderId: this.orderDetail?.orderRefId,
        assetNetwork: this.orderDetail?.assetNetwork,
        assetName: this.orderDetail?.assetName,
        orderCreatedAt: this.orderDetail?.createdTime
      })
    },
    async checkToShowConfirm () {
      await this.$commonOrdersMixin_getOrderDetail({ type: this.orderDetail?.type, id: this.orderDetail?.id })
      if (this.statusConfirmSendCryptoInfo === SENDING_CRYPTO_STATUS.FAILED) {
        this.setConfirm({
          status: SENDING_CRYPTO_STATUS.PROCESSING,
          amount: this.orderDetail.amount,
          asset: this.orderDetail.assetName,
          orderId: this.orderDetail.orderId
        })
        this.$bvModal.show(MODAL.SEND_CRYPTO_CONFIRMATION)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.list-management {
  &__chat-action {
    position: fixed;
    bottom: 3rem;
    right: 4rem;
  }
}
</style>
