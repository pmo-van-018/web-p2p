<template>
  <div class="role-management-filter">
    <div class="role-management-filter__container">
      <div class="role-management-filter__left">
        <filter-menu :active="activeFilterOptions">
          <filter-menu-item
            :ref="refName.search"
            :active="!!search"
            :value-active="search"
            :title="$t('role_management.label.wallet_address')"
          >
            <form-content>
              <template>
                <search-input
                  v-model="search"
                  :placeholder="`${$t('role_management.label.search_input')}`"
                  :is-show-icon="false"
                />
              </template>
              <template #action>
                <base-button
                  variants="outlined"
                  @click="handleResetFilterOptions(refName.search)"
                >
                  {{ $t('role_management.modal.reset') }}
                </base-button>
                <base-button
                  variants="contained"
                  color="primary"
                  @click="handleResetFilterOptions(refName.search)"
                >
                  {{ $t('role_management.modal.confirm') }}
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
                <base-button
                  variants="outlined"
                  @click="handleResetFilterOptions(refName.status)"
                >
                  {{ $t('role_management.modal.reset') }}
                </base-button>
                <base-button
                  variants="contained"
                  color="primary"
                  @click="handleSubmitFilterOptions(refName.status)"
                >
                  {{ $t('role_management.modal.confirm') }}
                </base-button>
              </template>
            </form-content>
          </filter-menu-item>
        </filter-menu>
      </div>
      <div class="role-management-filter__right">
        <div class="role-management-filter__calendar" @click="handleOpenCalendar">
          <span :class="['role-management-filter__icon icon-calendar-days', { active: activeCalendar }]" />
        </div>
      </div>
    </div>
    <client-only>
      <date-picker-calendar-modal
        :id="calendarElementId"
        :date-range="dateRange"
        :label="labelDateRange"
        :is-show-note="false"
        @on-confirm="handleConfirmFilterDate"
      />
    </client-only>
  </div>
</template>
<script>
import dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from '@/config/constant';
export default {
  components: {
    FilterMenu: () => import('~/components/mobile/commons/libs/filter-menu/index.vue'),
    FilterMenuItem: () => import('~/components/mobile/commons/libs/filter-menu-item/index.vue'),
    FormContent: () => import('~/components/common/forms/form-content/index.vue'),
    DatePickerCalendarModal: () => import('~/components/mobile/modal/date-picker/index.vue'),
    SearchInput: () => import('~/components/common/forms/search-input/index.vue'),
    BaseButton: () => import('~/components/common/base-button/index.vue')
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    modal: {
      type: String,
      default: ''
    },
    statusOptions: {
      type: Array,
      default: () => []
    },
    defaultDateRange: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      search: null,
      selectedStatus: null,
      refName: {
        search: 'search',
        status: 'status'
      },
      dateRange: {
        startDate: null,
        endDate: null
      },
      labelDateRange: {
        selectDate: this.$t('role_management.label.time_create')
      },
      calendarElementId: 'filterModalDatePicker'
    }
  },
  computed: {
    activeFilterOptions () {
      return `${this.search}_${this.selectedStatus}`;
    },
    activeStatus () {
      return this.statusOptions.find(item => item.id === this.selectedStatus)?.label ||
        this.$t('role_management.label.status');
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
    filterOptions () {
      return {
        search: this.search,
        status: this.selectedStatus,
        startDate: this.isValidDate ? this.startDate : null,
        endDate: this.isValidDate ? this.endDate : null
      }
    }
  },
  watch: {
    dateRange: {
      handler () {
        this.handleSubmitFilterOptions();
      },
      deep: true
    }
  },
  methods: {
    handleOpenCalendar () {
      this.$bvModal.show(this.calendarElementId);
    },
    handleConfirmFilterDate ({ startDate, endDate }) {
      this.dateRange = { startDate, endDate };
    },
    handleSubmitFilterOptions (ref) {
      if (ref) {
        this.$refs[ref]?.toggle(false);
      }
      this.$emit('on-filters', this.filterOptions);
    },
    handleResetFilterOptions (ref) {
      if (ref === this.refName.search) {
        this.search = '';
      }
      if (ref === this.refName.status) {
        this.selectedStatus = null;
      }
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/mobile/role-management/filter.scss">
</style>
