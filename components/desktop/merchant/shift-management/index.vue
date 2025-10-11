<template>
  <client-only>
    <div class="role-management">
      <div class="role-management__heading role-management__heading--grey">
        <shift-management-head />
      </div>
      <div class="role-management__content">
        <div class="role-management__head">
          <b-skeleton-wrapper :loading="isSkeletonLoading">
            <template #loading>
              <filter-loader-skeleton />
            </template>
            <template #default>
              <shift-management-filter
                :loading="isLoading"
                @on-filters="handleFilter"
              />
            </template>
          </b-skeleton-wrapper>
        </div>

        <div class="role-management__body">
          <b-skeleton-wrapper :loading="isSkeletonLoading">
            <template #loading>
              <b-skeleton-table
                :rows="7"
                :columns="7"
                :table-props="{ bordered: false, striped: false }"
              />
            </template>
            <template #default>
              <shift-management-table
                ref="shiftManagementTable"
                :items="shiftManagementList"
                :page="page"
                :limit="limit"
                :total="total"
                :is-loading="isLoading"
                @change-pagination="handleChangePagination"
                @change-sort="handleChangeSort"
              />
            </template>
          </b-skeleton-wrapper>
        </div>
      </div>
      <modal-shift-management />
    </div>
  </client-only>
</template>

<script>
import { SHIFT_MANAGEMENT } from '@/api/shift-management';
import { mapState } from 'vuex';

export default {
  components: {
    ModalShiftManagement: () => import('~/components/desktop/merchant/shift-management/modal-shift-management.vue'),
    ShiftManagementFilter: () => import('~/components/desktop/merchant/shift-management/filter.vue'),
    ShiftManagementTable: () => import('~/components/desktop/merchant/shift-management/table.vue'),
    FilterLoaderSkeleton: () => import('~/components/desktop/commons/loader/filters.vue'),
    ShiftManagementHead: () => import('~/components/desktop/merchant/shift-management/head.vue')
  },
  data () {
    return {
      isSkeletonLoading: false,
      isLoading: false,
      shiftManagementList: [],
      page: 1,
      total: 0,
      limit: 10,
      orderField: null,
      orderDirection: null,
      startDate: null,
      endDate: null,
      searchType: null,
      status: null
    };
  },
  computed: {
    ...mapState('user', ['isShiftProcessing']),
    filterOptions () {
      return {
        page: this.page,
        limit: this.limit,
        ...(this.startDate) && { startDate: `${this.startDate}` },
        ...(this.status) && { status: this.status },
        ...(this.endDate) && { endDate: `${this.endDate}` },
        ...(this.searchType) && { searchType: `${this.searchType}` },
        ...(this.orderDirection && this.orderField) && { orderField: `${this.orderField}` },
        ...(this.orderDirection && this.orderField) && { orderDirection: `${this.orderDirection}` }
      }
    }
  },
  watch: {
    isShiftProcessing () {
      this.handleFilter({
        startDate: this.startDate,
        endDate: this.endDate,
        searchType: this.fieldDate,
        status: this.status
      })
    }
  },
  async created () {
    await this.onGetOperatorShiftHistories()
  },
  methods: {
    async handleChangePagination ({ page, limit }) {
      this.page = page
      this.limit = limit
      await this.onGetOperatorShiftHistories()
    },
    async handleFilter ({ startDate, endDate, fieldDate, status }) {
      this.page = 1
      this.startDate = startDate
      this.endDate = endDate
      this.searchType = fieldDate
      this.status = status
      await this.onGetOperatorShiftHistories()
    },
    async handleChangeSort ({ sortField, sortDirection }) {
      this.page = 1
      this.orderField = sortField
      this.orderDirection = sortDirection
      await this.onGetOperatorShiftHistories()
    },
    async onGetOperatorShiftHistories () {
      try {
        this.isLoading = true
        const { data } = await this.$axios.$get(SHIFT_MANAGEMENT.GET_LIST_SHIFT, {
          params: this.filterOptions
        })
        this.shiftManagementList = data?.items || []
        this.total = data?.totalItems || 0
      } catch (error) {
        console.error(error)
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/role-management/index.scss" />
