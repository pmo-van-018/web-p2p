<template>
  <layout-wrapper class="managements">
    <template #head>
      <div class="managements__head">
        <h2 class="managements__title">{{ $t('staff.title') }}</h2>
        <p class="managements__content">{{ $t('staff.content') }}</p>
      </div>
    </template>
    <template #body>
      <client-only>
        <template #placeholder>
          <filter-loader-skeleton class="delay-animation my-2" />
          <b-skeleton-table
            class="delay-animation"
            :rows="7"
            :columns="4"
            :table-props="{ bordered: false, striped: false }"
          />
        </template>
        <div class="managements__filter">
          <filter-head
            @on-search="onSearchStaff"
            @on-filters="$_staffMixin_onFilter"
          />
        </div>
        <order-table
          class="managements__table"
          :items="staffs"
          :fields="fields"
          :page="page"
          :limit="limit"
          :total="total"
          :is-loading="isLoading"
          :pagination-title="$t('role_management.pagination')"
          @change-sort="$_staffMixin_handleChangeSort"
          @change-pagination="$_staffMixin_onChangePage"
        >
          <template #cell(walletAddress)="{ item }">
            <div class="managements__item wallet-address">
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
            <div :class="['managements__item', { 'underline': isOperator(item) }]" @click="goToDashboard(item)">
              {{ item?.nickName }}
            </div>
          </template>
          <template #cell(numberMembers)="{ item }">
            <div class="managements__item">
              {{ item?.registeredMembers }}
            </div>
          </template>

          <template #cell(type)="{ item }">
            <div class="managements__item">
              {{ getLabelType(item) }}
            </div>
          </template>

          <template #cell(status)="{ item }">
            <div class="managements__item">
              <div class="sub-text" :class="getClassStatus(item)">
                {{ getLabelStatus(item) }}
              </div>
            </div>
          </template>

          <template #cell(merchant)="{ item }">
            <div class="managements__item">
              {{ item.merchantManagerNickName }}
            </div>
          </template>

          <template #cell(pendingOrders)="{ item }">
            <div class="managements__item">
              {{ calOrderWaitingCount(item) }}
            </div>
          </template>

          <template #cell(postingOnline)="{ item }">
            <div class="managements__item">
              {{ showOnlinePost(item) }}
            </div>
          </template>

          <template #cell(updateAt)="{ item }">
            <div class="managements__item">
              <div class="sub-text">
                <div>{{ item?.createdAt | formatDateTime }}</div>
                <div>{{ item?.updatedAt | formatDateTime }}</div>
              </div>
            </div>
          </template>
          <template #cell(action)="{ item }">
            <div class="managements__item actions">
              <span
                :id="'staff-icon-edit' + item?.id"
                class="icon-edit"
                @click="onEditStaff(item)"
              />
              <b-tooltip :target="'staff-icon-edit' + item?.id" triggers="hover" placement="top">
                {{ $t('role_management.item.edit') }}
              </b-tooltip>
            </div>
          </template>
        </order-table>
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
          @on-cancel="$bvModal.show(MODAL.EDIT_ADMIN_STAFF)"
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
    </template>x
  </layout-wrapper>
</template>
<script>
import staffsMixin from '@/mixins/admin/staffs'
import debounce from 'lodash/debounce'
import { MODAL } from '@/resources/modal'
import staffsActionMixin from '@/mixins/admin/staffs-action';
import { USER_ROLE } from '@/config/constant.js'

export default {
  components: {
    LayoutWrapper: () => import('~/components/containers/layout-wrapper/index.vue'),
    OrderTable: () => import('~/components/desktop/orders/table/index.vue'),
    FilterHead: () => import('~/components/desktop/admin/staffs/filter-head.vue'),
    CopyButton: () => import('~/components/common/copy-button.vue'),
    FilterLoaderSkeleton: () => import('~/components/desktop/commons/loader/filters.vue'),
    EditStaffModal: () => import('~/components/desktop/admin/modal/staffs/edit.vue'),
    DeleteStaffModal: () => import('~/components/desktop/admin/modal/staffs/delete.vue'),
    ChangeStatusModal: () => import('~/components/desktop/admin/modal/staffs/change-status.vue'),
    ModalSuccessResult: () => import('~/components/common/role-management/modal-success.vue'),
    ModalFailureResult: () => import('~/components/common/role-management/modal-failure.vue')
  },
  mixins: [staffsMixin, staffsActionMixin],
  async created () {
    await this.$_staffMixin_getList()
  },
  methods: {
    onEditStaff (staff) {
      this.currentStaff = staff
      this.$bvModal.show(MODAL.EDIT_ADMIN_STAFF)
    },
    getClassStatus (item) {
      if (!item?.status) {
        return ''
      }
      return `${item.status.toLowerCase()}-status`
    },
    getLabelType (item) {
      const roleNames = {
        [USER_ROLE.MERCHANT_OPERATOR]: 'Giao dịch viên',
        [USER_ROLE.MERCHANT_SUPPORTER]: 'Hỗ trợ viên',
        [USER_ROLE.MERCHANT_MANAGER]: 'Thương gia',
        [USER_ROLE.SUPER_ADMIN]: 'Quản trị viên'
      };
      return roleNames[item?.type] || '';
    },
    getLabelStatus (item) {
      if (!item?.status) {
        return ''
      }
      return this.$t(`role_management.item.${item.status.toLowerCase()}`)
    },
    onSearchStaff: debounce(function (searchKeyWord) {
      this.$_staffMixin_onSearch(searchKeyWord)
    }, 500),
    onShowModalDeleteStaff () {
      this.$bvModal.hide(MODAL.EDIT_ADMIN_STAFF)
      setTimeout(() => {
        this.$bvModal.show(MODAL.DELETE_ADMIN_STAFF)
      }, 100)
    },
    calOrderWaitingCount (item) {
      if (item?.type === USER_ROLE.MERCHANT_SUPPORTER) {
        return '-'
      }
      return (item.statistic?.orderAppealCount || 0) + (item.statistic?.orderWaitingCount || 0) + (item.statistic?.orderWaitingUserCount || 0)
    },
    showOnlinePost (item) {
      if (item?.type === USER_ROLE.MERCHANT_SUPPORTER) {
        return '-'
      }
      return item?.statistic?.postShownCount || 0
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/admin/staffs/index.scss">
</style>
