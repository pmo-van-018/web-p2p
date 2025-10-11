<template>
  <div class="order-info">
    <div class="order-info__container">
      <div class="order-info__head">
        <div class="order-info__title">{{ $t('merchant.transaction_detail.transaction_info') }}</div>
      </div>
      <div class="order-info__body">
        <div class="order-info__inner">
          <div class="order-info__left">
            <div class="order-info__content">
              {{ $t('merchant.transaction_detail.amount_cryptocurrencies') }}
            </div>
          </div>
          <div class="order-info__right">
            <div class="order-info__text large" :class="orderTypeClass">
              {{ fiat }} {{ amountMoney | formatMoney }}
            </div>
          </div>
        </div>

        <div class="order-info__inner">
          <div class="order-info__left">
            <div class="order-info__content">
              {{ $t('merchant.transaction_detail.rate') }}
            </div>
          </div>
          <div class="order-info__right">
            <div class="order-info__text grey-700">
              {{ fiat }} {{ priceFormatter }}
            </div>
          </div>
        </div>

        <div class="order-info__inner">
          <div class="order-info__left">
            <div class="order-info__content">
              {{ $t('merchant.transaction_detail.amount_cryptocurrencies') }}
            </div>
          </div>
          <div class="order-info__right">
            <div class="order-info__text large">
              {{ amountCryptoCurrencies }} {{ assetName }}
            </div>
          </div>
        </div>

        <div class="order-info__inner">
          <div class="order-info__left">
            <div class="order-info__content">
              <div class="d-flex align-items-center">
                <span class="mr-1">{{ dataFee.label }}</span>
                <span id="transaction-fee-note" class="icon-info" />
                <b-tooltip target="transaction-fee-note" triggers="hover">
                  <span class="transaction-fee-note">
                    {{ dataFee.note }}
                  </span>
                </b-tooltip>
              </div>
            </div>
          </div>
          <div class="order-info__right">
            <div class="order-info__text large">
              {{ dataFee.text }}
              <span class="font-t14r grey-400">({{ dataFee.total ? '~' : '' }} {{ fiatSymbol }} {{ dataFee.total }})</span>
            </div>
          </div>
        </div>

        <div v-if="!isFinishStatus" class="order-info__inner">
          <div class="order-info__left">
            <div class="order-info__content">
              <div class="d-flex align-items-center">
                <span class="mr-1">
                  {{ $t('merchant.transaction_detail.penalty_fee_tmp') }}
                </span>
                <span id="penalty-fee" class="icon-info" />
                <b-tooltip target="penalty-fee" triggers="hover">
                  <span class="transaction-fee-note">
                    {{ $t('merchant.transaction_detail.penalty_fee_note_tmp') }}
                  </span>
                </b-tooltip>
              </div>
            </div>
          </div>
          <div class="order-info__right">
            <div class="order-info__text large">
              {{ penaltyFeeText }}
              <span v-if="totalPenaltyFee" class="font-t14r grey-400">
                ({{ totalPenaltyFee ? '~' : '' }} {{ fiatSymbol }} {{ totalPenaltyFee }})
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ORDER_TYPE } from '@/resources/order-type.js';
import { STATUS_ORDER_BUY } from '@/resources/transfer-to-seller/index.js';
import { ORDER_STATUS } from '@/config/constant';
import BigNumber from 'bignumber.js'
import { mapState } from 'vuex';
export default {
  props: {
    order: {
      type: Object,
      default: () => ({})
    },
    noBorder: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      STATUS_ORDER_BUY,
      ORDER_TYPE
    }
  },
  computed: {
    ...mapState('resources', ['assets']),
    decimalLimit () {
      return this.assets.find(item => item.id === this.asset?.id)?.precision || 0
    },
    asset () {
      return this.assets.find(item => item.name === this.order?.assetName && item.network === this.order?.assetNetwork)
    },
    isFinishStatus () {
      const finishStatuses = [ORDER_STATUS.COMPLETED, ORDER_STATUS.CANCELLED];
      return finishStatuses.includes(this.order?.status);
    },
    fiat () {
      return this.order.fiatSymbol || '';
    },
    assetName () {
      return this.order?.assetName || '';
    },
    assetNetwork () {
      return this.order?.assetNetwork || '';
    },
    fiatSymbol () {
      return this.order?.fiatSymbol || '';
    },
    price () {
      return this.order?.price || 0;
    },
    priceFormatter () {
      return this.$options.filters.formatCrypto(this.order?.price || 0, this.decimalLimit, 'ceil')
    },
    amountCryptoCurrencies () {
      return this.order.amount ? this.$options.filters.formatCrypto(this.order?.amount || 0) : 0;
    },
    amountMoney () {
      return this.order.totalPrice ? this.order?.totalPrice : 0;
    },
    orderTypeClass () {
      return this.order?.type === ORDER_TYPE.BUY ? 'red' : 'green'
    },
    dataFee () {
      const fee = BigNumber(Number(this.order?.feePercent || 0));
      const feePercent = fee.multipliedBy(100).toString();

      const dataFee = {
        feePercent,
        label: this.$t('merchant.transaction_detail.transaction_fee'),
        note: this.$t('merchant.transaction_detail.transaction_fee_note'),
        total: this.$options.filters.formatMoney(this.order?.totalFee || 0)
      };

      if (!this.isFinishStatus) {
        const amountMoney = BigNumber(Number(this.amountMoney));
        const totalFee = amountMoney.multipliedBy(fee).toString();
        dataFee.label = this.$t('merchant.transaction_detail.transaction_fee_tmp');
        dataFee.note = this.$t('merchant.transaction_detail.transaction_fee_note_tmp');
        dataFee.total = this.$options.filters.formatMoney(totalFee);
      }

      dataFee.text = `${feePercent}%`;

      return dataFee;
    },
    penaltyFeeText () {
      const penaltyFee = BigNumber(Number(this.order?.penaltyFeePercent || 0));
      const penaltyFeePercent = penaltyFee.multipliedBy(100).toString();
      return `${penaltyFeePercent}%`;
    },
    totalPenaltyFee () {
      const amountMoney = BigNumber(Number(this.amountMoney));
      const penaltyFee = BigNumber(Number(this.order?.penaltyFeePercent || 0));
      return this.$options.filters.formatMoney(amountMoney.multipliedBy(penaltyFee).toString());
    }
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/mobile/orders/order-detail/info.scss">
</style>
