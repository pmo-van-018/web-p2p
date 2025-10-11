<template>
  <client-only>
    <div class="role-management">
      <div>
        <div class="role-management__head">
          <b-skeleton-wrapper :loading="isSkeletonLoading">
            <template #loading>
              <filter-loader-skeleton />
            </template>
            <template #default>
              <shift-management-filter
                :loading="isLoading"
                :is-visible-approved-all="false"
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
                :fields="fields"
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
    </div>
  </client-only>
</template>

<script>
import approvedShiftManagementMixin from '~/mixins/merchant-manager/shift-management/approved'

export default {
  components: {
    ShiftManagementFilter: () => import('~/components/desktop/merchant-manager/shift-management/filter.vue'),
    ShiftManagementTable: () => import('~/components/desktop/merchant-manager/shift-management/table.vue'),
    FilterLoaderSkeleton: () => import('~/components/desktop/commons/loader/filters.vue')
  },
  mixins: [approvedShiftManagementMixin]
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/role-management/index.scss"/>
