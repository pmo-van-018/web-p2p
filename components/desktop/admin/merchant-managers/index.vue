<template>
  <client-only>
    <div class="role-management">
      <div class="role-management__heading">
        <p class="role-management__title">{{ $t('merchant_managers.title') }}</p>
        <p class="role-management__description">{{ $t('merchant_managers.description') }}</p>
      </div>
      <div class="role-management__content">
        <div class="role-management__head">
          <b-skeleton-wrapper :loading="isSkeletonLoading">
            <template #loading>
              <filter-loader-skeleton />
            </template>
            <template #default>
              <merchant-manager-filter
                is-visible-date-picker
                :loading="isLoading"
                :status-options="statusOptions"
                :default-date-range="defaultDateRange"
                @on-filters="handleFilter"
                @on-create="handleCreate"
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
              <merchant-manager-table
                ref="merchantManagerTable"
                :items="merchantManagers"
                :page="page"
                :limit="limit"
                :total="total"
                :is-loading="isLoading"
                @change-pagination="handleChangePagination"
                @on-edit="handleEdit"
                @on-reset="handleResetFilter"
              />
            </template>
          </b-skeleton-wrapper>
        </div>
      </div>
    </div>
  </client-only>
</template>

<script>
import merchantManagerMixin from '@/mixins/admin/merchant-manager';
export default {
  components: {
    MerchantManagerFilter: () => import('~/components/desktop/admin/merchant-managers/merchant-manager-filter'),
    MerchantManagerTable: () => import('~/components/desktop/admin/merchant-managers/merchant-manager-table'),
    FilterLoaderSkeleton: () => import('~/components/desktop/commons/loader/filters.vue')
  },
  mixins: [merchantManagerMixin],
  data () {
    return {
      isSkeletonLoading: true
    };
  },
  async created () {
    await this.$_merchantManagerMixin_getMerchantManagers();
    await this.finishSkeletonLoading();
  },
  methods: {
    async handleChangePagination ({ page, limit }) {
      await this.$_merchantManagerMixin_onParamsChange({ page, limit });
    },
    async handleFilter (filter) {
      await this.$_merchantManagerMixin_onChangeFilter(filter);
    },
    async handleResetFilter () {
      await this.$_merchantManagerMixin_onResetFilter();
    },
    handleCreate () {
      this.$_merchantManagerMixin_onCreate();
    },
    handleEdit (merchantManager) {
      this.$_merchantManagerMixin_onEdit(merchantManager);
    },
    finishSkeletonLoading () {
      setTimeout(() => {
        this.isSkeletonLoading = false;
      }, 1000);
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/role-management/index.scss" />
