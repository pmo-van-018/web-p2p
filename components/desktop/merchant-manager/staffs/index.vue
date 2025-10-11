<template>
  <client-only>
    <div class="role-management">
      <div class="role-management__heading">
        <div class="role-management__wrapper-context">
          <div class="role-management__outer">
            <p class="role-management__title">{{ $t('staffs.title') }}</p>
            <p class="role-management__description">{{ $t('staffs.description') }}</p>
          </div>
          <div v-if="totalOrderWaitingCount" class="role-management__outer">
            <div class="order-waiting">
              <div class="order-waiting__inner">
                <div class="order-waiting__content">
                  <div class="order-waiting__icon">
                    <span class="icon-note-order" />
                  </div>
                  <span class="order-waiting__text">{{ $t('role_management.number_waiting_order') }}</span>
                </div>
                <div class="order-waiting__count">{{ totalOrderWaitingCount }}</div>
              </div>
            </div>
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
              <staff-filter
                is-visible-date-picker
                :loading="isLoading"
                :status-options="statusOptions"
                :staff-role-options="staffRoleOptions"
                :default-date-range="defaultDateRange"
                @on-filters="handleFilter"
                @on-create="handleCreate"
                @on-reset="handleResetFilter"
                @on-open-limit-balance="handleOpenLimitBalanceModal"
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
                :enable-public-view="true"
                @change-pagination="handleChangePagination"
                @on-edit="handleEdit"
                @on-reset="handleRefresh"
              />
            </template>
          </b-skeleton-wrapper>
        </div>
      </div>
      <modal-balance-limit
        :balance-configs="balanceConfigurations"
        :is-loading="isLoadingListBalance"
        @on-show="$_staffLimitBalanceMixin_getBalanceLimitConfigurations"
        @on-confirm-submit="$_staffLimitBalanceMixin_onConfirmSubmitBalance"
      />
      <modal-result-balance-limit
        :balance-configs="balanceConfigurations"
        :is-loading="isLoadingUpdateBalance"
        @on-update-balance="$_staffLimitBalanceMixin_updateBalanceConfigurations"
      />
    </div>
  </client-only>
</template>

<script>
import staffMixin from '@/mixins/merchant-manager/staff';
import staffLimitBalanceMixin from '@/mixins/merchant-manager/staff-limit-balance';
import { mapActions, mapState } from 'vuex';
import { MODAL } from '@/resources/modal';
export default {
  components: {
    StaffFilter: () => import('~/components/desktop/merchant-manager/staffs/staff-filter.vue'),
    StaffTable: () => import('~/components/desktop/merchant-manager/staffs/staff-table.vue'),
    FilterLoaderSkeleton: () => import('~/components/desktop/commons/loader/filters.vue'),
    ModalBalanceLimit: () => import('@/components/desktop/merchant-manager/staffs/balance-limit/modal-balance-limit.vue'),
    ModalResultBalanceLimit: () => import('@/components/desktop/merchant-manager/staffs/balance-limit/modal-result-balance-limit.vue')
  },
  mixins: [staffMixin, staffLimitBalanceMixin],
  data () {
    return {
      isSkeletonLoading: true
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
    async handleChangePagination ({ page, limit }) {
      await this.$_staffMixin_onParamsChange({ page, limit });
    },
    async handleFilter (filter) {
      this.page = 1
      await this.$_staffMixin_onChangeFilter(filter);
    },
    async handleRefresh () {
      await this.$_staffMixin_getStaffs()
    },
    async handleResetFilter () {
      await Promise.all([this.$_staffMixin_onResetFilter(), this.getMerchantStatistic()]);
    },
    handleOpenLimitBalanceModal () {
      this.$bvModal.show(MODAL.SETTING_LIMIT_BALANCE)
    },
    handleCreate () {
      this.$_staffMixin_onCreate();
    },
    handleEdit (merchantManager) {
      this.$_staffMixin_onEdit(merchantManager);
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
