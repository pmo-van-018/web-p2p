<template>
  <section>
    <order-grid-renderer class="management-merchant">
      <template #head>
        <div class="management-merchant__head">
          <h3 class="management-merchant__title">{{ $t('staff.title') }}</h3>
        </div>
        <filters @on-filters="onFiltersData" />
      </template>
      <template #body>
        <list-common
          class="management-merchant__list"
          key-field="id"
          :loading="isLoading"
          :items="listStaffs"
          :total="total"
          :reset-list="page === 1"
          show-empty
          @refresh="$_staffMixin_onRefresh"
          @infinite-loading="onInfiniteLoading"
        >
          <template #default="{ item, isLastItem }">
            <card-item
              :key="item.id"
              :item="item"
              :is-last-item="isLastItem"
              @on-update="onEditMerchantStaff"
            />
          </template>
        </list-common>
      </template>
    </order-grid-renderer>
    <client-only>
      <edit-staff-modal
        :staff="currentStaff"
        @on-delete="onShowModalDeleteStaff"
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
        @on-close="$_staffMixin_onRefresh"
      />

      <modal-failure-result
        :postfix="postfix"
        :title="$t('staffs.form_edit.title_failure')"
        :default-description="$t('staffs.form_edit.description_failure')"
        :error-result="errorResult"
      />
      <delete-staff-modal :staff="currentStaff" />
    </client-only>
  </section>
</template>
<script>
import staffsMixin from '@/mixins/admin/staffs';
import { MODAL } from '@/resources/modal';
import staffsActionMixin from '@/mixins/admin/staffs-action';

export default {
  components: {
    OrderGridRenderer: () => import('~/components/mobile/orders/order-grid-renderer/index.vue'),
    Filters: () => import('~/components/mobile/admin/staffs/filters.vue'),
    ListCommon: () => import('~/components/mobile/commons/list/index.vue'),
    CardItem: () => import('~/components/mobile/admin/staffs/item.vue'),
    EditStaffModal: () => import('~/components/desktop/admin/modal/staffs/edit.vue'),
    DeleteStaffModal: () => import('~/components/desktop/admin/modal/staffs/delete.vue'),
    ChangeStatusModal: () => import('~/components/desktop/admin/modal/staffs/change-status.vue'),
    ModalSuccessResult: () => import('~/components/common/role-management/modal-success.vue'),
    ModalFailureResult: () => import('~/components/common/role-management/modal-failure.vue')
  },
  mixins: [staffsMixin, staffsActionMixin],
  data () {
    return {
      listStaffs: []
    }
  },
  watch: {
    staffs: {
      handler (staffs) {
        if (this.page === 1) {
          this.listStaffs = staffs
        } else {
          this.listStaffs = [...this.listStaffs, ...staffs]
        }
      }
    }
  },
  async created () {
    await this.$_staffMixin_getList()
  },
  methods: {
    async onFiltersData (options) {
      const { search, merchantIds, status, type, startDate, endDate } = options
      this.search = search
      this.status = status
      this.merchantManagerId = merchantIds
      this.type = type
      this.startDate = startDate
      this.endDate = endDate
      await this.$_staffMixin_getList()
    },
    async onInfiniteLoading () {
      if (!this.isLoading && this.page < this.totalPages) {
        this.page += 1
        await this.$_staffMixin_getInfiniteList()
      }
    },
    onEditMerchantStaff (staff) {
      this.currentStaff = staff
      this.$bvModal.show(MODAL.EDIT_ADMIN_STAFF)
    },
    onShowModalDeleteStaff () {
      this.$bvModal.hide(MODAL.EDIT_ADMIN_STAFF)
      setTimeout(() => {
        this.$bvModal.show(MODAL.DELETE_ADMIN_STAFF)
      }, 100)
    }
  }
}
</script>
<style lang="scss" scoped src="../../../../static/assets/scss/components/mobile/admin/staffs/index.scss">
</style>
