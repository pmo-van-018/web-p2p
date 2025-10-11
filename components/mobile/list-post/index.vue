<template>
  <LandingPageLayout :tabs="tabPanels" :active-tab="activeTab">
    <template #list>
      <div class="posting-list">
        <list-common
          class="posting-list__table"
          :loading="isLoading"
          :items="posts"
          :re-preload="isLoading"
          :total="totalPage"
          show-empty
          render-ssr
          :reset-list="page === 1"
          key-field="id"
          @refresh="onRefresh"
          @infinite-loading="onInfiniteLoading"
        >
          <template #default="{ item, dataIndex }">
            <div class="posting-list__wrapper">
              <div
                :key="item.id"
                class="posting-list__item"
                :class="{'posting-list__item--even': dataIndex % 2 === 0}"
              >
                <post-item
                  :item="item"
                  :type="assetType"
                  :item-active="item.id === itemActive"
                  @click-detail="onClickItem(item)"
                />
              </div>
            </div>
          </template>
        </list-common>
      </div>
      <client-only>
        <PostDetailBuy ref="postDetailBuy" :cf-token="cfToken" />
        <PostDetailSell ref="postDetailSell" :cf-token="cfToken" />
        <ModalAddBank />
        <modal-cf-turnstile :verify="isShowCfVerify" @challenge="onCfChallengeResult" />
      </client-only>
    </template>
  </LandingPageLayout>
</template>
<script>
import BuyMixin from '@/mixins/home/buy-mixin';
import LandingPageLayout from '@/components/common/home/landing-page-layout-mobile.vue';
import { ORDER_TYPE } from '@/resources/order-type.js';
import { mapActions, mapState } from 'vuex'
import isEmpty from 'lodash/isEmpty';
import POST_API from '@/api/post';
import PostItem from './post-item.vue';

export default {
  components: {
    LandingPageLayout,
    PostItem,
    PostDetailBuy: () => import('~/components/mobile/list-post/post-detail-buy.vue'),
    PostDetailSell: () => import('~/components/mobile/list-post/post-detail-sell.vue'),
    ModalAddBank: () => import('~/components/mobile/modal/modal-add-bank.vue'),
    ListCommon: () => import('~/components/mobile/commons/list/index.vue'),
    ModalCfTurnstile: () => import('~/components/common/modal/modal-cf-turnstile.vue')
  },
  mixins: [BuyMixin],
  data () {
    return {
      page: 1,
      firstLoading: true
    }
  },
  computed: {
    ...mapState('resources', ['assets', 'fiats']),
    ...mapState('payments', ['payments']),
    ...mapState('post', ['isLoading']),
    ...mapState('web3-onboard', ['isVisibleWeb3Onboard']),
    hasResources () {
      return !!this.assets.length && !!this.fiats.length
    },
    isLoadPayments () {
      return !this.payments.length && this.$route.path === '/marketplace/sell' && !isEmpty(this.$store.state.user.user)
    },
    isBotChromeLighthouse () {
      if (process.client) {
        return this.$checkLighthouseBot()
      }
      return false
    }
  },
  async fetch () {
    if (!this.hasResources) {
      await this.getResources()
    }
    await Promise.all([
      this.onSearchPost(),
      this.getSearchOptions(),
      this.isLoadPayments ? this.getUserListPayment() : []
    ])
  },
  created () {
    if (this.activeTab === -1) {
      this.$router.push({
        path: this.$route.fullPath,
        ...(this.firstTabKey && { query: { asset: this.firstTabKey } })
      }).catch(() => {});
    }
    if (this.isVisibleWeb3Onboard && !this.user) {
      this.$_authMixin_connect()
      this.setVisibleWeb3Onboard(false)
    }
    this.setPathSearchPost(this.user ? POST_API.SEARCH : POST_API.SEARCH_BRIEF)
  },
  methods: {
    ...mapActions('post', ['onLoadInfinitePost', 'searchPost', 'onRefresh', 'getSearchOptions', 'setPathSearchPost']),
    ...mapActions('payments', ['getUserListPayment']),
    ...mapActions('web3-onboard', ['setVisibleWeb3Onboard']),
    showDetail (e) {
      if (this.$refs.postDetailSell && this.assetType === ORDER_TYPE.BUY) {
        this.$refs.postDetailSell.show(e)
      }
      if (this.$refs.postDetailBuy && this.assetType === ORDER_TYPE.SELL) {
        this.$refs.postDetailBuy.show(e)
      }
    },
    async onInfiniteLoading () {
      if (!this.isLoading && this.currentPage < this.totalPage) {
        this.page = this.currentPage + 1
        await this.onLoadInfinitePost({ currentPage: this.page })
      }
    },
    onClickItem (item) {
      if (this.user) {
        this.clickDetail(item)
        this.showDetail(item)
        return
      }
      this.$_authMixin_onConnectUserWallet()
    }
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/mobile/list-post/index.scss">
</style>
