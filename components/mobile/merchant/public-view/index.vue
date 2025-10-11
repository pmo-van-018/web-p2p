<template>
  <div class="public-view">
    <div class="public-view__header">
      <div class="merchant-name ">
        <b-container fluid>
          <div class="d-flex align-items-center">
            <img v-if="avatar" class="avatar-img" :src="avatar" alt="avatar">
            <b-avatar v-else :style="{backgroundColor: backgroundAvatar}" class="mr-2" size="76px">
              <span class="avatar-character">{{ firstCharNickName }}</span>
            </b-avatar>
            <span class="name">{{ merchantInfo.merchantName }}</span>
          </div>
        </b-container>
      </div>
      <b-container fluid>
        <div class="merchant-data">
          <overview-item
            id="trans-all"
            :title="$t('merchant.public_view.trans_all.title')"
            :note="$t('merchant.public_view.trans_all.note')"
          >
            <span class="overview__number"> {{ merchantInfo.transTotal.total }} <sup>{{ $t('merchant.overview.times') }}</sup></span>
            <div class="overview__buy-sell">
              <span class="buy-color">{{ merchantInfo.transTotal.buy }} {{ $t('common.buy') }}</span>
              <span class="sell-color"> {{ merchantInfo.transTotal.sell }} {{ $t('common.sell') }}</span>
            </div>
          </overview-item>
          <overview-item
            id="trans-month"
            :title="$t('overview.trans_in_month.title')"
            :note="$t('overview.trans_in_month.note')"
          >
            <span class="overview__number"> {{ merchantInfo.transInMonth.total }} <sup>{{ $t('merchant.overview.times') }}</sup></span>
            <div class="overview__buy-sell">
              <span class="buy-color">{{ merchantInfo.transInMonth.buy }} {{ $t('common.buy') }}</span>
              <span class="sell-color"> {{ merchantInfo.transInMonth.sell }} {{ $t('common.sell') }}</span>
            </div>
          </overview-item>
          <overview-item
            id="rate-month"
            :title="$t('merchant.public_view.completion_rate_month.title')"
            :note="$t('merchant.public_view.completion_rate_month.note')"
          >
            <span class="overview__number">{{ formatCompletedRate }}%</span>
          </overview-item>
        </div>
      </b-container>
    </div>
    <b-container fluid>
      <div class="public-view__content">
        <div class="public-view__tabs">
          <tabs-panel
            :key="activeTab"
            :tabs="tabs"
            :active="activeTab"
            @change-tab="onTabChange"
          />
        </div>
        <div class="table">
          <keep-alive>
            <component :is="activatedComponent" :trigger-reload="triggerReload" @on-authenticate="$_authMixin_onConnectUserWallet" />
          </keep-alive>
        </div>
      </div>
    </b-container>
    <ModalAddBank />
    <ModalCfTurnstile
      :verify="isShowCfVerify"
      @challenge="cfChallengeHandle"
    />
  </div>
</template>
<script>
import ModalCfTurnstile from '@/components/common/modal/modal-cf-turnstile.vue';
import OverviewItem from '@/components/common/publicview-overview-item.vue'
import { mapActions, mapState } from 'vuex'
import { MODAL } from '@/resources/modal';
import { getMerchantAvatar } from '@/helper/avatar-util';
import tabListMerchantView from '~/mixins/tabs-list-merchant-view'
import { getUniqColor } from '~/helper';

export default {
  components: {
    TabsPanel: () => import('~/components/common/tabs-panel/index.vue'),
    BuyAdvertise: () => import('~/components/mobile/merchant/public-view/buy-table.vue'),
    SellAdvertise: () => import('~/components/mobile/merchant/public-view/sell-table.vue'),
    ModalAddBank: () => import('@/components/mobile/modal/modal-add-bank.vue'),
    OverviewItem,
    ModalCfTurnstile
  },
  mixins: [tabListMerchantView],
  computed: {
    ...mapState('merchant-public-view', ['merchantInfo']),
    avatar () {
      return getMerchantAvatar(this.merchantInfo?.avatar)
    },
    firstCharNickName () {
      return this.merchantInfo.merchantName ? this.merchantInfo.merchantName.charAt(0).toUpperCase() : ''
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
    async getAllMerchantInfo () {
      const refId = this.$route.query.ref;
      await this.getMerchantInfo(refId)
    }
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/mobile/merchant/public-view/index.scss" />
