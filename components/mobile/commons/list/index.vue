<template>
  <van-pull-refresh
    v-model="refreshing"
    :loosing-text="$t('refresh_table.pull_refresh')"
    :pulling-text="$t('refresh_table.release_refresh')"
    loading=""
    @refresh="onRefresh"
  >
    <template #loading>
      <div class="loading-list loading-list--large">
        <div class="loading-list__loading">
          <loader class="loading-list__loader" />
        </div>
      </div>
    </template>
    <template v-if="!refreshing">
      <template v-if="isFetching">
        <div class="loading-list">
          <div class="loading-list__loading">
            <loader class="loading-list__loader" />
          </div>
        </div>
      </template>
      <template v-else>
        <template v-if="items.length">
          <dynamic-scroller
            :items="items"
            :key-field="keyField"
            :min-item-size="1"
            :prerender="10"
            class="scroller"
          >
            <template v-slot="{ item, index, active }">
              <transition name="fade" mode="out-in" appear>
                <dynamic-scroller-item :item="item" :active="active" :data-index="index">
                  <div v-observe-visibility="!isLastPage && index === items.length - 1 ? infiniteScrollHandler : false">
                    <slot
                      :item="item"
                      :active="active"
                      :dataIndex="index"
                      :is-last-item="index === (total - 1)"
                    />
                  </div>
                </dynamic-scroller-item>
              </transition>
            </template>
          </dynamic-scroller>
        </template>
        <template v-else>
          <div class="common-list__empty">
            <div class="common-list__empty-inner">
              <no-data />
            </div>
          </div>
        </template>
        <template v-if="loading && !refreshing">
          <div class="loading-list">
            <div class="loading-list__loading">
              <loader class="loading-list__loader" />
            </div>
          </div>
        </template>
      </template>
    </template>
  </van-pull-refresh>
</template>
<script>
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller'
import VanPullRefresh from 'vant/lib/pull-refresh'
import 'vant/lib/pull-refresh/style'

export default {
  components: {
    DynamicScroller,
    DynamicScrollerItem,
    VanPullRefresh,
    NoData: () => import('~/components/common/no-data.vue'),
    Loader: () => import('~/components/common/loader.vue')
  },
  props: {
    showEmpty: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: true
    },
    total: {
      type: Number,
      default: 0
    },
    keyField: {
      type: String,
      default: 'orderId'
    },
    items: {
      type: Array,
      default: () => []
    },
    resetList: {
      type: Boolean,
      default: false
    },
    renderSsr: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      list: [],
      refreshing: false,
      finished: false,
      isFetching: true
    }
  },
  computed: {
    isLastPage () {
      return this.items.length === this.total
    }
  },
  watch: {
    renderSsr: {
      handler (isRender) {
        if (isRender) {
          this.refreshing = false
          this.isFetching = false
        }
      },
      immediate: true
    },
    loading: {
      handler (isLoading) {
        if (!isLoading) {
          this.refreshing = false
          setTimeout(() => {
            this.isFetching = false
          }, 1000)
        }
        if (isLoading && this.resetList) {
          this.isFetching = true
        }
      },
      immediate: true
    }
  },
  methods: {
    infiniteScrollHandler (isVisible, entry) {
      if (isVisible && entry.isIntersecting && !this.loading) {
        this.$emit('infinite-loading')
      }
    },
    onRefresh () {
      this.finished = false
      this.$emit('refresh')
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/mobile/commons/list/index.scss">
</style>
