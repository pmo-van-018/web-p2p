<template>
  <landing-page-layout :tabs="tabPanels" :active-tab="activeTab" @play="handlePlay">
    <div class="list-post">
      <div class="content-title">
        <div class="title">
          {{ isSellOrders ? $t("home.buyer") : $t('home.seller') }}
          <template>
            <b-tooltip target="merchant-statistic" triggers="hover" placement="top" custom-class="statistic-tooltip">
              {{ $t('home.statistic_tooltip') }}
            </b-tooltip>
            <span
              id="merchant-statistic"
              class="icon-info-circle cursor-pointer"
              tabindex="0"
            />
          </template>
        </div>
        <div class="title">
          {{ sortPriceTitle }}
          <div :class="['head-title__arrow', sortFieldClass]" @click="handleSort">
            <span class="head-title__icon icon-sort-increase" />
            <span class="head-title__icon icon-sort-decrease" />
          </div>
        </div>
        <p class="title">{{ $t('home.available_limit') }}</p>
        <p class="title last-title">{{ $t('home.action') }}</p>
      </div>
      <div>
        <div v-if="isLoading" class="list-post__loading">
          <loader />
        </div>
        <div v-else-if="isEmptyPosts" class="empty">
          <no-data />
        </div>
        <template v-else>
          <post-item
            v-for="item in posts"
            :key="item.id"
            :item="item"
            :type="assetType"
            :is-online="isOnline(item.id)"
            :item-active="item.id === itemActive"
            @click-detail="clickDetail(item)"
            @on-authenticate="$_authMixin_onConnectUserWallet"
            @cancel-transaction="cancelTransaction"
          />
          <pagination
            v-if="total > perPage"
            class="content-pagination mt-3"
            :total="total"
            :current-page="currentPage"
            :per-page="perPage"
            @handle-page="handlePage"
          />
        </template>
      </div>
      <client-only>
        <modal-cf-turnstile :verify="isShowCfVerify" @challenge="onCfChallengeResult" />
      </client-only>
    </div>
  </landing-page-layout>
</template>
<script>
import BuyMixin from '@/mixins/home/buy-mixin';
import LandingPageLayout from '@/components/common/home/landing-page-layout.vue';
import { mapActions, mapState } from 'vuex';
import isEmpty from 'lodash/isEmpty';
import auth from '@/mixins/auth';
import PostItem from '@/components/desktop/list-post/post-item.vue';
import POST_API from '@/api/post';

export default {
  components: {
    PostItem,
    LandingPageLayout,
    ModalCfTurnstile: () => import('~/components/common/modal/modal-cf-turnstile.vue'),
    NoData: () => import('~/components/common/no-data.vue'),
    Loader: () => import('~/components/common/loader.vue')
  },
  mixins: [auth, BuyMixin],
  async fetch () {
    if (!this.hasResources) {
      await this.getResources()
    }
    await Promise.all([
      this.onSearchPost(),
      this.isLoadPayments ? this.getUserListPayment() : []
    ])
  },
  data () {
    return {
      sortNumber: 1,
      sortFieldClass: '',
      sortFieldObject: {
        ASC: this.$t('home.price_low_to_hight'),
        DESC: this.$t('home.price_hight_to_low')
      }
    }
  },
  computed: {
    ...mapState('post', ['amount', 'postStatus']),
    ...mapState('resources', ['assets', 'fiats']),
    ...mapState('payments', ['payments']),
    ...mapState('web3-onboard', ['isVisibleWeb3Onboard']),
    isLoadPayments () {
      return !this.payments.length && this.$route.path === '/marketplace/sell' && !isEmpty(this.$store.state.user.user)
    },
    hasResources () {
      return !!this.assets.length && !!this.fiats.length
    },
    isSellOrders () {
      return this.$route.path === '/marketplace/sell'
    },
    sortPriceTitle () {
      if (this.sortFieldClass) {
        return this.sortFieldObject[this.sortFieldClass.toUpperCase()]
      }
      return this.isSellOrders ? this.$t('home.price_hight_to_low') : this.$t('home.price_low_to_hight')
    }
  },
  created () {
    if (this.activeTab === -1) {
      this.$router.push({
        path: this.$route.fullPath,
        ...(this.firstTabKey && { query: { asset: this.firstTabKey } })
      }).catch(() => {});
    }
    this.setPathSearchPost(this.user ? POST_API.SEARCH : POST_API.SEARCH_BRIEF)
    if (this.isVisibleWeb3Onboard && !this.user) {
      this.$_authMixin_connect()
      this.setVisibleWeb3Onboard(false)
    }
  },
  methods: {
    ...mapActions('post', ['searchPost', 'reset', 'setPathSearchPost']),
    ...mapActions('payments', ['getUserListPayment']),
    ...mapActions('modal-response', ['showResponseModal']),
    ...mapActions('web3-onboard', ['setVisibleWeb3Onboard']),
    handlePlay () {
      this.cancelTransaction();
    },
    isOnline (postId) {
      return this.postStatus?.includes(postId)
    },
    async handleSort () {
      if (this.sortNumber === 4) {
        this.sortNumber = 1
      }
      const sortDirection = {
        1: 'ASC',
        2: 'DESC',
        3: ''
      }[this.sortNumber];
      this.sortFieldClass = sortDirection ? sortDirection.toLowerCase() : ''
      this.sortNumber = this.sortNumber + 1;
      await this.onSearchPost(this.sortFieldClass.toUpperCase())
    }
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/list-posts/index.scss" />
<style lang="scss">
.statistic-tooltip {
  .tooltip-inner {
    min-width: 229px;
  }
}
</style>
