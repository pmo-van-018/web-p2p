<template>
  <div class="posting-list">
    <list-common
      class="posting-list__table"
      :loading="isLoadingData"
      :items="items"
      :re-preload="isLoadingData"
      :total="total"
      show-empty
      :reset-list="page === 1"
      key-field="id"
      @refresh="onRefresh"
      @infinite-loading="onInfiniteLoading"
    >
      <template #default="{ item, dataIndex }">
        <div :class="['posting-list__wrapper', {'disable': item.disable }]">
          <div
            :key="item.id"
            class="posting-list__item"
            :class="{'posting-list__item--even': dataIndex % 2 === 0}"
          >
            <post-item
              :item="item"
              :is-online="checkPostOnline(item.id)"
              type="buy"
              @click-detail="onClickItem(item)"
            />
          </div>
        </div>
      </template>
    </list-common>
    <PostDetailBuy ref="postDetailBuy" :cf-token="cfToken" @cf-verify="$emit('cf-verify')" />
  </div>
</template>

<script>
import merchantPublicViewCommonMixin from '@/mixins/merchant/public-view/common.js'
import PostDetailBuy from '@/components/mobile/list-post/post-detail-buy.vue';
import { POST_TYPE } from '@/config/constant';
import PostStatusMixin from '@/mixins/home/post-status';
import PostItem from './post-item.vue';

export default {
  components: {
    PostItem,
    ListCommon: () => import('~/components/mobile/commons/list/index.vue'),
    PostDetailBuy
  },
  mixins: [merchantPublicViewCommonMixin, PostStatusMixin],
  computed: {
    params () {
      return {
        page: this.page,
        fiat: 'VND',
        limit: this.perPage,
        type: POST_TYPE.SELL
      }
    }
  },
  async mounted () {
    await this.$merchantPublicViewMixin_getList()
  },
  methods: {
    onInfiniteLoading () {
      if (!this.isLoading && this.currentPage < this.total) {
        this.page = this.currentPage + 1
        this.$merchantPublicViewMixin_getList(true)
      }
    },
    showDetail (e) {
      if (this.$refs.postDetailBuy) {
        this.$refs.postDetailBuy.show(this.selectedItem(e))
      }
    },
    onRefresh () {
      this.page = 1
      this.$merchantPublicViewMixin_getList()
    },
    onClickItem (item) {
      if (!item?.disable) {
        this.onRowClicked(item)
      }
    }
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/mobile/list-post/index.scss">
</style>
