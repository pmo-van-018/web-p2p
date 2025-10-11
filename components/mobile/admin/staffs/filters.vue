<template>
  <div class="filter-head">
    <div class="filter-head__container">
      <div class="filter-head__left">
        <div class="filter-head__content">
          <filter-menu :active="activeFilterOptions">
            <filter-menu-item
              :ref="refName.merchant"
              :active="merchantIds.length !== 0"
              :value-active="titleMerchantFilter"
              :title="`${$t('staff.merchant')}`"
            >
              <form-content>
                <template>
                  <div class="filter-search">
                    <div class="filter-search__head">
                      <div class="filter-search__input">
                        <search-input
                          v-model="searchValue"
                          :placeholder="$t('staff.placeholder.search')"
                          @input="onSearchMerchantManager"
                        />
                      </div>
                    </div>
                    <div class="filter-search__body">
                      <form-check-all-check-box
                        :is-reset="isResetSelectedMerchantManager"
                        :options="merchantManagersFormatter"
                        :selected="merchantIds"
                        :title="$t('staff.filters.merchant')"
                        @input="onSelectedMerchant"
                      />
                    </div>
                  </div>
                </template>
                <template #action>
                  <base-button
                    variants="outlined"
                    @click="onResetFilterOptions(refName.merchant)"
                  >
                    {{ $t('order_filter.reset') }}
                  </base-button>
                  <base-button
                    color="primary"
                    variants="contained"
                    @click="onSubmitFilterOptions(refName.merchant)"
                  >
                    {{ $t('order_filter.confirm') }}
                  </base-button>
                </template>
              </form-content>
            </filter-menu-item>

            <filter-menu-item
              :ref="refName.walletAddress"
              :active="!!walletAddress"
              :value-active="titleWalletAddressFilter"
              :title="$t('staff.wallet_address')"
            >
              <form-content>
                <template>
                  <template>
                    <base-input-label
                      v-model="walletAddress"
                      type="text"
                      class-name="my-0"
                      :placeholder="`${$t('role_management.label.search_input')}`"
                      :is-show-icon="false"
                    />
                  </template>
                </template>
                <template #action>
                  <base-button
                    variants="outlined"
                    @click="onResetFilterOptions(refName.walletAddress)"
                  >
                    {{ $t('order_filter.reset') }}
                  </base-button>
                  <base-button
                    color="primary"
                    variants="contained"
                    @click="onSubmitFilterOptions(refName.walletAddress)"
                  >
                    {{ $t('order_filter.confirm') }}
                  </base-button>
                </template>
              </form-content>
            </filter-menu-item>
            <filter-menu-item
              :ref="refName.status"
              :active="selectedStatus !== null"
              :value-active="activeStatus"
              :title="$t('role_management.label.status')"
            >
              <form-content>
                <template>
                  <b-form-radio-group
                    v-model="selectedStatus"
                    :name="refName.status"
                    text-field="label"
                    value-field="status"
                    class="status-radio-group"
                  >
                    <b-form-radio
                      v-for="(status) in statusOptions"
                      :key="status?.name"
                      :value="status?.id"
                      class="c-primary-radio"
                      :class="{ 'active': selectedStatus === status?.id }"
                      name="status-radio-group"
                    >
                      {{ status?.label }}
                    </b-form-radio>
                  </b-form-radio-group>
                </template>
                <template #action>
                  <base-button variants="outlined" @click="onResetFilterOptions(refName.status)">
                    {{ $t('role_management.modal.reset') }}
                  </base-button>
                  <base-button variants="contained" color="primary" @click="onSubmitFilterOptions(refName.status)">
                    {{ $t('role_management.modal.confirm') }}
                  </base-button>
                </template>
              </form-content>
            </filter-menu-item>
            <filter-menu-item
              :ref="refName.staffRole"
              :active="selectedStaffRole !== null"
              :value-active="activeStaffRole"
              :title="$t('role_management.label.type')"
            >
              <form-content>
                <template>
                  <b-form-radio-group
                    v-model="selectedStaffRole"
                    :name="refName.staffRole"
                    text-field="label"
                    value-field="staffRole"
                    class="status-radio-group"
                  >
                    <b-form-radio
                      v-for="(staffRole) in staffRoleOptions"
                      :key="staffRole?.name"
                      :value="staffRole?.id"
                      class="c-primary-radio"
                      :class="{ 'active': selectedStaffRole === staffRole?.id }"
                      name="status-radio-group"
                    >
                      {{ staffRole?.label }}
                    </b-form-radio>
                  </b-form-radio-group>
                </template>
                <template #action>
                  <base-button variants="outlined" @click="onResetFilterOptions(refName.staffRole)">
                    {{ $t('role_management.modal.reset') }}
                  </base-button>
                  <base-button variants="contained" color="primary" @click="onSubmitFilterOptions(refName.staffRole)">
                    {{ $t('role_management.modal.confirm') }}
                  </base-button>
                </template>
              </form-content>
            </filter-menu-item>
          </filter-menu>
        </div>
      </div>
      <div class="filter-head__right">
        <div class="filter-head__right__calendar" @click="onOpenCalendar">
          <span :class="['filter-head__right__icon icon-calendar-days', { active: activeCalendar }]" />
        </div>
      </div>
    </div>
    <client-only>
      <date-picker-calendar-modal
        :id="calendarElementId"
        :date-range="dateRange"
        :label="labelDateRange"
        @on-confirm="onConfirmFilterDate"
      />
    </client-only>
  </div>
</template>
<script>
import { MODAL } from '@/resources/modal'
import debounce from 'lodash/debounce';
import merchantManagerMixin from '@/mixins/admin/merchant-manager';
import dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from '~/config/constant';

export default {
  components: {
    FilterMenu: () => import('~/components/mobile/commons/libs/filter-menu/index.vue'),
    FilterMenuItem: () => import('~/components/mobile/commons/libs/filter-menu-item/index.vue'),
    FormContent: () => import('~/components/common/forms/form-content/index.vue'),
    DatePickerCalendarModal: () => import('~/components/mobile/modal/date-picker/index.vue'),
    SearchInput: () => import('~/components/common/forms/search-input/index.vue'),
    BaseInputLabel: () => import('~/components/common/base-input-label.vue'),
    BaseButton: () => import('~/components/common/base-button/index.vue'),
    FormCheckAllCheckBox: () => import('~/components/common/forms/form-checkall-checkbox/index.vue')
  },
  mixins: [merchantManagerMixin],
  data () {
    return {
      refName: {
        merchant: 'merchantType',
        walletAddress: 'walletAddressType',
        status: 'status',
        staffRole: 'staffRole'
      },
      selectedStatus: null,
      selectedStaffRole: null,
      merchantIds: [],
      walletAddress: '',
      searchValue: '',
      merchantManagers: [],
      isResetSelectedMerchantManager: false,
      calendarElementId: 'filterModalDatePicker',
      dateRange: {
        startDate: null,
        endDate: null
      },
      labelDateRange: {
        selectDate: this.$t('role_management.label.time_create')
      }
    }
  },
  computed: {
    titleMerchantFilter () {
      return this.$t('staff.merchant')
    },
    titleWalletAddressFilter () {
      return this.$t('staff.wallet_address')
    },
    activeFilterOptions () {
      return `${this.merchantIds.length}_${this.walletAddress}_${this.selectedStatus}_${this.selectedStaffRole}`
    },
    isActiveFilter () {
      return !!this.walletAddress || !!this.merchantIds.length || !!this.selectedStatus || !!this.selectedStaffRole
    },
    activeStatus () {
      return this.statusOptions.find(item => item.id === this.statusOptions)?.label ||
        this.$t('role_management.label.status');
    },
    activeStaffRole () {
      return this.staffRoleOptions.find(item => item.id === this.selectedStaffRole)?.label ||
        this.$t('role_management.label.type');
    },
    activeCalendar () {
      return !!this.dateRange.startDate && !!this.dateRange.endDate;
    },
    isValidDate () {
      return this.startDate && this.endDate;
    },
    startDate () {
      if (!this.dateRange?.startDate) {
        return '';
      }
      return dayjs(this.dateRange.startDate).format(DATE_TIME_FORMAT.DATE_ONLY);
    },
    endDate () {
      if (!this.dateRange?.startDate) {
        return '';
      }
      return dayjs(this.dateRange.endDate).format(DATE_TIME_FORMAT.DATE_ONLY);
    },
    mapByMerchantsIds () {
      if (this.merchantIds.length) {
        return this.merchantIds.map((merchant) => {
          return merchant.value
        }).join(',')
      }
      return ''
    },
    merchantManagersFormatter () {
      return this.merchantManagers.map((item) => {
        return {
          text: item.nickName,
          value: item.id
        }
      })
    }
  },
  watch: {
    dateRange: {
      handler () {
        this.onSubmitFilterOptions();
      },
      deep: true
    }
  },
  async created () {
    await this.$_merchantManagerMixin_onResetFilter(true)
  },
  methods: {
    onSubmitFilterOptions (ref) {
      if (ref) {
        this.$refs[ref]?.toggle(false);
      }
      this.$emit('on-filters', {
        merchantIds: this.mapByMerchantsIds,
        search: this.walletAddress,
        status: this.selectedStatus,
        type: this.selectedStaffRole,
        startDate: this.isValidDate ? this.startDate : null,
        endDate: this.isValidDate ? this.endDate : null
      })
    },
    onFilterOptions (options) {
      this.$emit('on-filters', {
        ...options,
        startDate: this.isValidDate ? this.startDate : null,
        endDate: this.isValidDate ? this.endDate : null
      })
      this.merchantIds = options?.merchantManagerSelectedList || []
      this.walletAddress = options?.search || ''
      this.selectedStatus = options?.selectedStatus
      this.selectedStaffRole = options?.selectedStaffRole
      this.$bvModal.hide(MODAL.STAFFS_FILTER)
    },
    onResetFilterOptions (ref) {
      if (ref === this.refName.walletAddress) {
        this.walletAddress = ''
      }
      if (ref === this.refName.merchant) {
        this.isResetSelectedMerchantManager = true
        this.searchValue = ''
        this.merchantIds = []
      }
      if (ref === this.refName.status) {
        this.selectedStatus = null;
      }
      if (ref === this.refName.staffRole) {
        this.selectedStaffRole = null;
      }
    },
    onSelectedMerchant (selectedIds) {
      this.merchantIds = selectedIds
      this.isResetSelectedMerchantManager = false
    },
    onSearchMerchantManager: debounce(function (search) {
      this.$_merchantManagerMixin_onChangeFilter({ search })
    }, 800),
    onOpenCalendar () {
      this.$bvModal.show(this.calendarElementId);
    },
    onConfirmFilterDate ({ startDate, endDate }) {
      this.dateRange = { startDate, endDate };
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/mobile/admin/staffs/filters.scss">
</style>
