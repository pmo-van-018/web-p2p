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
            :operator-filter-flag="operatorFilterFlag"
            name="walletAddress"
            @on-toggle="handleToggle"
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
                <button
                  :disabled="!search"
                  class="outline"
                  @click="handleResetFilterOptions(refName.search)"
                >
                  {{ $t('role_management.modal.reset') }}
                </button>
                <button class="primary" @click="handleSubmitFilterOptions(refName.search)">
                  {{ $t('role_management.modal.confirm') }}
                </button>
              </template>
            </form-content>
          </filter-menu-item>

          <filter-menu-item
            :ref="refName.status"
            :active="selectedStatus !== null"
            :value-active="activeStatus"
            :title="$t('role_management.label.status')"
            :operator-filter-flag="operatorFilterFlag"
            name="status"
            @on-toggle="handleToggle"
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
                <button class="outline" @click="handleResetFilterOptions(refName.status)">
                  {{ $t('role_management.modal.reset') }}
                </button>
                <button class="primary" @click="handleSubmitFilterOptions(refName.status)">
                  {{ $t('role_management.modal.confirm') }}
                </button>
              </template>
            </form-content>
          </filter-menu-item>

          <filter-menu-item
            :ref="refName.staffRole"
            :active="selectedStaffRole !== null"
            :value-active="activeStaffRole"
            :title="$t('role_management.label.type')"
            :operator-filter-flag="operatorFilterFlag"
            name="staffRole"
            @on-toggle="handleToggle"
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
                <button class="outline" @click="handleResetFilterOptions(refName.staffRole)">
                  {{ $t('role_management.modal.reset') }}
                </button>
                <button class="primary" @click="handleSubmitFilterOptions(refName.staffRole)">
                  {{ $t('role_management.modal.confirm') }}
                </button>
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
    SearchInput: () => import('~/components/common/forms/search-input/index.vue')
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
    staffRoleOptions: {
      type: Array,
      default: () => []
    },
    defaultDateRange: {
      type: Object,
      default: () => {}
    },
    operatorFilterFlag: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      search: null,
      selectedStatus: null,
      selectedStaffRole: null,
      refName: {
        search: 'search',
        status: 'status',
        staffRole: 'staffRole'
      },
      dateRange: {
        startDate: null,
        endDate: null
      },
      labelDateRange: {
        selectDate: this.$t('role_management.label.time_create')
      },
      calendarElementId: 'filterModalDatePicker',
      openValues: {
        walletAddress: false,
        status: false
      }
    }
  },
  computed: {
    activeFilterOptions () {
      return `${this.search}_${this.selectedStatus}_${this.selectedStaffRole}`;
    },
    activeStatus () {
      return this.statusOptions.find(item => item.id === this.selectedStatus)?.label ||
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
    filterOptions () {
      return {
        search: this.search,
        status: this.selectedStatus,
        type: this.selectedStaffRole,
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
      if (ref === this.refName.staffRole) {
        this.selectedStaffRole = null;
      }
    },
    handleToggle (isOpen, option) {
      const name = option?.name;
      if (name) {
        this.openValues = {
          ...this.openValues,
          [name]: isOpen
        };
      }
      const hasAnyFieldOpen = Object.values(this.openValues).includes(true);
      this.$emit('on-toggle', hasAnyFieldOpen);
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/mobile/role-management/filter.scss">
</style>
