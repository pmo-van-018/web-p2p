<template>
  <div :class="['detail-card', { 'none-border': noBorder }]">
    <div class="title">{{ $t('merchant.transaction_detail.transaction_info') }}</div>
    <div class="row-info">
      <div class="label">{{ $t('merchant.transaction_detail.amount_money') }}</div>
      <div v-if="orderDetail.postType === ORDER_TYPE.BUY" class="value bullish-green font-t20b">{{ fiat }} {{ amountMoney | formatMoney }}</div>
      <div v-else class="value bearish-red font-t20b">{{ fiat }} {{ amountMoney | formatMoney }}</div>
    </div>

    <div class="row-info">
      <div class="label">{{ $t('merchant.transaction_detail.rate') }}</div>
      <div class="value">{{ fiat }} {{ priceFormatter }}</div>
    </div>

    <div class="row-info">
      <div class="label">{{ $t('merchant.transaction_detail.amount_cryptocurrencies') }}</div>
      <div class="value font-t20b">{{ amountCryptoCurrencies }} {{ assetName }}</div>
    </div>

    <div class="row-info">
      <div class="label">
        {{ dataFee.label }}
        <span id="transaction-fee-note" class="icon-info" />
        <b-tooltip target="transaction-fee-note" triggers="hover">
          <span class="transaction-fee-note">
            {{ dataFee.note }}
          </span>
        </b-tooltip>
      </div>
      <div class="value">
        {{ dataFee.text }}
        <span class="font-t14r grey-400">({{ dataFee.total ? '~' : '' }} {{ fiatSymbol }} {{ dataFee.total }})</span>
      </div>
    </div>

    <div v-if="!isFinishStatus" class="row-info">
      <div class="label">
        {{ $t('merchant.transaction_detail.penalty_fee_tmp') }} <span id="penalty-fee" class="icon-info" />
        <b-tooltip target="penalty-fee" triggers="hover">
          <span class="transaction-fee-note">
            {{ $t('merchant.transaction_detail.penalty_fee_note_tmp') }}
          </span>
        </b-tooltip>
      </div>
      <div class="value">
        {{ penaltyFeeText }}
        <span v-if="totalPenaltyFee" class="font-t14r grey-400">
          ({{ totalPenaltyFee ? '~' : '' }} {{ fiatSymbol }} {{ totalPenaltyFee }})
        </span>
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
    orderDetail: {
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
      return this.assets.find(item => item.name === this.orderDetail?.assetName && item.network === this.orderDetail?.assetNetwork)
    },
    isFinishStatus () {
      const finishStatuses = [ORDER_STATUS.COMPLETED, ORDER_STATUS.CANCELLED];
      return finishStatuses.includes(this.orderDetail?.status);
    },
    fiat () {
      return this.orderDetail.fiatSymbol || '';
    },
    assetName () {
      return this.orderDetail?.assetName || '';
    },
    assetNetwork () {
      return this.orderDetail?.assetNetwork || '';
    },
    fiatSymbol () {
      return this.orderDetail?.fiatSymbol || '';
    },
    price () {
      return this.orderDetail.price || 0;
    },
    priceFormatter () {
      return this.$options.filters.formatCrypto(this.orderDetail?.price || 0, this.decimalLimit, 'ceil')
    },
    amountCryptoCurrencies () {
      return this.orderDetail.amount ? this.$options.filters.formatCrypto(this.orderDetail.amount) : 0;
    },
    amountMoney () {
      return this.orderDetail.totalPrice ? this.orderDetail.totalPrice : 0;
    },
    dataFee () {
      const fee = BigNumber(Number(this.orderDetail?.feePercent || 0));
      const feePercent = fee.multipliedBy(100).toString();

      const dataFee = {
        feePercent,
        label: this.$t('merchant.transaction_detail.transaction_fee'),
        note: this.$t('merchant.transaction_detail.transaction_fee_note'),
        total: this.$options.filters.formatMoney(this.orderDetail?.totalFee || 0)
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
      const penaltyFee = BigNumber(Number(this.orderDetail?.penaltyFeePercent || 0));
      const penaltyFeePercent = penaltyFee.multipliedBy(100).toString();
      return `${penaltyFeePercent}%`;
    },
    totalPenaltyFee () {
      const amountMoney = BigNumber(Number(this.amountMoney));
      const penaltyFee = BigNumber(Number(this.orderDetail?.penaltyFeePercent || 0));
      return this.$options.filters.formatMoney(amountMoney.multipliedBy(penaltyFee).toString());
    }
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/merchant/order-detail/order-info.scss" />
