import BigNumber from 'bignumber.js'
import userBuyOrderMixin from '@/mixins/user-buy-order'
import { getRandomColor } from '@/helper/index.js';
import { mapActions, mapState } from 'vuex';
import { ORDER_TYPE } from '@/resources/order-type.js';
import { CRYPTO_INPUT_MAX_VALUE, CRYPTO_INPUT_MAX_LENGTH, USER_ROLE } from '@/config/constant';
import { MODAL } from '@/resources/modal';
import { ERROR_TYPE } from '@/resources/message';
import isEmpty from 'lodash/isEmpty';
import isNaN from 'lodash/isNaN';
import { getMerchantAvatar } from '@/helper/avatar-util';
import { IS_SKIP_POLICY_CONDITION_DEVICE } from '~/config/constant';

export default {
  mixins: [userBuyOrderMixin],
  data () {
    return {
      vndValue: '',
      cryptoValue: '',
      key: 0,
      CRYPTO_INPUT_MAX_VALUE,
      CRYPTO_INPUT_MAX_LENGTH,
      autoSelectBank: {},
      amountCrypto: '' // set full decimal of cryptoValue
    };
  },
  watch: {
    payments (val, oldVal) {
      if (!oldVal.length) {
        this.setSelectedPayment(val[0])
      }
    }
  },
  computed: {
    ...mapState('payments', ['payments', 'selectedPayment']),
    ...mapState('resources', ['assets']),
    ...mapState('user', ['user']),
    ...mapState('post', ['postStatus']),
    getRandomColor,
    manager () {
      return this.item?.merchant;
    },
    maxOrderAmount () {
      return Math.ceil(this.item.maxOrderAmount);
    },
    minOrderAmount () {
      return Math.ceil(this.item.minOrderAmount);
    },
    availableAmount () {
      return this.item.availableAmount;
    },
    price () {
      return this.item.price;
    },
    finishRate () {
      return (new BigNumber(this.manager.monthFinishRate).multipliedBy(100)).toFixed(2)
    },
    avatarChar () {
      return this.manager.nickName ? this.manager.nickName.charAt(0) : ''
    },
    avatar () {
      return getMerchantAvatar(this.manager.avatar)
    },
    placeholder () {
      return (
        this.$options.filters.formatMoney(this.minOrderAmount) +
          ' - ' +
          this.$options.filters.formatMoney(this.maxOrderAmount)
      );
    },
    isFormValid () {
      const vndNumber = this.$options.filters.formatMarkToNumber(this.vndValue);
      if (!this.vndValue ||
        this.vndValue === '0' ||
        vndNumber > this.maxOrderAmount ||
        vndNumber < this.minOrderAmount ||
        ((this.$route.path === '/marketplace/sell' || this.$route.query?.status === 'sell') && isEmpty(this.selectedPayment))
      ) { return false }
      return true;
    },
    decimalLimit () {
      const precision = this.assets.find(e => e.name === this.item?.assetName && e.network === this.item?.assetNetwork)?.precision
      return isNaN(precision) ? 2 : precision
    },
    cryptoInputMaxLength () {
      return CRYPTO_INPUT_MAX_LENGTH
    },
    isEndUser () {
      return this.user?.type === USER_ROLE.USER
    },
    fiatSymbol () {
      return this.item?.fiatSymbol || '₫'
    },
    errorMaxValueText () {
      return this.$t('form_post.error.max_fiat', {
        value: `${this.fiatSymbol} ${this.$options.filters.formatMoney(this.maxOrderAmount)}`
      })
    },
    errorMinValueText () {
      return this.$t('form_post.error.min_fiat', {
        value: `${this.fiatSymbol} ${this.$options.filters.formatMoney(this.minOrderAmount)}`
      })
    },
    assetTokenName () {
      return `${this.item?.assetName} (${this.item?.assetNetwork})`
    },
    isOnline () {
      return this.postStatus?.includes(this.item?.id)
    },
    isOpenConfirmPolicyOrder () {
      const isSkipPolicyCondition = JSON.parse(
        localStorage.getItem(IS_SKIP_POLICY_CONDITION_DEVICE)
      )
      return !isSkipPolicyCondition
    }
  },
  created () {
    if (this.payments?.length) {
      this.setSelectedPayment(this.payments[0])
    } else {
      this.setSelectedPayment({})
    }
  },
  methods: {
    ...mapActions('payments', ['setSelectedPayment']),
    ...mapActions('modal-message', ['initModal']),
    $_postDetailMixin_inputVnd (val) {
      const amountNumber = new BigNumber(this.$options.filters.formatMarkToNumber(val)).dividedBy(this.price).toString()
      this.amountCrypto = amountNumber
      this.cryptoValue = this.item.postType === ORDER_TYPE.SELL
        ? this.$options.filters.formatDownCrypto(amountNumber)
        : this.$options.filters.formatUpCrypto(amountNumber)
    },
    $_postDetailMixin_inputCrypto (val) {
      const amountNumber = new BigNumber(this.$options.filters.formatMarkToNumber(val)).multipliedBy(this.price).toString()
      this.vndValue = this.item.postType === ORDER_TYPE.SELL
        ? this.$options.filters.formatUpMoney(amountNumber)
        : this.$options.filters.formatDownMoney(amountNumber);
    },
    $_postDetailMixin_cancelTransaction () {
      this.vndValue = '';
      this.cryptoValue = '';
      this.amountCrypto = '';
      this.key += 1;
      this.$emit('cancel-transaction')
      this.close && this.close();
    },
    $_postDetailMixin_isCfTurnstileVerified (type) {
      if (this.cfToken) {
        return true
      }
      this.$emit('cf-verify')
      return false
    },
    $_postDetailMixin_onOpenConfirmPolicyConditionBuyOrder (orderType) {
      if (this.isOpenConfirmPolicyOrder) {
        this.$bvModal.show(MODAL.WARNING_POLICY_CONDITION_ORDER)
        return;
      }
      this.$_postDetailMixin_approvedTransaction()
    },
    $_postDetailMixin_onOpenConfirmPolicyConditionSellOrder () {
      if (this.isOpenConfirmPolicyOrder) {
        this.$bvModal.show(MODAL.WARNING_POLICY_CONDITION_ORDER)
        return;
      }
      this.$_postDetailMixin_approvedTransactionSell()
    },
    $_postDetailMixin_approvedTransaction () {
      const params = {
        totalPrice: this.$options.filters.formatMarkToNumber(this.vndValue),
        postId: this.item.id,
        price: this.item.price
      }
      this.$_userBuyOrderMixin_buyCrypto(params, this.assetTokenName);
    },
    $_postDetailMixin_approvedTransactionSell () {
      const params = {
        paymentMethodId: this.selectedPayment.id,
        totalPrice: this.$options.filters.formatMarkToNumber(this.vndValue),
        postId: this.item.id,
        price: this.item.price
      }
      this.$_userBuyOrderMixin_sellCrypto(params, this.assetTokenName);
    },
    $_postDetailMixin_buyAll () {
      if (new BigNumber(this.availableAmount).multipliedBy(this.price).toNumber() < this.maxOrderAmount) {
        const maxVndValue = new BigNumber(this.availableAmount).multipliedBy(this.price).toString()
        this.vndValue = this.item.postType === ORDER_TYPE.SELL
          ? this.$options.filters.formatUpMoney(maxVndValue)
          : this.$options.filters.formatDownMoney(maxVndValue);
        this.cryptoValue = this.$options.filters.formatCrypto(this.availableAmount)
        this.amountCrypto = this.availableAmount
      } else {
        this.vndValue = this.$options.filters.formatMoney(this.maxOrderAmount.toString());
        const maxCryptoValue = new BigNumber(this.maxOrderAmount).dividedBy(this.price).toString()
        this.amountCrypto = maxCryptoValue
        this.cryptoValue = this.item.postType === ORDER_TYPE.SELL
          ? this.$options.filters.formatDownCrypto(maxCryptoValue)
          : this.$options.filters.formatUpCrypto(maxCryptoValue)
      }
    },
    $_postDetailMixin_blurCrypto () {
      this.amountCrypto = this.$options.filters.formatMarkToNumber(this.cryptoValue)
      this.cryptoValue = this.item.postType === ORDER_TYPE.SELL
        ? this.$options.filters.formatDownCrypto(this.cryptoValue)
        : this.$options.filters.formatUpCrypto(this.cryptoValue)
    },
    $_postDetailMixin_openMethodTab () {
      const route = this.$router.resolve({ path: '/user/payments' });
      window.open(route.href);
    },
    $_postDetailMixin_openModalAddBank () {
      if (this.isEndUser) {
        this.$bvModal.show(MODAL.ADD_BANK)
        return
      }
      this.initModal({
        type: ERROR_TYPE.MANUAL,
        message: [{ key: 'NO_PERMISSION_TO_CREATE_PAYMENT_METHOD' }],
        isShow: true
      })
    }
  }
};
