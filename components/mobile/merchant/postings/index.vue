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
      <div class="postings__top d-flex justify-content-between align-items-center">
        <span class="postings__title font-t16m grey-900"> {{ $t('postings.title') }}</span>
        <div class="postings__create d-flex align-items-center grey-900">
          <span class="icon-add-primary" @click="$router.push('/merchant/create-ad')" />
          <span class="postings__button icon-history1" @click="$router.push('/merchant/postings-history')" />
        </div>
      </div>
      <div class="postings__content">
        <van-sticky class="postings__head" :offset-top="56" z-index="999">
          <div class="postings__head-inner">
            <posting-filter @on-filters="onFilterOptions" />
          </div>
        </van-sticky>
        <div class="postings-table">
          <div class="t-body">
            <list-common
              class="completed-order__list"
              key-field="id"
              :loading="isLoading"
              :items="postsListing"
              :total="total"
              show-empty
              :reset-list="page === 1"
              @refresh="onRefresh"
              @infinite-loading="onInfiniteLoadingOrder"
            >
              <template #default="{ item }">
                <PostingItem
                  :key="item.id"
                  :post="item"
                  @show-modal-set-post="showModalToggleDisplay"
                  @show-toolbar="showModalToolbar"
                />
              </template>
            </list-common>
          </div>
          <ModalToobar @on-edit="onEdit" @show-modal-close="showModalClosePost" @on-clone-post="onClonePosting" />
          <ModalSetPostingStatus @handle-click="onToggleStatusPosting" />
        </div>
      </div>
    </client-only>
  </div>
</template>

<script>
import ModalToobar from '@/components/mobile/modal/modal-toolbar';
import postingListingMixin from '@/mixins/merchant/posting-listing.js'
import PostingFilter from '@/components/mobile/commons/filters/list-posting/posting-filter.vue';
import ListCommon from '@/components/mobile/commons/list/index.vue';
import PostingItem from '@/components/mobile/merchant/postings/posting-item.vue';
import { mapActions, mapGetters, mapState } from 'vuex'
import { POST_STATUS_TYPE } from '@/constants/posts'
import postingCloneMixin from '@/mixins/merchant/posting-clone';
import { STATUS_AVAILABLE_FILTER } from '@/resources/postings-management';
import VanSticky from 'vant/lib/sticky'
import 'vant/lib/sticky/style'

export default {
  components: {
    VanSticky,
    PostingItem,
    ModalToobar,
    PostingFilter,
    ListCommon,
    OrderCardSkeletonLoader: () => import('~/components/mobile/commons/loader/order/index.vue'),
    OrderFilterSkeletonLoader: () => import('~/components/mobile/commons/loader/filters/index.vue')
  },
  mixins: [postingListingMixin, postingCloneMixin],
  data () {
    return {
      page: 1,
      DEFAULT_LOADER: 5
    }
  },
  computed: {
    ...mapState('merchant-posting', ['total', 'posts', 'isLoading', 'currentPosting']),
    ...mapGetters('merchant-posting', ['postsListing'])
  },
  async created () {
    this.onResetStateFilter()
    await this.updateMultiFilter({ orderField: 'createdAt', status: STATUS_AVAILABLE_FILTER })
  },
  methods: {
    ...mapActions('merchant-posting', [
      'getPostingList',
      'updateMultiFilter',
      'onLoadInfinitePost',
      'onSetCurrentPost',
      'onResetStateFilter'
    ]),
    showModalToolbar (post) {
      this.onSetCurrentPost({
        id: post.postId,
        isClose: true,
        status: POST_STATUS_TYPE.CLOSE
      })
      this.$bvModal.show(this.MODAL.TOOLBAR)
    },
    async onRefresh () {
      this.page = 1
      await this.updateMultiFilter({ page: this.page })
    },
    async onFilterOptions (options) {
      await this.updateMultiFilter(options)
    },
    async onInfiniteLoadingOrder () {
      if (this.postsListing.length < this.total) {
        this.page = this.page + 1
        await this.onLoadInfinitePost({ page: this.page })
      }
    },
    onClonePosting () {
      this.handleClonePost(this.currentPosting.id)
    }
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/mobile/merchant/postings/index.scss" />
