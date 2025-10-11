<template>
  <div class="posting-item font-t10m grey-400" @click="$router.push(`/merchant/postings-history/${post.postId}`)">
    <div class="posting-item__top d-flex justify-content-between align-align-items-start pb-1 mb-2">
      <div class="posting-item__top-left font-t12m">
        <span class="post-type mr-1" :class="getColor">
          {{ $t('home.' + getPostType) }}
        </span>
        <span class="grey-900">{{ post.cryptoName }}</span> ({{ post.cryptoNetwork }}) <span class="grey-300 mr-1">với</span><span class="grey-900 font-t14m">{{ post.fiatName }}</span>
        <div class="post-code font-t14m grey-600">#{{ post.postRefId }}</div>
      </div>
      <div class="posting-item__top-right d-flex justify-content-end align-items-start">
        <span class="posting-item__status grey-400 font-t12m ">
          {{ getStatusText(post.status) }}
        </span>
      </div>
    </div>
    <!-- top -->
    <div class="posting-item__row d-flex justify-content-between align-items-center mb-2">
      <span>{{ this.$t('postings_history.total_amount') }}</span>
      <div class="post-amount font-t16b grey-600"> {{ (post.totalAmount || 0 ) | formatCrypto }} {{ post.cryptoName }}</div>
    </div>
    <div class="posting-item__row d-flex justify-content-between align-items-center mb-2">
      <span>{{ this.$t('postings.table.total_trans') }}</span>
      <span class="grey-600 font-t12m">{{ (post.finishedAmount || 0) | formatCrypto }} {{ post.cryptoName }}</span>
    </div>
    <div class="posting-item__row d-flex justify-content-between align-items-center mb-2">
      <span>{{ this.$t('postings.table.success_percent') }}</span>
      <progress-line class="posting-item__progress-line" :percent="cryptoCompleted" />
    </div>
    <div class="posting-item__row d-flex justify-content-between align-items-center mb-2">
      <span> {{ this.$t('postings_history.total_fee') }}</span>
      <span class="grey-600 font-t12m"><span class="text-underline">{{ post.fiatSymbol }}</span> {{ (post.totalFee || 0) | formatMoney }}</span>
    </div>
    <div class="posting-item__row d-flex justify-content-between align-items-center">
      <span>{{ this.$t('postings_history.total_penalty_fee') }}</span>
      <span class="grey-600 font-t12m"><span class="text-underline">{{ post.fiatSymbol }}</span> {{ (post.totalPenaltyFee || 0) | formatMoney }}</span>
    </div>
    <div class="posting-item__row d-flex justify-content-end mt-4">
      <span class="grey-400 font-t12m">{{ post.updatedAt | diffForHumans }}</span>
    </div>
  </div>
</template>

<script>
import { ORDER_TYPE } from '@/resources/order-type.js';
import { LIST_STATUS } from '@/resources/postings-management.js';
import BigNumber from 'bignumber.js';

export default {
  components: {
    ProgressLine: () => import('~/components/common/progress-line/index.vue')
  },
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
    getPostType () {
      return this.post.postType?.toLowerCase();
    },
    getColor () {
      return this.post.postType === ORDER_TYPE.SELL ? 'sell-color' : 'buy-color'
    },
    cryptoCompleted () {
      const percent = this.post?.percentCryptoCompleted || 0
      return percent !== 0 ? new BigNumber(percent).multipliedBy(100).toNumber().toFixed(2) : 0
    }
  },
  methods: {
    getStatusText (status) {
      return this.$t(`postings.${status?.toLowerCase()}`)
    }
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/mobile/merchant/postings/posting-item.scss" />
