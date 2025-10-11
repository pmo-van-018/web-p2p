<template>
  <section>
    <client-only>
      <template #placeholder>
        <div class="my-2 mx-2">
          <order-filter-skeleton-loader />
          <order-filter-skeleton-loader class="my-2" />
          <order-card-skeleton-loader v-for="key in DEFAULT_LOADER" :key="key" />
        </div>
      </template>
      <layout-wrapper>
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
              :key="$route.fullPath"
              @update-total-pending="updateTotalPending"
              @on-open-bank-qrcode="$commonOrdersMixin_onOpenBankQrcode"
              @on-open-chat="openChatFrameInAppealModal"
            />
          </div>
        </template>
      </layout-wrapper>
      <modal-result-transaction />
      <modal-confirm-send-crypto is-visible-mercy-loading show-countdown-order-detail modal-class="mobile" />
      <modal-confirm-order
        modal-class="mobile"
        is-visible-mercy-loading
        @confirm="$commonOrdersMixin_onOpenModalConfirmPaid"
      />
      <modal-payment-confirmation
        :order="orderDetail"
        :time-left="timeLeft"
        modal-class="mobile"
        :loading="orderDetailLoading"
        is-visible-mercy-loading
        @submit-confirm-payment="$commonOrdersMixin_onConfirmSent(orderDetail.orderId)"
      />
      <modal-appeal
        :order="orderDetail"
        @on-transfer="$commonOrdersMixin_onOpenModalConfirmTransfer"
        @on-pay="$commonOrdersMixin_onOpenModalSendCrypto"
        @on-open-chat="openChatFrameInAppealModal"
      />
      <modal-bank-qrcode :qr-code-url="bankQrCode" />
      <modal-send-crypto-confirmation
        :order-info="orderDetail"
        :time-left="timeLeft"
        is-visible-mercy-loading
        :status="statusConfirmSendCryptoInfo"
        :title-error="titleErrorOnChainSendCrypto"
        :sub-title-error="subTitleErrorOnChainSendCrypto"
        :is-loading-submit-crypto="isConfirmSubmitTransactionCrypto"
        @on-confirm-crypto="onReConfirmedCrypto"
        @on-close="checkToShowConfirm"
      />
      <modal-chat-frame />
      <modal-payment-info-detail :order="orderDetail" />
      <modal-transaction-rpc :order="orderDetail" @on-continue="$commonOrdersMixin_onContinueConfirmTransactionRpc" />
    </client-only>
  </section>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import isEmpty from 'lodash/isEmpty';
import commonOrdersMixin from '@/mixins/merchant/orders/common';
import { MODAL } from '@/resources/modal'
import { SENDING_CRYPTO_STATUS } from '@/config/constant';
import tabsListOrderMixin from '~/mixins/tabs-list-orders'
import modalMixin from '~/mixins/modal'
import merchantSubmitOnChainMixin from '~/mixins/submit-onchain/merchant'

export default {
  components: {
    LayoutWrapper: () => import('~/components/containers/layout-wrapper/index.vue'),
    TabsAction: () => import('@/components/common/tab-action'),
    PendingOrders: () => import('~/components/mobile/merchant/orders-management/pending-orders/index.vue'),
    WaitingConfirmationOrders: () => import('~/components/mobile/merchant/orders-management/waiting-confirmation-orders/index.vue'),
    AppealOrders: () => import('~/components/mobile/merchant/orders-management/appeal-orders/index.vue'),
    CompletedOrders: () => import('~/components/mobile/merchant/orders-management/completed-orders/index.vue'),
    CancelledOrders: () => import('~/components/mobile/merchant/orders-management/cancelled-orders/index.vue'),
    OrderCardSkeletonLoader: () => import('~/components/mobile/commons/loader/order/index.vue'),
    OrderFilterSkeletonLoader: () => import('~/components/mobile/commons/loader/filters/index.vue'),
    ModalConfirmSendCrypto: () => import('@/components/desktop/modal/confirmed-send-crypto.vue'),
    ModalConfirmOrder: () => import('@/components/common/modal/modal-confirm-order.vue'),
    ModalResultTransaction: () => import('@/components/desktop/modal/result-send-crypto.vue'),
    ModalPaymentConfirmation: () => import('@/components/common/modal/payment-confirmation.vue'),
    ModalAppeal: () => import('~/components/desktop/merchant/orders-management/modal/appeal/index.vue'),
    ModalBankQrcode: () => import('@/components/common/modal/modal-bank-qrcode.vue'),
    ModalSendCryptoConfirmation: () => import('~/components/common/modal/send-crypto-confirmation.vue'),
    ModalChatFrame: () => import('~/components/mobile/modal/chat/index.vue'),
    ModalPaymentInfoDetail: () => import('~/components/mobile/modal/orders/payment-info/index.vue'),
    ModalTransactionRpc: () => import('@/components/common/modal/transaction-rpc/index.vue')
  },
  mixins: [tabsListOrderMixin, modalMixin, commonOrdersMixin, merchantSubmitOnChainMixin],
  data () {
    return {
      DEFAULT_LOADER: 6,
      totalPending: 0
    }
  },
  computed: {
    ...mapState({
      currentOrder: state => state.orders.order
    }),
    ...mapState('user', ['user']),
    ...mapState('statistics', ['statistics']),
    ...mapState('send-crypto', ['confirmSendCryptoInfo']),
    ...mapState('chat', ['isVisibleChat']),
    statusConfirmSendCryptoInfo () {
      return this.confirmSendCryptoInfo?.status || ''
    },
    userType () {
      return this.user?.type || ''
    },
    orderWaitingCount () {
      return this.statistics?.orderWaitingCount || 0
    },
    timeLeft () {
      return this.orderDetail?.timeout
        ? this.$options.filters.convertToMilliseconds(this.orderDetail.timeout) : 0
    },
    tabsMapped () {
      return this.tabs.map((tab) => {
        if (tab.status === 'pending' || tab.status === 'pending-progress') {
          return { ...tab, count: this.orderWaitingCount };
        }
        return tab
      }).filter(item => isEmpty(item.roles) || item.roles.includes(this.user?.type))
    }
  },
  async created () {
    await this.getSupporterProcess()
  },
  methods: {
    ...mapActions('merchant-orders', ['getSupporterProcess']),
    ...mapActions('chat', ['setVisibleChat', 'setOrder', 'setListenerEventSocket']),
    openChatFrameInAppealModal (order) {
      if (!this.isVisibleChat) {
        this.setOrder(order)
        this.setVisibleChat(true)
        this.setListenerEventSocket(false)
        this.$bvModal.show(MODAL.CHAT_FRAME)
      }
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

</style>
