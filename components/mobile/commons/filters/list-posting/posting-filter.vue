<template>
  <div class="history-filter">
    <div class="history-filter__container">
      <div class="history-filter__left">
        <filter-menu :active="activeFilterOptions">
          <filter-menu-item
            :ref="refName.postType"
            :active="!!postType"
            :value-active="postTypeActive"
            :title="$t('postings.table.post_type')"
          >
            <form-content>
              <template>
                <div>
                  <b-form-radio-group v-model="postTypeSelected" :name="refName.postType">
                    <radio-button :value="POST_TYPE.BUY">{{ $t('common.buy') }}</radio-button>
                    <radio-button :value="POST_TYPE.SELL">{{ $t('common.sell') }}</radio-button>
                  </b-form-radio-group>
                </div>
              </template>
              <template #action>
                <base-button
                  variants="outlined"
                  @click="onResetFilterOptions(refName.postType)"
                >
                  {{ $t('merchant.list_order.order_filter.reset') }}
                </base-button>
                <base-button
                  variants="contained"
                  color="primary"
                  @click="onSubmitFilterOptions(refName.postType)"
                >
                  {{ $t('merchant.list_order.order_filter.confirm') }}
                </base-button>
              </template>
            </form-content>
          </filter-menu-item>
          <filter-menu-item
            :ref="refName.assetType"
            :active="!!assetId"
            :value-active="assetTypeActive"
            :title="$t('merchant.list_order.order_filter.asset_type')"
          >
            <form-content>
              <template>
                <b-form-radio-group v-model="assetTypeSelected" :name="refName.assetType">
                  <radio-button
                    v-for="(item, index) in assets"
                    :key="index"
                    :value="item.id"
                  >
                    {{ item.name }} ({{ item.network }})
                  </radio-button>
                </b-form-radio-group>
              </template>
              <template #action>
                <base-button
                  variants="outlined"
                  @click="onResetFilterOptions(refName.assetType)"
                >
                  {{ $t('merchant.list_order.order_filter.reset') }}
                </base-button>
                <base-button
                  variants="contained"
                  color="primary"
                  @click="onSubmitFilterOptions(refName.assetType)"
                >
                  {{ $t('merchant.list_order.order_filter.confirm') }}
                </base-button>
              </template>
            </form-content>
          </filter-menu-item>
          <filter-menu-item
            v-if="!hideStatusType"
            :ref="refName.postStatusType"
            :active="isActiveStatus"
            :value-active="statusTypeActive"
            :title="$t('merchant.list_order.order_filter.status')"
          >
            <form-content>
              <template>
                <div>
                  <b-form-radio-group v-model="postStatusTypeSelected" :name="refName.postStatusType">
                    <radio-button :value="POST_STATUS.ONLINE">{{ $t('form_post.status.online') }}</radio-button>
                    <radio-button :value="POST_STATUS.OFFLINE">{{ $t('form_post.status.offline') }}</radio-button>
                  </b-form-radio-group>
                </div>
              </template>
              <template #action>
                <base-button
                  variants="outlined"
                  @click="onResetFilterOptions(refName.postStatusType)"
                >
                  {{ $t('merchant.list_order.order_filter.reset') }}
                </base-button>
                <base-button
                  variants="contained"
                  color="primary"
                  @click="onSubmitFilterOptions(refName.postStatusType)"
                >
                  {{ $t('merchant.list_order.order_filter.confirm') }}
                </base-button>
              </template>
            </form-content>
          </filter-menu-item>
        </filter-menu>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import dayjs from 'dayjs'
import { POST_TYPE } from '~/config/constant'
import { POST_STATUS } from '~/constants/posts'

export default {
  components: {
    FilterMenu: () => import('~/components/mobile/commons/libs/filter-menu/index.vue'),
    FilterMenuItem: () => import('~/components/mobile/commons/libs/filter-menu-item/index.vue'),
    FormContent: () => import('~/components/common/forms/form-content/index.vue'),
    RadioButton: () => import('~/components/common/forms/radio-button/index.vue'),
    BaseButton: () => import('~/components/common/base-button/index.vue')
  },
  props: {
    hideStatusType: {
      type: Boolean,
      default: false
    }
  },
  data () {
    const startDate = new Date();
    const endDate = new Date();
    startDate.setDate(startDate.getDate() - 31)

    return {
      postTypeSelected: '',
      assetTypeSelected: '',
      postStatusTypeSelected: '',
      refName: {
        assetType: 'assetType',
        postType: 'postType',
        postStatusType: 'postStatusType'
      },
      POST_STATUS,
      POST_TYPE,
      dateRange: {
        startDate,
        endDate
      }
    }
  },
  computed: {
    ...mapState('merchant-posting', ['postType', 'assetId', 'status']),
    ...mapState('resources', ['assets']),
    activeFilterOptions () {
      return `${this.assetId}_${this.postType}_${this.status}`
    },
    postTypeActive () {
      return this.postType === POST_TYPE.SELL ? this.$t('common.sell') : this.$t('common.buy')
    },
    assetTypeActive () {
      return this.assets.find(asset => asset.id === this.assetId)?.name || this.$t('merchant.list_order.order_filter.asset_type')
    },
    statusTypeActive () {
      const postStatus = [POST_STATUS.ONLINE, POST_STATUS.OFFLINE]
      const statusIndex = postStatus.findIndex(status => status === Number(this.status))
      if (statusIndex > -1) {
        return postStatus[statusIndex] === POST_STATUS.ONLINE ? this.$t('form_post.status.online') : this.$t('form_post.status.offline')
      }
      return this.$t('merchant.list_order.order_filter.status')
    },
    isActiveStatus () {
      return this.status !== ''
    },
    startDate () {
      if (!this.dateRange.startDate) {
        return ''
      }
      return dayjs(this.dateRange.startDate).format('YYYY-MM-DD')
    },
    endDate () {
      if (!this.dateRange.startDate) {
        return ''
      }
      return dayjs(this.dateRange.endDate).format('YYYY-MM-DD')
    }
  },
  beforeDestroy () {
    this.onResetStateFilter()
  },
  methods: {
    ...mapActions('merchant-posting', ['updateMultiFilter', 'onResetStateFilter']),
    onSubmitFilterOptions (ref) {
      if (ref) {
        this.$refs[ref]?.toggle(false)
      }
      const options = {
        page: 1,
        limit: 10,
        assetId: this.assetTypeSelected,
        postType: this.postTypeSelected,
        status: String(this.postStatusTypeSelected),
        ...(this.startDate && { startDate: this.startDate }),
        ...(this.endDate && { endDate: this.endDate })
      }
      this.$emit('on-filters', options)
    },
    onResetFilterOptions (ref) {
      if (ref === this.refName.assetType) {
        this.assetTypeSelected = ''
      }
      if (ref === this.refName.postType) {
        this.postTypeSelected = ''
      }
      if (ref === this.refName.postStatusType) {
        this.postStatusTypeSelected = ''
      }
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/mobile/orders/filters/history-filter.scss">
</style>
