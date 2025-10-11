<template>
  <main :class="['main', 'd-flex', 'flex-column', 'min-vh-100', { 'main-mobile': isShowMenuBottom }]">
    <SpriteSvg />
    <div v-if="hasMaintenance" class="main__maintenance">
      <maintenance-notion type="green" />
    </div>
    <Header no-container :class="hasMaintenance ? 'main__header-top' : null" />
    <Menu class="nav-bar" :class="hasMaintenance ? 'main__nav-bar' : null" />
    <div class="management-container" :class="{'collapsed': isCollapseSidebarLeft}">
      <transition name="fade-transform" mode="out-in">
        <nuxt />
      </transition>
      <ModalMessage />
    </div>
    <MenuBottom v-if="isShowMenuBottom" :menu-items="menu" />
    <client-only>
      <ModalWarningLogout :is-mobile="$device.isMobileOrTablet" @on-close="$_authMixin_onCloseWarningLogout" />
      <modal-response />
    </client-only>
  </main>
</template>
<script>
import MenuBottom from '@/components/common/footer/menu-bottom.vue'
import Header from '@/components/common/header/index.vue'
import Menu from '@/components/common/left-menu.vue'
import { NAME_EVENT_WS_LISTEN, ORDER_STATUS, USER_ROLE, USER_STATUS } from '@/config/constant.js'
import { BUY_ORDER_STEPS, SELL_ORDER_STEPS } from '@/constants/orders'
import { events } from '@/constants/socket-events'
import auth from '@/mixins/auth'
import notificationMixin from '@/mixins/notification'
import { TYPE_ALERT_TRANSACTION } from '@/resources/alert.js'
import { BOTTOM_BAR_MENU } from '@/resources/menu'
import loadScript from '@/helper/script-loader'
import { CLOUDFLARE_CDN } from '@/constants/external-link'
import { CONFIRM_TYPE, RESPONSE_ICON } from '@/resources/message'
import { MODAL } from '@/resources/modal'
import { ORDER_TYPE } from '@/resources/order-type.js'
import SpriteSvg from 'static/assets/images/common/icon-sprite.svg?inline'
import { mapActions, mapGetters, mapState } from 'vuex'
import { TRANSACTION_STATUS } from '@/constants/transaction'
import { removeItemInPopupOptionsLocalStorage } from '@/helper';
import { SHIFT_MANAGEMENT } from '@/api/shift-management';
import modalMixin from '~/mixins/modal'
import notificationListMixin from '~/mixins/notification/notification-list'
import web3OnboardMixin from '~/mixins/web3-onboard/index.js'
import chatExceptionHandlerMixin from '~/mixins/chat/exception-handler';

export default {
  name: 'LayoutManagement',
  components: {
    Header,
    Menu,
    SpriteSvg,
    MenuBottom,
    ModalMessage: () => import('~/components/common/modal/modal-message.vue'),
    ModalWarningLogout: () => import('~/components/common/modal/modal-warning-logout.vue'),
    ModalResponse: () => import('~/components/common/modal/modal-response.vue'),
    MaintenanceNotion: () => import('~/components/desktop/maintenance/index.vue')
  },
  mixins: [
    auth,
    notificationMixin,
    modalMixin,
    notificationListMixin,
    web3OnboardMixin,
    chatExceptionHandlerMixin
  ],
  computed: {
    ...mapState('user', ['user']),
    ...mapState('resources', ['assets', 'fiats']),
    ...mapState('send-crypto', ['resultSendCryptoInfo']),
    ...mapState('merchant-orders', ['orderDetail']),
    ...mapState('send-crypto', ['resultSendCryptoInfo']),
    ...mapGetters('maintenance', ['hasMaintenance']),
    hasResources () {
      return !!this.assets.length && !!this.fiats.length
    },
    isCollapseSidebarLeft () {
      return this.$store.state.isCollapseSidebarLeft || false
    },
    userType () {
      return this.user?.type || ''
    },
    menu () {
      if (!this.userType) {
        return []
      }
      return BOTTOM_BAR_MENU[this.userType] || []
    },
    isShowMenuBottom () {
      if (
        this.$device.isMobileOrTablet &&
        !['merchant-create-ad', 'admin-appeal-detail', 'supporter-appeals'].includes(this.$route.name) &&
          this.menu.length
      ) {
        return true
      }
      return false
    },
    isShowMaintenance () {
      return [
        USER_ROLE.USER,
        USER_ROLE.MERCHANT_MANAGER,
        USER_ROLE.MERCHANT_OPERATOR,
        USER_ROLE.MERCHANT_SUPPORTER
      ].includes(this.userType)
    },
    isRouterGetCountAppeals () {
      return ['admin-supporter-list-appeals', 'appeals'].includes(this.$route.name)
    },
    isRouterGetSupportRequests () {
      return ['admin-supporter-support-requests', 'support-requests'].includes(this.$route.name)
    },
    isRoleAdmin () {
      return [USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN_SUPPORTER].includes(this.user?.type)
    },
    isAdminSupporter () {
      return this.user?.type === USER_ROLE.ADMIN_SUPPORTER
    },
    isRouterGetFailedTransactions () {
      return this.$route.name === 'admin-supporter-orders'
    }
  },
  mounted () {
    this.$_authMixin_onSetChainChangedNetwork()
    if (this.userType === USER_ROLE.MERCHANT_OPERATOR ||
        (this.userType === USER_ROLE.MERCHANT_MANAGER &&
         this.$route.name !== 'merchant-manager-staffs')) {
      this.getMerchantStatistic()
    }
    if (this.$store.state.user?.user) {
      this.getNotification()
    }
    if (this.userType === USER_ROLE.MERCHANT_OPERATOR) {
      this.getShiftStatusMerchantOperator()
    }
    this.$_authMixin_onSocket()
    this.$socket.client.on(NAME_EVENT_WS_LISTEN, this.handleSocketEvent);
    document.addEventListener('scroll', () => {
      this.$root.$emit('bv::hide::tooltip')
    })
    loadScript(CLOUDFLARE_CDN, false)
  },
  async created () {
    if (!this.hasResources) {
      await this.getResources()
    }
    if (this.isShowMaintenance) {
      await this.getMaintenance()
    }
    if (process.client) {
      await this.$_web3Onboard_initWalletOnboard()
      await this.$checkDisconnectedSession();
      await this.$_authMixin_checkCurrentAccount()
    }
    if (this.isRoleAdmin && !this.isRouterGetCountAppeals) {
      this.countOpeningAppeal()
    }
    if (this.isRoleAdmin && !this.isRouterGetSupportRequests) {
      this.countWaitingRequest()
    }
    if (this.isAdminSupporter && !this.isRouterGetFailedTransactions) {
      this.countFailedTransaction()
    }
  },
  beforeDestroy () {
    this.$socket.client.off(NAME_EVENT_WS_LISTEN, this.handleSocketEvent);
    this.$_authMixin_offSocket();
  },
  methods: {
    ...mapActions('statistics', ['getMerchantStatistic', 'setStatistic']),
    ...mapActions('resources', ['getResources']),
    ...mapActions('orders', ['setOrder']),
    ...mapActions('end-user', ['setBuyInfo']),
    ...mapActions('send-crypto', ['setResult']),
    ...mapActions('user', ['setStatusUserSocket', 'setIsShiftProcessing']),
    ...mapActions('admin-appeal', ['countOpeningAppeal', 'addWaitingAppealCount', 'subWaitingAppealCount']),
    ...mapActions('modal-response', ['showResponseModal']),
    ...mapActions('admin-support', ['countWaitingRequest', 'addSupportRequestCount', 'subSupportRequestCount', 'countFailedTransaction']),
    ...mapActions('chat-support-request', ['setResolveSupportRequest']),
    ...mapActions('merchant-orders', ['updateOrderDetail']),
    ...mapActions('maintenance', ['getMaintenance']),
    handleSocketEvent (data) {
      data = JSON.parse(data);
      if (data.event === events.objects.user) {
        this.onHandleUserData(data)
      }
      if (this.userType === USER_ROLE.MERCHANT_OPERATOR) {
        this.onShowTransactionAlert(data)
      }
      if (data.event === events.objects.order) {
        this.setOrder(data)
        this.setBuyInfo(data)
        if (this.orderDetail?.orderId === data.orderId) {
          this.updateOrderDetail({ ...this.orderDetail, ...data })
          if (![
            BUY_ORDER_STEPS.BUY_SENDING_CRYPTO_BY_MERCHANT,
            BUY_ORDER_STEPS.BUY_CONFIRMED_FIAT_BY_MERCHANT_DEAL_TIME,
            SELL_ORDER_STEPS.SELL_SENDING_CRYPTO_BY_USER,
            SELL_ORDER_STEPS.SELL_SENDING_CRYPTO_SUCCESS,
            SELL_ORDER_STEPS.SELL_SENDING_CRYPTO_FAILED,
            SELL_ORDER_STEPS.SELL_SENDING_CRYPTO_SUCCESS_DEAL_TIME
          ].includes(data.step)) {
            this.$_modalMixin_closeExceptModal(MODAL.TRANSACTION_RPC)
          }
          if (data.appeal) {
            this.$_modalMixin_closeModal(MODAL.TRANSACTION_RPC)
          }
        }
        if (
          this.userType === USER_ROLE.MERCHANT_OPERATOR &&
          [ORDER_STATUS.COMPLETED, ORDER_STATUS.CANCELLED].includes(data?.status) &&
          data?.type === ORDER_TYPE.SELL
        ) {
          removeItemInPopupOptionsLocalStorage(MODAL.TRANSACTION_RPC, this.orderDetail?.orderRefId)
        }
      }
      if (data.event === events.objects.appeal) {
        if (data.action === events.actions.appeal.onExtraTimeBuyAppeal || data.action === events.actions.appeal.onExtraTimeSellAppeal) {
          this.setOrder(data.order)
        }
        if (data.action === events.actions.appeal.adminCancelAppealSession &&
            this.userType === USER_ROLE.ADMIN_SUPPORTER &&
            this.$route.name === 'admin-supporter-appeal-detail' &&
            this.$route.query?.appealId === data?.appealId
        ) {
          this.showResponseModal({
            title: this.$t('modal.title.system'),
            content: '',
            description: this.$t('modal.message.PERMISSION_DENIED_TO_UPDATE_APPEAL'),
            icon: RESPONSE_ICON.CANCELLED_APPEAL_FAILED,
            show: true,
            preventClose: true,
            visibleClose: false,
            confirmAction: this.$t('action.confirm'),
            confirmActionType: CONFIRM_TYPE.REDIRECT_APPEAL_LIST_SUPPORTER
          })
        }
        this.setWaitingAppealCount(data)
        this.setSupportRequestCount(data)
      }
    },
    onShowTransactionAlert (data) {
      const orderType = data.type === ORDER_TYPE.SELL ? ORDER_TYPE.BUY : ORDER_TYPE.SELL
      if ([events.actions.order.buy.systemUpdateTransactionStatus, events.actions.order.sell.systemUpdateTransactionStatus].includes(data.action)) {
        const amount = this.$options.filters.formatCrypto(data.amount)
        const stepsSendingSuccess = [BUY_ORDER_STEPS.BUY_SENDING_CRYPTO_SUCCESS, SELL_ORDER_STEPS.SELL_SENDING_CRYPTO_SUCCESS]
        const type = stepsSendingSuccess.includes(data.step)
          ? TYPE_ALERT_TRANSACTION.SUCCESS
          : TYPE_ALERT_TRANSACTION.FAIL
        const message = stepsSendingSuccess.includes(data.step)
          ? this.$t('alert.transaction_success', { amount, assetName: data.assetName })
          : this.$t('alert.transaction_fail')
        if (this.resultSendCryptoInfo?.orderId === data.orderId &&
            data.transactions &&
            Array.isArray(data.transactions)) {
          const latestTransaction = data.transactions[data.transactions.length - 1]
          if (latestTransaction?.status === TRANSACTION_STATUS.FAILED) {
            this.setResult({
              status: latestTransaction.status,
              hash: latestTransaction.hash,
              network: data.assetNetwork,
              orderId: data.orderId
            });
          }
        }
        this.$transactionAlert(
          {
            type,
            orderType: orderType.toLowerCase(),
            title: '#' + data.orderRefId,
            message,
            autoHideDelay: 5000
          })
      }
      if (data?.action === events.actions.order.sell.userCreateOrder ||
          data?.action === events.actions.order.buy.userCreateBuyOrder) {
        const type = data.type === ORDER_TYPE.SELL
          ? TYPE_ALERT_TRANSACTION.BUY_ORDER
          : TYPE_ALERT_TRANSACTION.SELL_ORDER
        const message = data.type === ORDER_TYPE.SELL
          ? this.$t('alert.new_buy_order')
          : this.$t('alert.new_sell_order')
        this.$transactionAlert(
          {
            type,
            orderType: orderType?.toLowerCase(),
            title: '#' + data.orderRefId,
            message,
            autoHideDelay: 5000
          })
      }
    },
    onHandleUserData (data) {
      switch (data?.action) {
        case events.actions.user.deactivated:
          this.setStatusUserSocket(USER_STATUS.INACTIVE);
          this.$bvModal.show(MODAL.WARNING_LOGOUT);
          break;

        case events.actions.user.deleted:
          this.setStatusUserSocket(USER_STATUS.DELETED);
          this.$bvModal.show(MODAL.WARNING_LOGOUT);
          break;
        case events.actions.user.statistic:
          this.setStatistic(data)
          break;
        default:
          break;
      }
    },
    setWaitingAppealCount (data) {
      if (data?.action === events.actions.appeal.userCreateAppeal) {
        this.addWaitingAppealCount()
      } else if (data?.action === events.actions.appeal.closeAppeal) {
        this.subWaitingAppealCount()
      }
    },
    setSupportRequestCount (data) {
      switch (data?.action) {
        case events.actions.supportRequest.createNewSupportRequest:
          this.addSupportRequestCount()
          break;
        case events.actions.supportRequest.supportRequestPicked:
          this.subSupportRequestCount()
          break;
        case events.actions.supportRequest.resolvedSupportRequest:
          this.setResolveSupportRequest(true)
          break;
        default:
          break;
      }
    },
    async getShiftStatusMerchantOperator () {
      try {
        const { data } = await this.$axios.$get(SHIFT_MANAGEMENT.GET_SHIFT_STATUS)
        this.setIsShiftProcessing(data?.isProcessing)
      } catch (error) {
        this.setIsShiftProcessing(null)
      }
    }
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/layout/management.scss">
</style>
