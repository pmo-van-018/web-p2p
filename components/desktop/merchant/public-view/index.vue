<template>
  <section class="public-view">
    <div class="public-view__header">
      <div class="merchant-name">
        <div class="container">
          <img v-if="avatar" class="avatar-img" :src="avatar" alt="avatar">
          <b-avatar v-else :style="{ backgroundColor: backgroundAvatar}" class="mr-2" size="56px">
            <span class="avatar-character">{{ firstCharNickName }}</span>
          </b-avatar>
          <span class="name">{{ merchantInfo.merchantName }}</span>
        </div>
      </div>
      <div class="merchant-data container">
        <dashboard-card
          :overview-data="{
            title: $t('overview.trans_all.title'),
            note: $t('overview.trans_all.note'),
            value: merchantInfo?.transTotal.total || 0,
            symbol: $t('merchant.overview.times'),
            icon: '/assets/icons/dashboard/all-transaction.svg',
            buyAmount: merchantInfo?.transTotal.buy || 0,
            sellAmount: merchantInfo?.transTotal.sell || 0
          }"
        />
        <dashboard-card
          :overview-data="{
            title: $t('overview.trans_in_month.title'),
            value: merchantInfo.transInMonth.total || 0,
            note: $t('overview.trans_in_month.note'),
            symbol: $t('merchant.overview.times'),
            icon: '/assets/icons/dashboard/all-transaction.svg',
            buyAmount: merchantInfo.transInMonth.buy || 0,
            sellAmount: merchantInfo.transInMonth.sell || 0
          }"
        />
        <dashboard-card
          :overview-data="{
            title: $t('merchant.public_view.completion_rate_month.title'),
            value: formatCompletedRate || 0,
            note: $t('merchant.public_view.completion_rate_month.note'),
            symbol: '%',
            icon: '/assets/icons/dashboard/all-transaction.svg'
          }"
        />
      </div>
    </div>
    <div class="public-view__tabs">
      <div class="container">
        <tabs-panel
          :key="activeTab"
          :tabs="tabs"
          :active="activeTab"
          @change-tab="onTabChange"
        />
      </div>
    </div>
    <div class="public-view__content container">
      <div class="table">
        <keep-alive>
          <component :is="activatedComponent" :trigger-reload="triggerReload" @on-authenticate="$_authMixin_onConnectUserWallet" />
        </keep-alive>
      </div>
    </div>
    <ModalCfTurnstile
      :verify="isShowCfVerify"
      @challenge="cfChallengeHandle"
    />
  </section>
</template>
<script>
import dashboardMixin from '@/mixins/dashboard/index.js'
import ModalCfTurnstile from '@/components/common/modal/modal-cf-turnstile.vue';
import OverviewItem from '@/components/common/publicview-overview-item.vue';
import { getMerchantAvatar } from '@/helper/avatar-util';
import { MODAL } from '@/resources/modal';
import { mapActions, mapState } from 'vuex';
import { getUniqColor } from '~/helper';
import tabListMerchantViewMixin from '~/mixins/tabs-list-merchant-view';

export default {
  components: {
    DashboardCard: () => import('~/components/desktop/dashboard/components/dashboard-card.vue'),
    TabsPanel: () => import('~/components/common/tabs-panel/index.vue'),
    BuyAdvertise: () => import('~/components/desktop/merchant/public-view/buy-table.vue'),
    SellAdvertise: () => import('~/components/desktop/merchant/public-view/sell-table.vue'),
    DashboardOverviewCard: () => import('~/components/desktop/dashboard/components/dashboard-overview-card.vue'),
    OverviewItem,
    ModalCfTurnstile
  },
  mixins: [tabListMerchantViewMixin, dashboardMixin],
  computed: {
    ...mapState('merchant-public-view', ['merchantInfo']),
    firstCharNickName () {
      return this.merchantInfo.merchantName ? this.merchantInfo.merchantName.charAt(0).toUpperCase() : ''
    },
    avatar () {
      return getMerchantAvatar(this.merchantInfo?.avatar)
    },
    formatCompletedRate () {
      if (this.merchantInfo.completeRate === 0 || this.merchantInfo.completeRate === 100) {
        return this.merchantInfo.completeRate
      }
      return Number(this.merchantInfo.completeRate)?.toFixed(2)
    },
    backgroundAvatar () {
      return getUniqColor(this.$route.query?.id || 0)
    }
  },
  async mounted () {
    await this.getAllMerchantInfo()
    this.modalCfTurnstile = MODAL.CF_TURNSTILE
  },
  methods: {
    ...mapActions('merchant-public-view', ['getMerchantInfo']),
    ...mapActions('payments', ['getListPayment']),
    async getAllMerchantInfo () {
      try {
        const refId = this.$route.query.ref;
        await this.getMerchantInfo(refId)
      } catch (error) {
        if (error.response.status === 404) {
          this.$router.replace('/404')
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/merchant/public-view/index.scss" />
