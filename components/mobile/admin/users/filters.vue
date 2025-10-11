<template>
  <div class="filter-head">
    <div class="filter-head__container">
      <div class="filter-head__left">
        <div class="filter-head__content">
          <div :class="['filter-head__item', { 'active': filterDateActive }]" @click="onOpenCalendar">
            <span class="filter-head__item--title">{{ $t('staff.key.created_at') }}</span>
            <span class="filter-head__item--icon icon icon-caret-down" />
          </div>
          <div :class="['filter-head__item', { 'active': filterSearchActive }]" @click="onOpenSearch">
            <span class="filter-head__item--title">{{ $t('placeholder.search') }}</span>
            <span class="filter-head__item--icon icon icon-search-outline" />
          </div>
        </div>
      </div>
      <div class="filter-head__right" @click="onResetFilter">
        <span>{{ $t('common.setting_filter_mb') }}</span>
      </div>
    </div>
    <client-only>
      <date-picker-calendar-modal
        :id="calendarElementId"
        :date-range="dateRange"
        :label="labelDateRange"
        @on-confirm="onConfirmFilterDate"
      />
      <search-modal @on-search="onSearch" />
    </client-only>
  </div>
</template>
<script>
import { MODAL } from '@/resources/modal'
import merchantManagerMixin from '@/mixins/admin/merchant-manager';

export default {
  components: {
    DatePickerCalendarModal: () => import('~/components/mobile/modal/date-picker/index.vue'),
    SearchModal: () => import('~/components/mobile/modal/admin/user-filter/search.vue')
  },
  mixins: [merchantManagerMixin],
  data () {
    return {
      calendarElementId: 'filterModalDatePicker',
      dateRange: {
        startDate: null,
        endDate: null
      },
      labelDateRange: {
        selectDate: this.$t('role_management.label.time_create')
      },
      search: {
        value: '',
        field: ''
      },
      MODAL
    }
  },
  computed: {
    filterDateActive () {
      return this.dateRange.startDate || this.dateRange.endDate
    },
    filterSearchActive () {
      return this.search.value && this.search.field
    }
  },
  methods: {
    onOpenCalendar () {
      this.$bvModal.show(this.calendarElementId);
    },
    onOpenSearch () {
      this.$bvModal.show(MODAL.ADMIN_SEARCH_USER);
    },
    onConfirmFilterDate ({ startDate, endDate }) {
      this.dateRange = { startDate, endDate };
      this.emitFilter()
    },
    onSearch ({ value, field }) {
      this.search = { value, field }
      this.emitFilter()
    },
    onResetFilter () {
      if (!this.filterDateActive && !this.filterSearchActive) {
        return
      }
      this.dateRange = {
        startDate: null,
        endDate: null
      }
      this.search = {
        value: '',
        field: ''
      }
      this.emitFilter()
    },
    emitFilter () {
      this.$emit('on-filters', {
        startDate: this.dateRange.startDate,
        endDate: this.dateRange.endDate,
        search: this.search.value,
        field: this.search.field
      })
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/mobile/admin/users/filter.scss">
</style>
