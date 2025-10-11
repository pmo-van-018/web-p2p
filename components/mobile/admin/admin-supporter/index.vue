<template>
  <client-only>
    <div class="role-management w-100">
      <div class="role-management__top d-flex justify-content-between align-items-center">
        <span class="role-management__title font-t16m"> {{ $t('admin_supporter.title') }}</span>
        <b-skeleton-wrapper :loading="isSkeletonLoading">
          <template #loading>
            <b-skeleton type="button" with="40px" height="20px" />
          </template>
          <template #default>
            <div class="role-management__create d-flex align-items-center grey-900">
              <span class="icon-add-primary" @click="handleCreate" />
            </div>
          </template>
        </b-skeleton-wrapper>
      </div>
      <div class="role-management__content">
        <b-skeleton-wrapper :loading="isSkeletonLoading">
          <template #loading>
            <filter-loader-skeleton class="m-3" />
          </template>
          <template #default>
            <van-sticky class="role-management__head" :offset-top="56" z-index="999">
              <div class="role-management__head-inner">
                <admin-supporter-filter
                  :status-options="statusOptions"
                  :default-date-range="defaultDateRange"
                  @on-filters="handleFilter"
                />
              </div>
            </van-sticky>
          </template>
        </b-skeleton-wrapper>

        <div class="role-management-table">
          <b-skeleton-wrapper :loading="isSkeletonLoading">
            <template #loading>
              <card-loader-skeleton v-for="key in DEFAULT_LOADER" :key="key" />
            </template>
            <template #default>
              <div class="t-body">
                <list-common
                  class="completed-order__list"
                  key-field="id"
                  :loading="isLoading"
                  :items="adminSupporters"
                  :total="total"
                  show-empty
                  :reset-list="page === 1"
                  @refresh="handleResetFilter"
                  @infinite-loading="handleInfiniteLoading"
                >
                  <template #default="{ item }">
                    <admin-supporter-item
                      :key="item.id"
                      :admin-supporter="item"
                      @on-edit="handleEdit"
                    />
                  </template>
                </list-common>
              </div>
            </template>
          </b-skeleton-wrapper>
        </div>
      </div>

      <modal-add is-mobile @on-reset="handleResetFilter" />

      <modal-edit
        :admin-supporter="currentAdminSupporter"
        @on-reset="handleResetFilter"
        @on-close="handleCloseModalEdit"
      />
    </div>
  </client-only>
</template>

<script>
import adminSupporterMixin from '@/mixins/admin/admin-supporter';
import VanSticky from 'vant/lib/sticky'
import 'vant/lib/sticky/style'

export default {
  components: {
    VanSticky,
    AdminSupporterItem: () => import('~/components/mobile/admin/admin-supporter/item.vue'),
    AdminSupporterFilter: () => import('~/components/mobile/admin/admin-supporter/filter.vue'),
    ListCommon: () => import('~/components/mobile/commons/list/index.vue'),
    FilterLoaderSkeleton: () => import('~/components/mobile/commons/loader/filters/index.vue'),
    CardLoaderSkeleton: () => import('~/components/mobile/commons/loader/merchant-managers/card.vue'),
    ModalAdd: () => import('~/components/desktop/admin/modal/admin-supporter/modal-add.vue'),
    ModalEdit: () => import('~/components/desktop/admin/modal/admin-supporter/modal-edit.vue')
  },
  mixins: [adminSupporterMixin],
  data () {
    return {
      isSkeletonLoading: true,
      DEFAULT_LOADER: 3,
      currentAdminSupporter: null
    };
  },
  async created () {
    await this.$_adminSupporterMixin_getAdminSupporters();
    await this.finishSkeletonLoading();
  },
  methods: {
    async handleResetFilter () {
      await this.$_adminSupporterMixin_onResetFilter();
    },
    async handleChangePagination ({ page, limit }) {
      await this.$_adminSupporterMixin_onParamsChange({ page, limit });
    },
    async handleFilter (filter) {
      await this.$_adminSupporterMixin_onChangeFilter(filter);
    },
    async handleInfiniteLoading () {
      await this.$_adminSupporterMixin_onInfiniteLoading();
    },
    handleCreate () {
      this.$_adminSupporterMixin_onCreate();
    },
    handleEdit (adminSupporter) {
      this.currentAdminSupporter = adminSupporter;
      this.$_adminSupporterMixin_onEdit(adminSupporter);
    },
    handleCloseModalEdit () {
      this.currentAdminSupporter = null;
    },
    finishSkeletonLoading () {
      setTimeout(() => {
        this.isSkeletonLoading = false;
      }, 1000);
    }
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/mobile/role-management/index.scss" />
