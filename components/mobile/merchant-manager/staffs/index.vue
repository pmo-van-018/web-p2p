<template>
  <client-only>
    <div class="role-management w-100">
      <div class="role-management__top">
        <div class="role-head">
          <div class="role-head__inner">
            <h2 class="role-head__title">{{ $t('staffs.title') }}</h2>
            <div class="role-head__sub">{{ $t('staffs.description') }}</div>
          </div>
          <div class="role-head__inner d-flex align-items-end flex-column">
            <div v-if="totalOrderWaitingCount" class="order-waiting">
              <div class="order-waiting__inner">
                <div class="order-waiting__content">
                  <span class="icon-note-order" />
                  <span class="order-waiting__text">{{ $t('role_management.number_waiting_order') }}</span>
                </div>
                <div class="order-waiting__count">{{ totalOrderWaitingCount }}</div>
              </div>
            </div>
            <div class="role-head__icon">
              <span class="icon-add-primary" @click="handleCreate" />
            </div>
          </div>
        </div>
      </div>
      <div class="role-management__content">
        <b-skeleton-wrapper :loading="isSkeletonLoading">
          <template #loading>
            <filter-loader-skeleton class="m-3" />
          </template>
          <template #default>
            <van-sticky class="role-management__head" :offset-top="56" z-index="999">
              <div class="role-management__head-inner">
                <staff-filter
                  :status-options="statusOptions"
                  :staff-role-options="staffRoleOptions"
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
                      @on-view-balance="onOpenViewBalanceStaff"
                    />
                  </template>
                </list-common>
              </div>
            </template>
          </b-skeleton-wrapper>
        </div>
      </div>
      <SelectStaffTypeModel @on-select-role="selectedRole" />
      <ModalAdd :selected-role-value="selectedRoleValue" @on-reset="handleResetFilter" />
      <ModalEdit
        :staff="currentStaff"
        @on-reset="handleResetFilter"
        @on-close="handleCloseModalEdit"
      />
      <modal-view-balance-staff :staff="selectedStaff" />
    </div>
  </client-only>
</template>

<script>
import staffMixin from '@/mixins/merchant-manager/staff';
import { mapActions, mapState } from 'vuex';
import { MODAL } from '@/resources/modal.js';
import VanSticky from 'vant/lib/sticky'
import 'vant/lib/sticky/style'

export default {
  components: {
    VanSticky,
    StaffItem: () => import('~/components/mobile/merchant-manager/staffs/staff-item.vue'),
    StaffFilter: () => import('~/components/mobile/merchant-manager/staffs/staff-filter.vue'),
    ListCommon: () => import('~/components/mobile/commons/list/index.vue'),
    FilterLoaderSkeleton: () => import('~/components/mobile/commons/loader/filters/index.vue'),
    CardLoaderSkeleton: () => import('~/components/mobile/commons/loader/staffs/card.vue'),
    ModalAdd: () => import('~/components/common/staffs/modal-add.vue'),
    ModalEdit: () => import('~/components/common/staffs/modal-edit.vue'),
    SelectStaffTypeModel: () => import('~/components/desktop/admin/modal/staffs/select-role.vue'),
    ModalViewBalanceStaff: () => import('~/components/desktop/modal/modal-view-balance-staff.vue')
  },
  mixins: [staffMixin],
  data () {
    return {
      isSkeletonLoading: true,
      DEFAULT_LOADER: 3,
      currentStaff: null,
      MODAL,
      selectedRoleValue: '',
      selectedStaff: null
    };
  },
  computed: {
    ...mapState('statistics', ['statistics']),
    orderWaitingCount () {
      return this.statistics?.orderWaitingCount || 0
    },
    orderAppealCount () {
      return this.statistics?.orderAppealCount || 0
    },
    orderWaitingUserCount () {
      return this.statistics?.orderWaitingUserCount || 0
    },
    totalOrderWaitingCount () {
      return this.orderWaitingCount + this.orderAppealCount + this.orderWaitingUserCount
    }
  },
  async created () {
    await Promise.all([this.$_staffMixin_getStaffs(), this.getMerchantStatistic()])
    await this.finishSkeletonLoading();
  },
  methods: {
    ...mapActions('statistics', ['getMerchantStatistic']),
    async handleResetFilter () {
      await Promise.all([this.$_staffMixin_onResetFilter(), this.getMerchantStatistic()])
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
    handleCreate () {
      this.$_staffMixin_onCreate();
    },
    handleEdit (merchantManager) {
      this.currentStaff = merchantManager;
      this.$_staffMixin_onEdit(merchantManager);
    },
    handleCloseModalEdit () {
      this.currentStaff = null;
    },
    finishSkeletonLoading () {
      setTimeout(() => {
        this.isSkeletonLoading = false;
      }, 1000);
    },
    selectedRole (data) {
      this.selectedRoleValue = data
      this.$bvModal.show(MODAL.ADD_STAFF);
    },
    onOpenViewBalanceStaff (staff) {
      this.$bvModal.show('modalShowBalanceStaff')
      this.selectedStaff = staff
    }
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/mobile/role-management/index.scss" />
