<template>
  <div class="appeal-filter">
    <div class="appeal-filter__container">
      <div class="appeal-filter__left">
        <filter-menu :active="activeFilterOptions">
          <filter-menu-item
            :ref="refName.postType"
            :active="!!postType"
            :value-active="postTypeActive"
            :title="$t('order_filter.type')"
          >
            <form-content>
              <template>
                <div class="w-75">
                  <b-form-radio-group v-model="postTypeSelected" :name="refName.postType">
                    <radio-button value="BUY">{{ $t('common.buy') }}</radio-button>
                    <radio-button value="SELL">{{ $t('common.sell') }}</radio-button>
                  </b-form-radio-group>
                </div>
              </template>
              <template #action>
                <base-button
                  variants="outlined"
                  @click="onResetFilterOptions(refName.postType)"
                >
                  {{ $t('order_filter.reset') }}
                </base-button>
                <base-button
                  variants="contained"
                  color="primary"
                  @click="onSubmitFilterOptions(refName.postType)"
                >
                  {{ $t('order_filter.confirm') }}
                </base-button>
              </template>
            </form-content>
          </filter-menu-item>
          <filter-menu-item
            :ref="refName.assetType"
            :active="!!assetType"
            :value-active="assetTypeActive"
            :title="$t('order_filter.asset_type')"
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
                  {{ $t('order_filter.reset') }}
                </base-button>
                <base-button
                  variants="contained"
                  color="primary"
                  @click="onSubmitFilterOptions(refName.assetType)"
                >
                  {{ $t('order_filter.confirm') }}
                </base-button>
              </template>
            </form-content>
          </filter-menu-item>
          <filter-menu-item
            :ref="refName.statusType"
            :active="!!statusType"
            :value-active="statusTypeActive"
            :title="$t('order_filter.status')"
          >
            <form-content>
              <template>
                <div class="w-100">
                  <b-form-radio-group v-model="statusTypeSelected" :name="refName.statusType">
                    <radio-button
                      v-for="(item, index) in statusList"
                      :key="index"
                      :value="item.value"
                    >
                      {{ $t(item.name) }}
                    </radio-button>
                  </b-form-radio-group>
                </div>
              </template>
              <template #action>
                <base-button
                  variants="outlined"
                  @click="onResetFilterOptions(refName.statusType)"
                >
                  {{ $t('order_filter.reset') }}
                </base-button>
                <base-button
                  variants="contained"
                  color="primary"
                  @click="onSubmitFilterOptions(refName.statusType)"
                >
                  {{ $t('order_filter.confirm') }}
                </base-button>
              </template>
            </form-content>
          </filter-menu-item>
        </filter-menu>
      </div>
      <div v-if="isVisibleCalendar" class="history-filter__right">
        <div class="history-filter__calendar" @click="onOpenCalendar">
          <span :class="['appeal-filter__icon icon-calendar-days', { active: isActiveCalendar }]" />
        </div>
      </div>
    </div>
    <client-only>
      <date-picker-calendar-modal :date-range="dateRange" @on-confirm="onConfirmFilterDate" />
    </client-only>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import dayjs from 'dayjs'
import { LIST_PENDING_STATUS } from '@/resources/order-filters';
import { POST_TYPE } from '~/config/constant'

export default {
  components: {
    FilterMenu: () => import('~/components/mobile/commons/libs/filter-menu/index.vue'),
    FilterMenuItem: () => import('~/components/mobile/commons/libs/filter-menu-item/index.vue'),
    FormContent: () => import('~/components/common/forms/form-content/index.vue'),
    RadioButton: () => import('~/components/common/forms/radio-button/index.vue'),
    DatePickerCalendarModal: () => import('~/components/mobile/modal/date-picker/index.vue'),
    BaseButton: () => import('~/components/common/base-button/index.vue')
  },
  props: {
    isVisibleCalendar: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      postTypeSelected: '',
      assetTypeSelected: '',
      statusTypeSelected: '',
      refName: {
        assetType: 'assetType',
        postType: 'postType',
        statusType: 'statusType'
      },
      dateRange: {
        startDate: null,
        endDate: null
      },
      statusList: LIST_PENDING_STATUS,
      assetType: 0,
      postType: '',
      statusType: ''
    }
  },
  computed: {
    ...mapState('resources', ['assets']),
    activeFilterOptions () {
      return `${this.assetType}_${this.postType}`
    },
    postTypeActive () {
      return this.postType === POST_TYPE.BUY ? this.$t('common.buy') : this.$t('common.sell')
    },
    assetTypeActive () {
      const asset = this.assets.find(asset => asset.id === this.assetType)
      return asset ? `${asset.name} (${asset.network})`
        : this.$t('merchant.list_order.order_filter.asset_type')
    },
    statusTypeActive () {
      const status = this.statusList.find(status => status.value === this.statusType)?.name
      return status ? this.$t(status) : this.$t('merchant.list_order.order_filter.asset_type')
    },
    isActiveCalendar () {
      return !!this.dateRange.startDate && !!this.dateRange.endDate
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
  watch: {
    dateRange: {
      handler () {
        this.onSubmitFilterOptions()
      },
      deep: true
    }
  },
  methods: {
    onSubmitFilterOptions (ref) {
      if (ref) {
        this.$refs[ref]?.toggle(false)
      }
      const options = {
        page: 1,
        asset: this.assetTypeSelected,
        type: this.postTypeSelected,
        status: this.statusTypeSelected,
        ...(this.startDate && { startDate: this.startDate }),
        ...(this.endDate && { endDate: this.endDate })
      }
      this.postType = this.postTypeSelected
      this.assetType = this.assetTypeSelected
      this.statusType = this.statusTypeSelected
      this.$emit('on-submit', options)
    },
    onOpenCalendar () {
      this.$bvModal.show('modalDatePicker')
    },
    onConfirmFilterDate ({ startDate, endDate }) {
      this.dateRange.startDate = startDate
      this.dateRange.endDate = endDate
    },
    onResetFilterOptions (ref) {
      if (ref === this.refName.assetType) {
        this.assetTypeSelected = ''
      }
      if (ref === this.refName.postType) {
        this.postTypeSelected = ''
      }
      if (ref === this.refName.statusType) {
        this.statusTypeSelected = ''
      }
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/mobile/admin/appeals/filter-head.scss">
</style>
