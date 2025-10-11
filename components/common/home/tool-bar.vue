<template>
  <div id="homeToolBar" class="content-tool-bar">
    <b-container fluid="xl" class="tool-content">
      <div class="tool-content__top">
        <div class="tool-content__inner">
          <div class="btn-group">
            <nuxt-link
              class="btn-tab bullish-green"
              :class="{ active: $route.path === '/marketplace' || $route.path === '/marketplace/' || $route.path.includes('/marketplace/buy') }"
              :to="{ path: '/marketplace/buy', query: { asset: $route.query.asset }}"
            >
              {{ $t("home.buy") }}
            </nuxt-link>
            <nuxt-link
              class="btn-tab bearish-red"
              :class="{ active: $route.path.includes('/marketplace/sell') }"
              :to="{ path: '/marketplace/sell', query: { asset: $route.query.asset }}"
            >
              {{ $t("home.sell") }}
            </nuxt-link>
          </div>
          <div class="tool-content__tabs">
            <tabs-panel
              :tabs="tabs"
              :active="activeTab"
              @change-tab="handleSelectedAssets"
            />
          </div>
        </div>
        <filter-menu v-if="$device.isMobile" :active="activeFilterOptions">
          <filter-menu-item
            :ref="refName.rangeAmount"
            :value-active="activeRangeAmount"
            :title="$t('home.range_amount')"
            title-class="icon-coin"
            :active="isActiveRangeSelectedAmount"
            :disabled="!isShowRangeAmount"
          >
            <form-content>
              <template>
                <div class="range-amount-group">
                  <van-slider
                    v-model="rangeAmount"
                    range
                    min="0"
                    :step="1"
                    :max="maxRangeAmount"
                    active-color="#FAAC2E"
                  >
                    <template #button>
                      <div class="range-amount-group__button" />
                    </template>
                  </van-slider>
                  <p class="range-amount-group__text">
                    <span class="range-amount-group__min">{{ minAmount }}</span>
                    <span class="range-amount-group__max">{{ maxAmount }}</span>
                  </p>
                </div>
              </template>
              <template #action>
                <base-button
                  variants="contained"
                  color="info"
                  :disabled="!rangeAmount"
                  class="outline"
                  @click="handleResetFilterOptions(refName.rangeAmount)"
                >
                  {{ $t('home.reset') }}
                </base-button>
                <base-button
                  variants="contained"
                  color="primary"
                  :disabled="isDisabledSubmitRangeAmount"
                  @click="handleSubmitFilterOptions(refName.rangeAmount)"
                >
                  {{ $t('home.confirm') }}
                </base-button>
              </template>
            </form-content>
          </filter-menu-item>
        </filter-menu>

        <div v-else class="label-group">
          <div class="search-group">
            <BaseInputLabel
              ref="money-input"
              v-model="amount"
              class="search-money"
              :placeholder="placeholderInputFiat"
              type="tel"
              thousands-separator-symbol=","
              :allow-leading-zeroes="false"
            />
            <b-tooltip
              ref="searchTooltip"
              target="delete-search"
              triggers="hover"
              placement="bottom"
            >
              <span class="search-delete-label">{{ $t("home.delete") }}</span>
            </b-tooltip>
            <span
              v-if="isShowIconClose"
              id="delete-search"
              v-b-tooltip.hover.bottom="$t('home.delete')"
              class="icon icon-close-circle-outline"
              @click="delSearchValue"
            />
            <span v-else class="icon icon-search-outline" />
          </div>
          <div class="refresh-dropdown">
            <Dropdown
              v-model="timeSelected"
              :list="refreshOption"
              :placeholder="getRefreshOptionTitle"
              :is-pause="pause"
              :is-loading="isLoadingRefresh"
              @input="handleOptionRefresh"
              @play="$emit('play')"
            />
          </div>
        </div>
      </div>
      <div class="tool-content__tabs-bottom">
        <tabs-panel-swiper
          :tabs="tabs"
          :active="activeTab"
          @change-tab="handleSelectedAssets"
        />
      </div>
    </b-container>
  </div>
</template>
<script>
import BaseInputLabel from '@/components/common/base-input-label.vue';
import debounce from 'lodash/debounce';
import { mapState, mapActions } from 'vuex';
import Dropdown from '@/components/common/refresh-dropdown';
import { POST_REFRESH_OPTIONS } from '@/constants/posts.js'
import VanSlider from 'vant/lib/slider'
import 'vant/lib/slider/style'
import { POST_TYPE } from '@/config/constant';

const SIZE_MEDIUM_SCREEN = 768;
const DELAY_SEARCH_TIME = 500;
export default {
  components: {
    Dropdown,
    BaseInputLabel,
    VanSlider,
    TabsPanel: () => import('~/components/common/tabs-panel/index.vue'),
    TabsPanelSwiper: () => import('~/components/common/tabs-panel/swiper.vue'),
    FilterMenu: () => import('~/components/mobile/commons/libs/filter-menu/index.vue'),
    FilterMenuItem: () => import('~/components/mobile/commons/libs/filter-menu-item/index.vue'),
    FormContent: () => import('~/components/common/forms/form-content/index.vue'),
    BaseButton: () => import('~/components/common/base-button/index.vue')
  },
  props: {
    tabs: {
      type: Array,
      default: () => []
    },
    activeTab: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      amount: this.$store.state.post.amount ? this.$store.state.post.amount.toString() : '',
      rangeAmount: [0, 0],
      refName: {
        rangeAmount: 'rangeAmount'
      },
      timeSelected: 0,
      refreshOption: POST_REFRESH_OPTIONS,
      assetTab: null
    };
  },
  computed: {
    ...mapState('post', ['searchOptions', 'refreshOptions', 'refreshIntervalId', 'refreshPause', 'isLoadingRefresh', 'sortDirection']),
    ...mapState({
      maxAmountState: state => state.post.maxAmount
    }),
    isActiveRangeSelectedAmount () {
      return this.maxAmountState > 0
    },
    isResetRangeAmount () {
      return this.rangeAmount?.[0] === 0 && this.rangeAmount?.[1] === this.maxRangeAmount
    },
    isShowIconSearch () {
      return !this.amount.trim().length;
    },
    isShowIconClose () {
      return this.amount.trim().length;
    },
    activeRangeAmount () {
      return this.$t('home.range_amount')
    },
    activeFilterOptions () {
      return this.activeRangeAmount;
    },
    minAmount () {
      return `₫ ${this.$options.filters.formatMoney(this.rangeAmount?.[0])}`;
    },
    maxAmount () {
      return `₫ ${this.$options.filters.formatMoney(this.rangeAmount?.[1])}`;
    },
    maxRangeAmount () {
      return this.searchOptions?.maxAmount || 0;
    },
    isShowRangeAmount () {
      return this.maxRangeAmount > 0
    },
    isDisabledSubmitRangeAmount () {
      return this.rangeAmount?.[1] === 0;
    },
    isLoadSearchOptions () {
      return this.$device.isMobileOrTablet;
    },
    getRefreshOptionTitle () {
      if (this.refreshOptions?.value) {
        return this.refreshOptions.title
      }
      return this.$t('common.refresh');
    },
    pause () {
      return this.refreshPause
    },
    placeholderInputFiat () {
      const type = (this.$route.params?.type || POST_TYPE.BUY).toUpperCase()
      const text = type === POST_TYPE.BUY ? this.$t('common.buy') : this.$t('common.sell')
      return this.$t('home.input_amount', {
        type: text.toLowerCase()
      })
    }
  },
  watch: {
    amount (value, oldValue) {
      oldValue = this.$options.filters.formatInputToNumber(oldValue);
      const newAmount = this.$options.filters.formatInputToNumber(value);
      if ((typeof newAmount === 'number' && newAmount >= 0) || (value === '' && newAmount !== oldValue)) {
        this.onSearch(newAmount);
      }
    },
    searchOptions: {
      handler (value) {
        const maxAmount = value?.maxAmount > 0 ? value.maxAmount : 0;
        this.rangeAmount = [0, maxAmount];
      },
      immediate: true
    },
    '$route.query.asset': {
      handler (assetParams) {
        if (this.assetTab === assetParams) {
          return;
        }
        this.assetTab = assetParams;

        if (!assetParams) {
          this.activeTab = 0;
        }
        const amount = this.$options.filters.formatInputToNumber(this.amount);
        const [assetName, assetNetwork] = assetParams?.split('-') || [this.tabs?.[0]?.title, this.tabs?.[0]?.subTitle] || [];
        this.searchPost({
          amount,
          assetName,
          assetNetwork,
          isLoadSearchOptions: this.isLoadSearchOptions,
          sortDirection: this.sortDirection
        });
      }
    }
  },
  mounted () {
    this.startRefreshPage()
  },
  beforeDestroy () {
    this.clearIntervalRefresh();
  },
  methods: {
    ...mapActions('post', ['searchPost', 'onRefresh', 'setRefreshOption', 'setRefreshIntervalId', 'setPauseRefresh']),
    delSearchValue () {
      this.amount = '';
    },
    handleScroll () {
      const toolBar = document.getElementById('homeToolBar');
      if (toolBar) {
        const posYToolBar = toolBar.getBoundingClientRect()?.y || 0;
        const widthScreen = window.screen.width;
        if (
          (widthScreen <= SIZE_MEDIUM_SCREEN && posYToolBar === 56) ||
            (widthScreen > SIZE_MEDIUM_SCREEN && posYToolBar === 80)
        ) {
          toolBar.classList.add('is-pinned');
        } else {
          toolBar.classList.remove('is-pinned');
        }
      }
    },
    handleSelectedAssets (tab) {
      if (tab.key !== this.$route.query?.asset) {
        this.assetTab = tab.key;
        this.$router.push({ path: this.$route.fullPath, query: { asset: tab.key } });
        const amount = this.$options.filters.formatInputToNumber(this.amount);
        this.searchPost({
          amount,
          assetName: tab.title,
          assetNetwork: tab.subTitle,
          isLoadSearchOptions: this.isLoadSearchOptions,
          sortDirection: this.sortDirection
        });
      }
    },
    onSearch: debounce(function (amount) {
      this.searchPost({ amount });
    }, DELAY_SEARCH_TIME),
    handleSubmitFilterOptions (ref) {
      if (ref) {
        this.$refs[ref]?.toggle(false);
      }
      if (ref === this.refName.rangeAmount) {
        const [minAmount, maxAmount] = this.rangeAmount || [];
        this.searchPost({ ...(!this.isResetRangeAmount && { minAmount, maxAmount }) });
      }
    },
    handleResetFilterOptions (ref) {
      if (ref === this.refName.rangeAmount) {
        const maxAmount = this.searchOptions?.maxAmount > 0 ? this.searchOptions.maxAmount : 0;
        this.rangeAmount = [0, maxAmount];
      }
    },
    async handleOptionRefresh (item) {
      this.setRefreshOption(item)
      await this.refreshSearchPost()
    },
    async refreshSearchPost () {
      const seconds = this.refreshOptions.value
      this.clearIntervalRefresh()
      if (seconds === 0) {
        this.setPauseRefresh(false)
        await this.onRefresh()
      } else {
        const intervalId = setInterval(() => {
          this.onRefresh()
        }, seconds)
        this.setRefreshIntervalId(intervalId)
      }
    },
    startRefreshPage () {
      const seconds = this.refreshOptions.value
      this.clearIntervalRefresh()
      if (seconds) {
        const intervalId = setInterval(() => {
          this.onRefresh()
        }, seconds)
        this.setRefreshIntervalId(intervalId)
      }
    },
    clearIntervalRefresh () {
      if (this.refreshIntervalId) {
        clearInterval(this.refreshIntervalId)
      }
      this.setRefreshIntervalId(null)
    }
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/common/home/tool-bar.scss" />
