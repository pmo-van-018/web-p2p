<template>
  <div class="role-management-table">
    <base-table
      :fields="fields"
      :items="items"
      :is-loading="isLoading"
      :disabled="disabled"
      @change-sort="$emit('change-sort', $event)"
      @row-clicked="$emit('row-clicked', $event)"
    >
      <template #cell(walletAddress)="{ item }">
        <div class="role-management-item wallet-address flex-row">
          <span class="wallet-address__name">
            {{ item?.walletAddress }}
          </span>

          <copy-button
            :id="`wallet-address-copy-${item?.id}`"
            :value="item?.walletAddress"
            :text-guide="$t('role_management.label.copy_wallet_address')"
          />
        </div>
      </template>

      <template #cell(nickName)="{ item }">
        <div :class="['role-management-item', { 'underline': isOperator(item) }]" @click="goToDashboard(item)">
          {{ item?.nickName }}
        </div>
      </template>

      <template #cell(postShownCount)="{ item }">
        <div class="role-management-item">
          {{ calPostShownCount(item) }}
        </div>
      </template>

      <template #cell(orderWaitingCount)="{ item }">
        <div class="role-management-item">
          {{ calOrderWaitingCount(item) }}
        </div>
      </template>

      <template #cell(type)="{ item }">
        <div class="role-management-item">
          {{ getLabelType(item) }}
        </div>
      </template>

      <template #cell(status)="{ item }">
        <div class="role-management-item">
          <div class="sub-text" :class="getClassStatus(item)">
            {{ getLabelStatus(item) }}
          </div>
        </div>
      </template>

      <template #cell(updateAt)="{ item }">
        <div class="role-management-item">
          <div class="sub-text">
            <div>{{ item?.createdAt | formatDateTime }}</div>
            <div>{{ item?.updatedAt | formatDateTime }}</div>
          </div>
        </div>
      </template>
    </base-table>

    <div class="role-management-table__pagination">
      <pagination-limit
        :page="page"
        :limit="limit"
        :total="total"
        :note="$t('role_management.pagination')"
        @set-limit="handleChangeLimit"
        @set-page="handleChangePagination"
      />
    </div>

    <client-only>
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
        @on-close="$emit('on-refresh')"
      />

      <modal-failure-result
        :postfix="postfix"
        :title="$t('staffs.form_edit.title_failure')"
        :default-description="$t('staffs.form_edit.description_failure')"
        :error-result="errorResult"
      />
      <delete-staff-modal :staff="currentStaff" />
    </client-only>
  </div>
</template>

<script>
import roleManagementMixin from '@/mixins/role-management';
import { DATE_TIME_FORMAT } from '@/config/constant';
import { TABLE_FIELDS } from '@/resources/role-management';
import staffsActionMixin from '@/mixins/admin/staffs-action';

export default {
  components: {
    BaseTable: () => import('~/components/desktop/commons/tables/index.vue'),
    PaginationLimit: () => import('~/components/desktop/commons/pagination-limit/index.vue'),
    CopyButton: () => import('~/components/common/copy-button.vue'),
    EditStaffModal: () => import('~/components/desktop/admin/modal/staffs/edit.vue'),
    DeleteStaffModal: () => import('~/components/desktop/admin/modal/staffs/delete.vue'),
    ChangeStatusModal: () => import('~/components/desktop/admin/modal/staffs/change-status.vue'),
    ModalSuccessResult: () => import('~/components/common/role-management/modal-success.vue'),
    ModalFailureResult: () => import('~/components/common/role-management/modal-failure.vue')
  },
  mixins: [roleManagementMixin, staffsActionMixin],
  props: {
    items: {
      type: Array,
      default: () => []
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    page: {
      type: Number,
      default: 1
    },
    total: {
      type: Number,
      default: 0
    },
    limit: {
      type: Number,
      default: 10
    }
  },
  data () {
    return {
      DATE_TIME_FORMAT,
      fields: this.$_roleManagementMixin_getTableFields(TABLE_FIELDS.ADMIN_STAFF)
    };
  },
  computed: {
    disabled () {
      return !this.items?.length;
    }
  },
  methods: {
    handleChangePagination (page) {
      this.$emit('change-pagination', {
        page,
        limit: this.limit
      })
    },
    handleChangeLimit (limit) {
      this.$emit('change-pagination', {
        page: this.page,
        limit
      })
    },
    async handleResetFilter () {
      await this.$emit('on-reset');
    },
    handleEdit (staff) {
      this.$_staffActionMixin_onEditStaff(staff)
    },
    getClassStatus (item) {
      return this.$_roleManagementMixin_getClassStatus(item);
    },
    getLabelStatus (item) {
      return this.$_roleManagementMixin_getLabelStatus(item);
    },
    getLabelType (item) {
      return this.$_roleManagementMixin_getLabelType(item);
    },
    calOrderWaitingCount (item) {
      if (this.isOperator(item)) {
        return (item.statistic?.orderWaitingCount || 0) + (item.statistic?.orderWaitingUserCount || 0)
      }
      return '-'
    },
    calPostShownCount (item) {
      if (this.isOperator(item)) {
        return item?.statistic?.postShownCount || 0
      }
      return '-'
    }
  }
}

</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/role-management/table.scss" />
