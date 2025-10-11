import { ORDER_TYPE } from '@/resources/order-type.js';
import { mapState, mapActions } from 'vuex';
import { ERROR_TYPE } from '@/resources/message';
import { POST_TYPE, USER_ROLE } from '@/config/constant.js';
import { ORDER_FIELD_SEARCH_DEFAULT } from '@/constants/orders'

export default {
  data () {
    return {
      ORDER_FIELD_SEARCH_DEFAULT
    };
  },
  computed: {
    ...mapState('user', ['user']),
    ...mapState('end-user', ['buyOrderInfo', 'isSubmitLoading'])
  },
  methods: {
    ...mapActions('end-user', [
      'fetchDataBuyInfo',
      'fetchDataSellInfo',
      'createOrder',
      'createSellOrder',
      'cancelBuy',
      'cancelSell',
      'confirmPayment',
      'confirmReceived',
      'getListOrder',
      'setBuyInfo'
    ]),
    ...mapActions('modal-message', ['initModal']),
    async $_userBuyOrderMixin_fetchDataBuyInfo (goDetail = false, displayMode) {
      const refId = this.buyOrderInfo?.orderRefId || this.buyOrderInfo?.id;
      if (!refId) {
        this.$router.push('/marketplace')
      } else if (refId) {
        let result = null;
        if (this.buyOrderInfo?.type === ORDER_TYPE.SELL) {
          result = await this.fetchDataSellInfo(refId)
        } else {
          result = await this.fetchDataBuyInfo(refId)
        }
        if (goDetail && result && result.data && result.data.step) {
          const type = result.data.type.toLowerCase()
          this.$router.push({
            path: `/${type}/order-detail/${result.data?.id}`,
            query: {
              ...(displayMode && { displayMode })
            }
          })
        }
      }
    },
    async $_userBuyOrderMixin_checkOrderInfo () {
      try {
        const orderRefId = this.$route.params?.orderRefId || null;
        const type = (this.$route.params.type || '').toUpperCase();
        if (!orderRefId || !type) {
          return;
        }
        if (!this.buyOrderInfo?.id) {
          if (type === ORDER_TYPE.BUY) {
            await this.fetchDataBuyInfo(orderRefId)
          } else {
            await this.fetchDataSellInfo(orderRefId)
          }
        }
      } catch (e) {
        console.error(e)
        this.$router.replace('/404')
      }
    },
    async $_userBuyOrderMixin_buyCrypto (params, assetTokenName = '') {
      try {
        if (this.$_userBuyOrderMixin_validUser()) {
          const result = await this.createOrder(params)
          if (result?.data?.id) {
            this.$router.push(`/buy/order-detail/${result.data?.id}`)
            return
          }
          this.handleCreateOrderError(result?.errors[0]?.key, assetTokenName, POST_TYPE.BUY)
        }
      } catch (error) {
        const keyError = error.response?.data?.errors?.slice(0, 1) || []
        this.handleCreateOrderError(keyError[0]?.key, assetTokenName, POST_TYPE.BUY)
      }
    },
    async $_userBuyOrderMixin_sellCrypto (params, assetTokenName = '') {
      try {
        if (this.$_userBuyOrderMixin_validUser()) {
          const result = await this.createSellOrder(params)
          if (result?.data?.id) {
            this.$router.push(`/sell/order-detail/${result?.data?.id}`)
            return
          }
          this.handleCreateOrderError(result?.errors[0]?.key, assetTokenName, POST_TYPE.SELL)
        }
      } catch (error) {
        const keyError = error.response?.data?.errors?.slice(0, 1) || []
        this.handleCreateOrderError(keyError[0]?.key, assetTokenName, POST_TYPE.SELL)
      }
    },
    handleCreateOrderError (key, assetTokenName, type) {
      this.initModal({
        type: ERROR_TYPE.MANUAL,
        ...(key === 'TOKEN_IS_NO_LONGER_SUPPORTED' ? {
          messageContent: this.$t('modal.message.TOKEN_IS_NO_LONGER_SUPPORTED', {
            token: assetTokenName
          }),
          forceReload: true
        } : {
          message: [{ key: this.setKeyErrorPost(key, type) }]
        }
        ),
        api: type === POST_TYPE.BUY ? '/user-order/buy-crypto' : '/user-order/sell-crypto',
        isShow: true
      })
    },
    setKeyErrorPost (key, postType) {
      const keyErrorsCryptoAmountWithPostType = {
        [POST_TYPE.BUY]: {
          AMOUNT_IS_GREATER_THAN_AVAILABLE_AMOUNT: 'BUY_AMOUNT_IS_GREATER_THAN_AVAILABLE_AMOUNT',
          AMOUNT_IS_GREATER_THAN_POST_MAX_AMOUNT: 'BUY_AMOUNT_IS_GREATER_THAN_POST_MAX_AMOUNT'
        },
        [POST_TYPE.SELL]: {
          AMOUNT_IS_GREATER_THAN_AVAILABLE_AMOUNT: 'SELL_AMOUNT_IS_GREATER_THAN_AVAILABLE_AMOUNT',
          AMOUNT_IS_GREATER_THAN_POST_MAX_AMOUNT: 'SELL_AMOUNT_IS_GREATER_THAN_POST_MAX_AMOUNT'
        }
      }
      return keyErrorsCryptoAmountWithPostType[postType]?.[key] || key
    },
    $_userBuyOrderMixin_cancelOrder (orderInfo, cfToken) {
      if (orderInfo.type === ORDER_TYPE.SELL) {
        this.$_userBuyOrderMixin_cancelSell(orderInfo.id, cfToken)
      } else {
        this.$_userBuyOrderMixin_cancelBuy(orderInfo.id, cfToken)
      }
    },
    async $_userBuyOrderMixin_cancelBuy (id, cfToken) {
      await this.cancelBuy({ id, cfToken })
    },
    async $_userBuyOrderMixin_cancelSell (id, cfToken) {
      await this.cancelSell({ id, cfToken })
    },
    async $_userBuyOrderMixin_confirmPayment (id) {
      await this.confirmPayment({ id })
    },
    async $_userBuyOrderMixin_confirmReceived (id) {
      await this.confirmReceived({ id })
    },
    $_userBuyOrderMixin_validUser () {
      const keyMessageWithRole = {
        [USER_ROLE.MERCHANT_OPERATOR]: {
          key: 'MERCHANT_ACCOUNT_CAN_NOT_CREATE_ORDER'
        },
        [USER_ROLE.MERCHANT_SUPPORTER]: {
          key: 'MERCHANT_ACCOUNT_CAN_NOT_CREATE_ORDER'
        },
        [USER_ROLE.MERCHANT_MANAGER]: {
          key: 'MERCHANT_MANAGER_CAN_NOT_CREATE_ORDER'
        },
        [USER_ROLE.SUPER_ADMIN]: {
          key: 'ADMIN_CAN_NOT_CREATE_ORDER'
        }
      }
      if (keyMessageWithRole[this.user?.type]?.key) {
        this.$store.commit('modal-message/INIT_MODAL', {
          type: ERROR_TYPE.MANUAL,
          message: [{ key: keyMessageWithRole[this.user?.type]?.key }],
          isShow: true
        })
        return false;
      }
      return true;
    }
  }
}
