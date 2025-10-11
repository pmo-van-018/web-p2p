<template>
  <div class="posting-item font-t10m grey-400">
    <div class="posting-item__top d-flex justify-content-between align-align-items-start pb-1 mb-2">
      <div class="posting-item__top-left">
        <span class="post-type font-t12m mr-1" :class="getColor">
          {{ $t('home.' + getPostType) }}
        </span>
        <span class="grey-900 font-t12m">{{ post.cryptoName }}</span> <span class="font-t12m">({{ post.cryptoNetwork }})</span> <span class="grey-300 font-t12m">với</span> <span class="grey-900 font-t12m">{{ post.fiatName }}</span>
        <div class="post-code font-t14m grey-600">#{{ post.postRefId }}</div>
      </div>
      <div class="posting-item__top-right d-flex justify-content-end align-items-start">
        <span class="posting-item__status mr-2 font-t12m grey-400" :class="`${post.status?.toLowerCase()}-status`">
          {{ setLabelStatus }}
        </span>
        <switch-check-box :value="getStatus" @click="handleModalSetPost" />
      </div>
    </div>
    <!-- top -->
    <div class="posting-item__row d-flex justify-content-between align-items-center mb-1">
      <span>{{ $t("postings.table.available") }}</span>
      <div class="post-amount font-t16b grey-600">{{ (post.availableAmount || 0 ) | formatCrypto }} {{ post.cryptoName }}</div>
    </div>
    <div class="posting-item__row d-flex justify-content-between align-items-center mb-2">
      <span>{{ $t("postings.table.limit") }}</span>
      <div class="post-limit font-t12m"><span class="text-underline">{{ post.fiatSymbol }}</span> {{ (post.lowerFiatLimit || 0) | formatMoney }} - <span class="text-underline">{{ post.fiatSymbol }}</span> {{ (post.upperFiatLimit || 0) | formatMoney }}</div>
    </div>
    <div class="posting-item__row d-flex justify-content-between align-items-center mb-1">
      <span>{{ $t("postings.table.total_trans") }}</span>
      <span class="grey-600 font-t12m">{{ (post.finishedAmount || 0) | formatCrypto }} {{ post.cryptoName }}</span>
    </div>
    <div class="posting-item__row d-flex justify-content-between align-items-center mb-2">
      <span>{{ $t("postings.table.total_percent") }}</span>
      <progress-line class="posting-item__progress-line" :percent="cryptoCompleted" />
    </div>
    <div class="posting-item__price d-flex justify-content-between pt-1">
      <div class="font-t20b grey-600">{{ post.fiatSymbol }} {{ post.price | formatCrypto(decimalLimit, 'ceil') }}</div>
      <span class="icon-edit-dots" @click="$emit('show-toolbar', post)" />
    </div>
    <div class="posting-item__row d-flex justify-content-end mt-4">
      <span class="grey-400 font-t12m">{{ post.updatedAt | diffForHumans }}</span>
    </div>
  </div>
</template>

<script>
import order from '@/mixins/order';
import { LIST_STATUS } from '@/resources/postings-management.js';
import { POST_STATUS, POST_STATUS_TYPE } from '@/constants/posts'
import { mapState } from 'vuex'
import BigNumber from 'bignumber.js';

export default {
  components: {
    SwitchCheckBox: () => import('~/components/common/forms/switch-checkbox/index.vue'),
    ProgressLine: () => import('~/components/common/progress-line/index.vue')
  },
  mixins: [order],
  props: {
    post: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      LIST_STATUS,
      status: POST_STATUS[this.post.status]
    }
  },
  computed: {
    ...mapState('merchant-posting', ['currentPosting']),
    ...mapState('resources', ['assets']),
    getStatus () {
      return this.post.status === POST_STATUS_TYPE.ONLINE
    },
    setLabelStatus () {
      return this.$t(`postings.post_item.${this.post.status?.toLowerCase()}`)
    },
    cryptoCompleted () {
      const percent = this.post?.percentCryptoCompleted || 0
      return percent !== 0 ? new BigNumber(percent).multipliedBy(100).toNumber().toFixed(2) : 0
    },
    decimalLimit () {
      return this.assets.find(item => item.id === this.asset?.id)?.precision || 0
    },
    asset () {
      return this.assets.find(item => item.name === this.post?.cryptoName && item.network === this.post?.cryptoNetwork)
    }
  },
  methods: {
    handleModalSetPost () {
      this.$emit('show-modal-set-post', this.post)
    }
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/mobile/merchant/postings/posting-item.scss" />
