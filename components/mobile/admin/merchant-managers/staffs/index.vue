<template>
  <client-only>
    <div class="role-management w-100">
      <div v-if="!isNotShowTop" class="role-management__top">
        <b-skeleton-wrapper :loading="isSkeletonLoading">
          <template #loading>
            <heading-info-loader-skeleton />
          </template>
          <template #default>
            <p class="role-management__title">
              <span class="icon-chevron-right1" @click="handleClickGoBack" />
              <span class="role-management__title-name">{{ nickName }}</span>
            </p>
            <merchant-manager-info
              :merchant-manager="merchantManager"
              @on-success-update="$_staffMixin_onRefresh"
            />
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
              <div :class="['role-management__head-inner', { 'next-to-top': isNotShowTop }]">
                <staff-filter
                  :status-options="statusOptions"
                  :staff-role-options="staffRoleOptions"
                  :operator-filter-flag="isNotShowTop"
                  :default-date-range="defaultDateRange"
                  @on-filters="handleFilter"
                  @on-toggle="handleToggleFilter"
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
                  :items="staffs"
                  :total="total"
                  :reset-list="page === 1"
                  show-empty
                  @refresh="handleResetFilter"
                  @infinite-loading="handleInfiniteLoading"
                >
                  <template #default="{ item }">
                    <staff-item
                      :key="item.id"
                      :staff="item"
                      @on-edit="handleEdit"
                    />
                  </template>
                </list-common>
              </div>
            </template>
          </b-skeleton-wrapper>
        </div>
      </div>
      <edit-staff-modal
        :staff="currentStaff"
        @on-delete="$_staffActionMixin_onShowModalDeleteStaff"
        @on-update-status="$_staffActionMixin_onUpdateStatusStaff"
      />
      <change-status-modal
        :title="titleStatus"
        :description="descriptionStatus"
        :is-confirm-active="isConfirmUpdateStatus"
        @on-confirm="$_staffActionMixin_updateInfoStaff"
      />
      <modal-success-result
        :postfix="postfix"
        :is-show-contract-from="false"
        :title="$t('staffs.form_edit.title_success')"
        :description="$t('staffs.form_edit.description_success')"
        :user="successfulResult"
        @on-close="handleResetFilter"
      />

      <modal-failure-result
        :postfix="postfix"
        :title="$t('staffs.form_edit.title_failure')"
        :default-description="$t('staffs.form_edit.description_failure')"
        :error-result="errorResult"
      />
      <delete-staff-modal :staff="currentStaff" />
    </div>
  </client-only>
</template>

<script>
import isEmpty from 'lodash/isEmpty';
import staffMixin from '@/mixins/admin/staff';
import staffsActionMixin from '@/mixins/admin/staffs-action';
import VanSticky from 'vant/lib/sticky'
import 'vant/lib/sticky/style'

export default {
  components: {
    VanSticky,
    MerchantManagerInfo: () => import('~/components/mobile/admin/merchant-managers/staffs/merchant-manager-info'),
    StaffItem: () => import('~/components/mobile/admin/merchant-managers/staffs/staff-item.vue'),
    StaffFilter: () => import('~/components/mobile/admin/merchant-managers/staffs/staff-filter.vue'),
    ListCommon: () => import('~/components/mobile/commons/list/index.vue'),
    FilterLoaderSkeleton: () => import('~/components/mobile/commons/loader/filters/index.vue'),
    HeadingInfoLoaderSkeleton: () => import('~/components/mobile/commons/loader/heading-info.vue'),
    CardLoaderSkeleton: () => import('~/components/mobile/commons/loader/staffs/card.vue'),
    EditStaffModal: () => import('~/components/desktop/admin/modal/staffs/edit.vue'),
    DeleteStaffModal: () => import('~/components/desktop/admin/modal/staffs/delete.vue'),
    ChangeStatusModal: () => import('~/components/desktop/admin/modal/staffs/change-status.vue'),
    ModalSuccessResult: () => import('~/components/common/role-management/modal-success.vue'),
    ModalFailureResult: () => import('~/components/common/role-management/modal-failure.vue')
  },
  mixins: [staffMixin, staffsActionMixin],
  data () {
    return {
      isSkeletonLoading: true,
      DEFAULT_LOADER: 2,
      isOpenFilter: false
    };
  },
  computed: {
    isNotShowTop () {
      return isEmpty(this.merchantManager) || this.isOpenFilter;
    },
    nickName () {
      return this.merchantManager?.nickName.substring(0, 36) + (this.merchantManager?.nickName.length > 36 ? '...' : '')
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
    async handleResetFilter () {
      await this.$_staffMixin_onResetFilter();
    },
    async handleChangePagination ({ page, limit }) {
      await this.$_staffMixin_onParamsChange({ page, limit });
    },
    async handleFilter (filter) {
      await this.$_staffMixin_onChangeFilter(filter);
    },
    async handleInfiniteLoading () {
      await this.$_staffMixin_onInfiniteLoading();
    },
    handleClickGoBack () {
      this.$_staffMixin_onGoBack();
    },
    handleToggleFilter (isOpenFilter) {
      this.isOpenFilter = isOpenFilter;
    },
    handleEdit (_staff) {
      this.$_staffActionMixin_onEditStaff(_staff)
    },
    finishSkeletonLoading () {
      setTimeout(() => {
        this.isSkeletonLoading = false;
      }, 1000);
    }
  }
};
</script>

<style lang="scss" scoped>
  @import "static/assets/scss/components/mobile/role-management/index.scss";
  @import "static/assets/scss/components/mobile/admin/staffs/index.scss";
</style>
