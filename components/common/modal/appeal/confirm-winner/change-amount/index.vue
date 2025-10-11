<template>
  <div>
    <div class="confirm-amount">
      <div class="confirm-amount__container">
        <div class="confirm-amount__left">
          Số tiền giao dịch
        </div>
        <div class="confirm-amount__right">
          <div class="confirm-amount__value confirm-amount__value--bold">
            {{ fiatSymbol }} {{ totalPrice | formatMoney }}
          </div>
          <div class="confirm-amount__value">({{ amount | formatCrypto }} {{ assetName }})</div>
        </div>
      </div>
    </div>
    <div class="change-amount">
      <div class="change-amount__checkbox">
        <b-form-checkbox
          v-model="isConfirmChangeAmount"
          class="primary"
          @change="onConfirmChangeAmount"
        >
          Tôi muốn thay đổi số tiền giao dịch
        </b-form-checkbox>
      </div>
      <div v-if="isConfirmChangeAmount" class="change-amount__container">
        <div class="change-amount__left">Số tiền giao dịch điều chỉnh</div>
        <div class="change-amount__right">
          <div class="change-amount__inner">
            <div class="change-amount__value">
              <crypto-amount
                ref="fiat"
                v-model="inputAmount"
                class="input-crypto--small"
                class-option="error--outline"
                placeholder="0"
                type="tel"
                :unit="fiat"
                :required="false"
                :min-value="null"
                :max-value="null"
                :limit-input="15"
                :allow-decimal="false"
                :allow-leading-zeroes="false"
                @input="onChangeAmount"
              />
            </div>
            <div class="change-amount__format">({{ actuallyAmount | formatCrypto }} {{ assetName }})</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { BUY_APPEAL_RESULTS_KEY } from '@/constants/appeals'
import { mapState } from 'vuex'
import BigNumber from 'bignumber.js'

export default {
  components: {
    CryptoAmount: () => import('~/components/common/home/crypto-input.vue')
  },
  data () {
    return {
      isConfirmChangeAmount: false,
      inputAmount: '',
      buyUserWinSelected: {
        name: 'Mở lại giao dịch - chờ thương gia chuyển tiền mã hóa',
        value: BUY_APPEAL_RESULTS_KEY.BUY_EUWIN_REOPEN
      },
      buyUserWinList: [
        {
          name: 'Mở lại giao dịch - chờ thương gia chuyển tiền mã hóa',
          value: BUY_APPEAL_RESULTS_KEY.BUY_EUWIN_REOPEN
        },
        {
          name: 'Hủy - ANOTRADE hoàn tiền cho người dùng và tính phí phạt cho thương gia',
          value: BUY_APPEAL_RESULTS_KEY.BUY_EUWIN_CANCEL_MC_VIOLATE
        }
      ]
    }
  },
  computed: {
    ...mapState('admin-appeal', ['confirmModal', 'detailAppeal']),
    ...mapState('resources', ['assets']),
    order () {
      return this.detailAppeal?.order
    },
    amount () {
      return this.order?.amount || 0
    },
    totalPrice () {
      return this.order?.totalPrice || 0
    },
    price () {
      return this.order?.price || 0
    },
    assetName () {
      return this.order?.assetName || ''
    },
    assetNetwork () {
      return this.order?.assetNetwork || ''
    },
    fiat () {
      return this.order?.fiat || ''
    },
    fiatSymbol () {
      return this.order?.fiatSymbol || ''
    },
    decimalLimit () {
      return this.assets.find(item => item.name === this.assetName && item.network === this.assetNetwork)?.precision || 0
    },
    actuallyAmount () {
      return new BigNumber(this.$options.filters.formatMarkToNumber(this.inputAmount)).dividedBy(this.price).toNumber()
    }
  },
  methods: {
    onChangeAmount () {
      this.$emit('on-change-amount', this.inputAmount)
    },
    onConfirmChangeAmount (value) {
      this.$emit('on-confirm-change-amount', value)
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/common/modal/appeal/confirm-winner/change-amount/index.scss">
</style>
