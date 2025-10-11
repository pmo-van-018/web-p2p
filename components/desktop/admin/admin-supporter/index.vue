<template>
  <client-only>
    <div class="role-management">
      <div class="role-management__heading">
        <p class="role-management__title">{{ $t('admin_supporter.title') }}</p>
        <p class="role-management__description">{{ $t('admin_supporter.description') }}</p>
      </div>
      <div class="role-management__content">
        <div class="role-management__head">
          <b-skeleton-wrapper :loading="isSkeletonLoading">
            <template #loading>
              <filter-loader-skeleton />
            </template>
            <template #default>
              <admin-supporter-filter
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
              <admin-supporter-table
                ref="adminSupporterTable"
                :items="adminSupporters"
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
import adminSupportersMixin from '@/mixins/admin/admin-supporter';
export default {
  components: {
    AdminSupporterFilter: () => import('~/components/desktop/admin/admin-supporter/admin-supporter-filter.vue'),
    AdminSupporterTable: () => import('~/components/desktop/admin/admin-supporter/admin-supporter-table.vue'),
    FilterLoaderSkeleton: () => import('~/components/desktop/commons/loader/filters.vue')
  },
  mixins: [adminSupportersMixin],
  data () {
    return {
      isSkeletonLoading: true
    };
  },
  async created () {
    await this.$_adminSupporterMixin_getAdminSupporters();
    await this.finishSkeletonLoading();
  },
  methods: {
    async handleChangePagination ({ page, limit }) {
      await this.$_adminSupporterMixin_onParamsChange({ page, limit });
    },
    async handleFilter (filter) {
      await this.$_adminSupporterMixin_onChangeFilter(filter);
    },
    async handleResetFilter () {
      await this.$_adminSupporterMixin_onResetFilter();
    },
    handleCreate () {
      this.$_adminSupporterMixin_onCreate();
    },
    handleEdit (adminSupporter) {
      this.$_adminSupporterMixin_onEdit(adminSupporter);
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
