<template>
  <div class="posting-item font-t10m grey-400">
    <div class="posting-item__top d-flex justify-content-between align-align-items-start pb-1 mb-2">
      <div class="posting-item__top-left">
        <span class="d-block font-t14m grey-600">#{{ post.orderRefId }}</span>
        {{ post.updatedAt | formatDateTime }}
      </div>
      <div class="posting-item__top-right d-flex justify-content-end align-items-start">
        <span class="posting-item__status font-t12m grey-400">
          {{ getStatusText(post.status) }}
        </span>
      </div>
    </div>
    <!-- top -->
    <div class="posting-item__row d-flex justify-content-between align-items-center mb-1">
      <span>{{ $t('postings_history.price_number') }}</span>
      <div class="font-t12m grey-600"><span class="text-underline">{{ post.fiatSymbol }}</span> {{ (post.totalPrice || 0) | formatMoney }}</div>
    </div>
    <div class="posting-item__row d-flex justify-content-between align-items-center mb-1">
      <span>{{ $t('postings_history.detail.transfer_content') }}</span>
      <div class="font-t12m grey-600">{{ post.transCode }}</div>
    </div>
    <div class="posting-item__row d-flex justify-content-between align-items-center mb-1">
      <span>{{ $t('postings_history.detail.transfer_number') }}</span>
      <div class="font-t12m grey-600">{{ (post.amount || 0) | formatCrypto(decimalLimit) }} {{ post.assetName }}</div>
    </div>
    <div class="posting-item__row d-flex justify-content-between align-items-center mb-1">
      <span>{{ $t('postings_history.price') }}</span>
      <div class="font-t12m grey-600"><span class="text-underline">{{ post.fiatSymbol }}</span> {{ post.price | formatCrypto(decimalLimit, 'ceil') }}</div>
    </div>
    <div class="posting-item__row d-flex justify-content-between align-items-center mb-1">
      <span>{{ $t('postings_history.detail.total_fee') }}</span>
      <template v-if="hasTotalFee">
        <div class="font-t12m grey-600"><span class="text-underline">{{ post.fiatSymbol }}</span> {{ (post.totalFee || 0) | formatMoney }}<span class="grey-400"> ({{ getFee }} %)</span></div>
      </template>
      <template v-else>
        <span>&#8722;</span>
      </template>
    </div>
    <div class="posting-item__row d-flex justify-content-between align-items-center mb-1">
      <span>{{ $t('postings_history.detail.total_penalty_fee') }}</span>
      <template v-if="hasTotalPenaltyFee">
        <div class="font-t12m grey-600"><span class="text-underline">
          {{ post.fiatSymbol }}</span> {{ (post.totalPenaltyFee || 0) | formatMoney }}<span class="grey-400"> ({{ getPenaltyFee }} %)</span>
        </div>
      </template>
      <template v-else>
        <span>&#8722;</span>
      </template>
    </div>
  </div>
</template>

<script>
import { ORDER_TYPE } from '@/resources/order-type.js';
import { LIST_STATUS } from '@/resources/postings-management.js';
import { ORDER_STATUS } from '@/config/constant'
import BigNumber from 'bignumber.js';
import { mapState } from 'vuex';

export default {
  props: {
    post: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      ORDER_TYPE,
      LIST_STATUS,
      status: LIST_STATUS[this.post.status]?.name
    }
  },
  computed: {
    ...mapState('resources', ['assets']),
    setLabelStatus () {
      return this.$t(`postings.post_item.${this.post.status?.toLowerCase()}`)
    },
    getFee () {
      return new BigNumber(this.post?.feePercent || 0).multipliedBy(100).toNumber().toFixed(2)
    },
    getPenaltyFee () {
      return new BigNumber(this.post?.penaltyFeePercent || 0).multipliedBy(100).toNumber().toFixed(2)
    },
    decimalLimit () {
      return this.assets.find(item => item.id === this.asset?.id)?.precision || 0
    },
    asset () {
      return this.assets.find(item => item.name === this.post?.assetName && item.network === this.post?.assetNetwork)
    },
    hasTotalFee () {
      return new BigNumber(this.post?.totalFee).toNumber() > 0
    },
    hasTotalPenaltyFee () {
      return new BigNumber(this.post?.totalPenaltyFee).toNumber() > 0
    }
  },
  methods: {
    getStatusText (status) {
      return status === ORDER_STATUS.CANCELLED ? this.$t('user_orders.status_cancel') : this.$t('user_orders.status_done')
    }
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/mobile/merchant/postings-history/detail-item.scss" />
