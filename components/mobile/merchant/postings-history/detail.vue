<template>
  <div class="postings w-100">
    <div class="postings__top d-flex align-items-center justify-content-between font-t16m grey-900">
      <div class="d-flex align-items-center">
        <span role="button" class="icon-chevron-right1 mr-1" @click="$router.push('/merchant/postings-history')" />
        <span>{{ $t('postings_history.detail.title') }}</span>
      </div>
      <span
        role="button"
        class="icon-duplicated-plus font-t24r"
        @click="handleClonePost(post.postId)"
      >
        <span class="path1" /><span class="path2" /><span class="path3" />
      </span>
    </div>
    <div v-if="post" class="postings-detail font-t10m grey-400">
      <div class="d-flex postings-detail-item top mb-2">
        <div>
          {{ $t('postings_history.detail.post_id') }}
          <span class="d-block grey-900 font-t14m">#{{ post.postRefId }}</span>
        </div>
        <div class="postings-detail-item">
          {{ $t('postings_history.detail.status') }}
          <span class="d-block grey-700 font-t14m">{{ $t(`postings.${post.status?.toLowerCase()}`) }}</span>
        </div>
      </div>
      <!-- item -->
      <div class="d-flex postings-detail-item pt-1 info">
        <div class="info__row">
          {{ $t('postings_history.detail.type') }}
          <span class="d-block grey-900 font-t14m" :class="getColor">{{ $t('home.' + post.postType.toLowerCase()) }}</span>
        </div>
        <div class="info__row">
          {{ $t('postings_history.detail.cryptocurrency') }}
          <span class="postings-detail__data d-block grey-900 font-t14m">{{ post.cryptoName }} <span class="grey-600">({{ post.cryptoNetwork }})</span></span>
        </div>
        <div class="info__row">
          {{ $t('postings_history.detail.fiat_money') }}
          <span class="postings-detail__data d-block grey-900 font-t14m">{{ post.fiatName }}</span>
        </div>
      </div>
      <div class="postings-detail-item center">
        <div class="pb-2">
          {{ $t('postings_history.detail.transfer_number') }}
          <span class="postings-detail__data d-block grey-900 font-t14m mb-1">{{ getAmountTransfer }} {{ post.cryptoName }} / {{ getTotalAmount }} {{ post.cryptoName }}</span>
        </div>
        <div class="pb-2">
          {{ this.$t('postings.table.success_percent') }}
          <progress-line :percent="cryptoCompleted" />
        </div>
        <div class="pb-2">
          {{ $t('postings_history.detail.limit_order') }}
          <span class="d-block grey-900 font-t14m mb-1"><span class="text-underline">{{ post.fiatSymbol }}</span> {{ getLowerFiat | formatMoney }} - <span class="text-underline">{{ post.fiatSymbol }}</span> {{ getUpperFiat | formatMoney }}</span>
        </div>
        <div class="pb-2">
          {{ $t('postings_history.detail.total_fee') }}
          <span class="d-block grey-900 font-t14m mb-1"><span class="text-underline">{{ post.fiatSymbol }}</span> {{ (post.totalFee || 0) | formatMoney }}</span>
        </div>
        <div class="pb-2">
          {{ $t('postings_history.detail.total_penalty_fee') }}
          <span class="d-block grey-900 font-t14m mb-1"><span class="text-underline">{{ post.fiatSymbol }}</span> {{ (post.totalPenaltyFee || 0) | formatMoney }}</span>
        </div>
      </div>
      <!-- item -->
      <div class="postings-detail-item pt-2 bottom">
        <div class="mt-1">
          {{ $t('postings_history.detail.time_update') }}
          <span class="d-block grey-700 font-t14m">{{ post.updatedAt | formatDateTime }}</span>
        </div>
        <div>
          {{ $t('postings_history.detail.time_create') }}
          <span class="d-block  grey-700 font-t14m">{{ post.createdAt | formatDateTime }}</span>
        </div>
      </div>
    </div>
    <div class="postings__content">
      <div class="postings-table">
        <div class="t-body">
          <list-common
            class="completed-order__list"
            key-field="orderId"
            :loading="isLoading"
            :items="orders"
            :total="total"
            show-empty
            :reset-list="page === 1"
            @refresh="onRefresh"
            @infinite-loading="onInfiniteLoadingOrder"
          >
            <template #default="{ item }">
              <PostingItem :key="item.orderId" :post="item" />
            </template>
          </list-common>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import postingDetailMixin from '@/mixins/merchant/posting-detail.js'
import ListCommon from '@/components/mobile/commons/list/index.vue';
import postingCloneMixin from '@/mixins/merchant/posting-clone.js'
import PostingItem from '@/components/mobile/merchant/postings-history/detail-item'
import BigNumber from 'bignumber.js';
export default {
  components: {
    ListCommon,
    PostingItem,
    ProgressLine: () => import('~/components/common/progress-line/index.vue')
  },
  mixins: [postingDetailMixin, postingCloneMixin],
  computed: {
    cryptoCompleted () {
      const percent = this.post?.percentCryptoCompleted || 0
      return percent !== 0 ? new BigNumber(percent).multipliedBy(100).toNumber().toFixed(2) : 0
    }
  },
  methods: {
    async onRefresh () {
      this.page = 1
      await this.getOrderByPost()
    },
    async onInfiniteLoadingOrder () {
      if (this.orders.length < this.total) {
        this.page = this.page + 1
        await this.getOrderByPost(true)
      }
    }
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/mobile/merchant/postings-history/detail.scss" />
