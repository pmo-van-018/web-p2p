<template>
  <client-only>
    <div class="role-management">
      <div class="role-management__heading">
        <b-skeleton-wrapper :loading="isSkeletonLoading">
          <template #loading>
            <heading-info-loader-skeleton />
          </template>
          <template #default>
            <p class="role-management__title">
              <span class="icon-chevron-right1" @click="handleClickGoBack" />
              <span class="role-management__title-name">{{ merchantManager?.nickName }}</span>
            </p>
            <merchant-manager-info
              v-if="isShowMerchantManagerInfo"
              :merchant-manager="merchantManager"
              @on-success-update="$_staffMixin_onRefresh"
            />
          </template>
        </b-skeleton-wrapper>
      </div>

      <div class="role-management__content">
        <div class="role-management__head">
          <b-skeleton-wrapper :loading="isSkeletonLoading">
            <template #loading>
              <filter-loader-skeleton :is-show-action="false" />
            </template>
            <template #default>
              <staff-filter
                is-visible-date-picker
                :loading="isLoading"
                :status-options="statusOptions"
                :staff-role-options="staffRoleOptions"
                :default-date-range="defaultDateRange"
                @on-filters="handleFilter"
                @on-reset="handleResetFilter"
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
              <staff-table
                ref="staffTable"
                :items="staffs"
                :page="page"
                :limit="limit"
                :total="total"
                :is-loading="isLoading"
                @change-pagination="handleChangePagination"
                @on-edit="handleEdit"
                @on-reset="handleResetFilter"
                @on-refresh="handleRefresh"
              />
            </template>
          </b-skeleton-wrapper>
        </div>
      </div>
    </div>
  </client-only>
</template>

<script>
import isEmpty from 'lodash/isEmpty';
import staffMixin from '@/mixins/admin/staff';
export default {
  components: {
    MerchantManagerInfo: () => import('~/components/desktop/admin/merchant-managers/staffs/merchant-manager-info'),
    StaffFilter: () => import('~/components/desktop/admin/merchant-managers/staffs/staff-filter.vue'),
    StaffTable: () => import('~/components/desktop/admin/merchant-managers/staffs/staff-table.vue'),
    HeadingInfoLoaderSkeleton: () => import('~/components/desktop/commons/loader/heading-info.vue'),
    FilterLoaderSkeleton: () => import('~/components/desktop/commons/loader/filters.vue')
  },
  mixins: [staffMixin],
  data () {
    return {
      isSkeletonLoading: true
    };
  },
  computed: {
    isShowMerchantManagerInfo () {
      return !isEmpty(this.merchantManager);
    }
  },
  async created () {
    await Promise.all([
      this.$_staffMixin_getMerchantManager(),
      this.$_staffMixin_getStaffs()
    ]);
    await this.finishSkeletonLoading();
  },
  methods: {
    async handleChangePagination ({ page, limit }) {
      await this.$_staffMixin_onParamsChange({ page, limit });
    },
    async handleFilter (filter) {
      await this.$_staffMixin_onChangeFilter(filter);
    },
    async handleResetFilter () {
      await this.$_staffMixin_onResetFilter();
    },
    async handleRefresh () {
      await this.$_staffMixin_onRefresh();
    },
    handleClickGoBack () {
      this.$_staffMixin_onGoBack();
    },
    // TODO: Add logic to this function
    handleEdit (_staff) {},
    finishSkeletonLoading () {
      setTimeout(() => {
        this.isSkeletonLoading = false;
      }, 1000);
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "static/assets/scss/components/desktop/role-management/index.scss";
  @import "static/assets/scss/components/desktop/admin/staffs/index.scss";
</style>
