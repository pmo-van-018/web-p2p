import userBuyOrderMixin from '@/mixins/user-buy-order'
import walletMixin from '@/mixins/open-wallet'
import { STEP_1, STEP_2, STEP_3, NO_STEP, ORDER_ACTIONS, ORDER_BUY_STEP, ORDER_SELL_STEP } from '@/resources/transfer-to-seller/index.js';
import { ORDER_TYPE } from '@/resources/order-type.js';
import { LOGIN_TYPE } from '@/resources/auth.js';
import { mapState, mapActions } from 'vuex';
import { FULL_DATE_FORMAT } from '@/config/constant'
import dayjs from 'dayjs'
import web3OnboardMixin from '@/mixins/web3-onboard';
import { TRANSACTION_STATUS } from '@/constants/transaction';
import socketListenerListMixin from '~/mixins/chat/socket-listener-list'
import providerFactoryMixin from '~/mixins/web3-onboard/provider-factory'

export default {
  mixins: [userBuyOrderMixin, walletMixin, socketListenerListMixin, web3OnboardMixin, providerFactoryMixin],
  data () {
    return {
      isEndUserBuyLoading: false,
      statusSendCrypto: ''
    }
  },
  computed: {
    ...mapState('user', ['user']),
    ...mapState('end-user', ['buyOrderInfo']),
    ...mapState('chat', ['lastMessages']),
    ...mapState('resources', ['assets', 'allAssets']),
    isBuyOrder () {
      return this.buyOrderInfo?.type === ORDER_TYPE.BUY
    },
    displayStep () {
      return !Object.keys(NO_STEP).includes(this.buyOrderInfo?.step)
    },
    isHasOrder () {
      return !this.isEndUserBuyLoading && this.buyOrderInfo
    },
    lastTransaction () {
      return this.order?.transactions?.length
        ? this.order?.transactions[this.order?.transactions?.length - 1]
        : null
    },
    isSellOrderUnknownTransaction () {
      return this.buyOrderInfo?.step === ORDER_SELL_STEP.SELL_SENDING_CRYPTO_BY_USER.name &&
        this.lastTransaction?.status === TRANSACTION_STATUS.UNKNOWN
    },
    steps () {
      return [
        {
          label: this.isBuyOrder ? this.$t('transfer_seller.label.info') : this.$t('end_user_sell.label.info'),
          stepName: Object.keys(STEP_1)
        },
        {
          label: this.isBuyOrder ? this.$t('transfer_seller.label.waiting') : this.$t('end_user_sell.label.waiting'),
          stepName: Object.keys(STEP_2)
        },
        {
          label: this.isBuyOrder ? this.$t('transfer_seller.label.completed') : this.$t('end_user_sell.label.completed'),
          stepName: Object.keys(STEP_3),
          isDone: STEP_3[this.$route.name]?.isDone
        }
      ];
    },
    transferInfo () {
      if (this.isBuyOrder) {
        return ORDER_BUY_STEP[this.buyOrderInfo?.step] || {}
      } else {
        return ORDER_SELL_STEP[this.buyOrderInfo?.step] || {}
      }
    },
    createdTime () {
      if (!this.buyOrderInfo || !this.buyOrderInfo.createdTime) {
        return ''
      }
      return dayjs(this.buyOrderInfo.createdTime).format(FULL_DATE_FORMAT)
    }
  },
  sockets: {
    connect () {
    }
  },
  async created () {
    this.isEndUserBuyLoading = true
    this.setMarkAsteriskContent(true)
    await this.$_userBuyOrderMixin_checkOrderInfo();
    setTimeout(() => { this.isEndUserBuyLoading = false }, 1000)
    this.setOrder(this.buyOrderInfo)
    if (this.buyOrderInfo?.roomId) {
      const roomIds = [this.buyOrderInfo?.roomId]
      if (roomIds.length) {
        await this.getLastMessages(roomIds)
        this.initSocketList(roomIds)
        const lastMessage = this.lastMessages.find(message => this.buyOrderInfo?.roomId === message.roomId)
        if (lastMessage && !lastMessage?.seen) {
          this.setChatNoti()
        }
      }
    }

    if (this.buyOrderInfo?.createdTime) {
      const canFetchTxOnChain = () => dayjs().diff(dayjs(this.buyOrderInfo?.createdTime), 'seconds') >= 30;
      if (canFetchTxOnChain()) {
      } else {
        const interval = setInterval(() => {
          if (canFetchTxOnChain()) {
            clearInterval(interval)
          }
        }, 1000)
      }
    }
  },
  beforeDestroy () {
    this.setBuyInfo(null)
    this.resetStateChat()
    this.leaveRoomSocketList([this.buyOrderInfo?.roomId])
  },
  watch: {
    'buyOrderInfo.step' (value) {
      this.$refs?.popupSendCryptoConfirmation?.closePopup()
      this.$refs?.popupSendCryptoResult?.closePopup();
      this.$refs?.popupSellConfirmPayment?.closePopup();
    },
    buyOrderInfo: {
      handler (order, oldOrder) {
        if (order && oldOrder && order.orderId !== oldOrder.orderId) {
          this.$router.push({
            path: this.$route.fullPath,
            query: {
              orderNo: order.orderRefId,
              type: order.type === ORDER_TYPE.BUY ? ORDER_TYPE.BUY : ORDER_TYPE.SELL
            }
          })
        }
      }
    }
  },
  methods: {
    ...mapActions('end-user', ['setBuyInfo', 'setMarkAsteriskContent']),
    ...mapActions('send-crypto', ['setConfirm']),
    ...mapActions('chat', ['setOrder', 'resetStateChat', 'setChatNoti', 'getLastMessages']),
    async $_userOrderDetail_handleAction (data) {
      switch (data.type) {
        case ORDER_ACTIONS.CONFIRM_PAYMENT:
          this.timeLeft = data.value
          this.$refs.popupConfirmPayment.show();
          break;
        case ORDER_ACTIONS.CANCEL_PAYMENT:
          this.$refs.popupCancelPayment.show();
          break;
        case ORDER_ACTIONS.FINISH:
          this.$router.push('/')
          break;
        case ORDER_ACTIONS.SEND_CRYPTO:
          if (this.user.loginType === LOGIN_TYPE.METAMASK || this.user.loginType === LOGIN_TYPE.WALLET_CONNECT) {
            this.statusSendCrypto = ''
            this.enableSubmit = true
          }
          this.timeLeft = data.value
          await this.transferCrypto(this.buyOrderInfo, true)
          break;
        case ORDER_ACTIONS.SEND_CRYPTO_PROCESS:
          this.timeLeft = data.value
          this.$refs.popupSendCryptoConfirmation.closePopup()
          this.$refs.popupSendCryptoResult.closePopup()
          setTimeout(() => {
            this.$refs.popupSendCryptoResult.showPopup()
          }, 100)
          break;
        case ORDER_ACTIONS.SELL_CONFIRM_PAYMENT:
          this.timeLeft = data.value
          this.$refs.popupSellConfirmPayment.showPopup()
          break;
        case ORDER_ACTIONS.TIMEOUT:
        case ORDER_ACTIONS.CONTACT_ADMIN:
          this.$_userBuyOrderMixin_fetchDataBuyInfo();
          break;
        case ORDER_ACTIONS.TX_CONFIRM:
          this.$refs.popupTxConfirmation.show();
          break;
      }
    },
    onCancelPayment (cfToken) {
      this.$_userBuyOrderMixin_cancelOrder(this.buyOrderInfo, cfToken)
    }
  }
}
