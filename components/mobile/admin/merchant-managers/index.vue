<template>
  <client-only>
    <div class="role-management w-100">
      <div class="role-management__top d-flex justify-content-between align-items-center">
        <span class="role-management__title font-t16m"> {{ $t('merchant_managers.title') }}</span>
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
                <merchant-manager-filter
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
                  :items="merchantManagers"
                  :total="total"
                  show-empty
                  :reset-list="page === 1"
                  @refresh="handleResetFilter"
                  @infinite-loading="handleInfiniteLoading"
                >
                  <template #default="{ item }">
                    <MerchantManagerItem
                      :key="item.id"
                      :merchant-manager="item"
                      @on-edit="handleEdit"
                    />
                  </template>
                </list-common>
              </div>
            </template>
          </b-skeleton-wrapper>
        </div>
      </div>

      <ModalAdd @on-reset="handleResetFilter" is-mobile/>

      <ModalEdit
        :merchant-manager="currentMerchantManager"
        @on-reset="handleResetFilter"
        @on-close="handleCloseModalEdit"
      />
    </div>
  </client-only>
</template>

<script>
import merchantManagerMixin from '@/mixins/admin/merchant-manager';
import VanSticky from 'vant/lib/sticky'
import 'vant/lib/sticky/style'

export default {
  components: {
    VanSticky,
    MerchantManagerItem: () => import('~/components/mobile/admin/merchant-managers/merchant-manager-item.vue'),
    MerchantManagerFilter: () => import('~/components/mobile/admin/merchant-managers/merchant-manager-filter.vue'),
    ListCommon: () => import('~/components/mobile/commons/list/index.vue'),
    FilterLoaderSkeleton: () => import('~/components/mobile/commons/loader/filters/index.vue'),
    CardLoaderSkeleton: () => import('~/components/mobile/commons/loader/merchant-managers/card.vue'),
    ModalAdd: () => import('~/components/common/merchant-managers/modal-add.vue'),
    ModalEdit: () => import('~/components/common/merchant-managers/modal-edit.vue')
  },
  mixins: [merchantManagerMixin],
  data () {
    return {
      isSkeletonLoading: true,
      DEFAULT_LOADER: 3,
      currentMerchantManager: null
    };
  },
  async created () {
    await this.$_merchantManagerMixin_getMerchantManagers();
    await this.finishSkeletonLoading();
  },
  methods: {
    async handleResetFilter () {
      await this.$_merchantManagerMixin_onResetFilter();
    },
    async handleChangePagination ({ page, limit }) {
      await this.$_merchantManagerMixin_onParamsChange({ page, limit });
    },
    async handleFilter (filter) {
      await this.$_merchantManagerMixin_onChangeFilter(filter);
    },
    async handleInfiniteLoading () {
      await this.$_merchantManagerMixin_onInfiniteLoading();
    },
    handleCreate () {
      this.$_merchantManagerMixin_onCreate();
    },
    handleEdit (merchantManager) {
      this.currentMerchantManager = merchantManager;
      this.$_merchantManagerMixin_onEdit(merchantManager);
    },
    handleCloseModalEdit () {
      this.currentMerchantManager = null;
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
