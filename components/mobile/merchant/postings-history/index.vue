<template>
  <div class="postings w-100">
    <client-only>
      <template #placeholder>
        <div class="my-2 mx-2">
          <order-filter-skeleton-loader />
          <order-filter-skeleton-loader class="my-2" />
          <order-card-skeleton-loader v-for="key in DEFAULT_LOADER" :key="key" />
        </div>
      </template>
      <div class="postings__top d-flex align-items-center font-t16m grey-900">
        <span class="icon-chevron-right1 mr-1" @click="$router.push('/merchant/postings')" /> {{ $t('postings_history.title') }}
      </div>
      <div class="postings__content">
        <van-sticky class="postings__head" :offset-top="56" z-index="999">
          <div class="postings__head-inner">
            <posting-filter hide-status-type @on-filters="onFilterOptions" />
          </div>
        </van-sticky>
        <div class="postings-table">
          <div class="t-body">
            <list-common
              class="completed-order__list"
              key-field="postId"
              :loading="isLoading"
              :items="postsHistories"
              :total="total"
              show-empty
              :reset-list="page === 1"
              @refresh="onRefresh"
              @infinite-loading="onInfiniteLoadingOrder"
            >
              <template #default="{ item }">
                <PostingItem :key="item.postId" :post="item" />
              </template>
            </list-common>
          </div>
        </div>
      </div>
    </client-only>
  </div>
</template>

<script>
import PostingFilter from '@/components/mobile/commons/filters/list-posting/posting-filter.vue';
import ListCommon from '@/components/mobile/commons/list/index.vue';
import PostingItem from '@/components/mobile/merchant/postings-history/posting-item.vue';
import { mapActions, mapGetters, mapState } from 'vuex'
import { POST_STATUS } from '@/constants/posts'
import VanSticky from 'vant/lib/sticky'
import 'vant/lib/sticky/style'

export default {
  components: {
    PostingFilter,
    PostingItem,
    ListCommon,
    VanSticky,
    OrderCardSkeletonLoader: () => import('~/components/mobile/commons/loader/order/index.vue'),
    OrderFilterSkeletonLoader: () => import('~/components/mobile/commons/loader/filters/index.vue')
  },
  data () {
    return {
      page: 1,
      DEFAULT_LOADER: 5
    }
  },
  computed: {
    ...mapState('merchant-posting', ['total', 'isLoading']),
    ...mapGetters('merchant-posting', ['postsHistories'])
  },
  async created () {
    this.onResetStateFilter()
    await this.updateMultiFilter({ orderField: 'updatedAt', status: POST_STATUS.CLOSED })
  },
  methods: {
    ...mapActions('merchant-posting', [
      'updateMultiFilter',
      'onLoadInfinitePost',
      'onResetStateFilter'
    ]),
    async onRefresh () {
      this.page = 1
      await this.updateMultiFilter({ page: this.page, status: POST_STATUS.CLOSED })
    },
    async onFilterOptions (options) {
      await this.updateMultiFilter({ ...options, ...{ status: POST_STATUS.CLOSED } })
    },
    async onInfiniteLoadingOrder () {
      if (this.postsHistories.length < this.total && !this.isLoading) {
        this.page = this.page + 1
        await this.onLoadInfinitePost({ page: this.page, status: POST_STATUS.CLOSED })
      }
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/mobile/merchant/postings/index.scss" />
