<template>
  <client-only>
    <div class="role-management">
      <div class="role-management__heading role-management__heading--grey">
        <div class="role-management__wrapper-context">
          <div class="role-management__outer">
            <p class="role-management__title">{{ $t('admin.title') }}</p>
            <p class="role-management__description">{{ $t('admin.description') }}</p>
          </div>
        </div>
      </div>
      <div class="role-management__content">
        <div class="role-management__head">
          <b-skeleton-wrapper :loading="isSkeletonLoading">
            <template #loading>
              <filter-loader-skeleton />
            </template>
            <template #default>
              <admin-filter
                is-visible-date-picker
                :loading="isLoading"
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
              <admin-table
                ref="adminTable"
                :items="admins"
                :page="page"
                :limit="limit"
                :total="total"
                :is-loading="isLoading"
                @change-pagination="handleChangePagination"
                @on-edit="handleEdit"
                @on-reset="handleRefresh"
              />
            </template>
          </b-skeleton-wrapper>
        </div>
      </div>
    </div>
  </client-only>
</template>

<script>
import adminMixin from '@/mixins/system-admin/admins';

export default {
  components: {
    AdminFilter: () => import('~/components/desktop/system-admin/admins/filter.vue'),
    AdminTable: () => import('~/components/desktop/system-admin/admins/table.vue'),
    FilterLoaderSkeleton: () => import('~/components/desktop/commons/loader/filters.vue')
  },
  mixins: [adminMixin],
  data () {
    return {
      isSkeletonLoading: true
    };
  },
  async created () {
    await this.$_adminMixin_getAdmins()
    await this.finishSkeletonLoading();
  },
  methods: {
    async handleChangePagination ({ page, limit }) {
      await this.$_adminMixin_onParamsChange({ page, limit });
    },
    async handleFilter (filter) {
      this.page = 1
      await this.$_adminMixin_onChangeFilter(filter);
    },
    async handleRefresh () {
      await this.$_adminMixin_getAdmins()
    },
    async handleResetFilter () {
      await this.$_adminMixin_onResetFilter()
    },
    handleCreate () {
      this.$_adminMixin_onCreate();
    },
    handleEdit (merchantManager) {
      this.$_adminMixin_onEdit(merchantManager);
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
