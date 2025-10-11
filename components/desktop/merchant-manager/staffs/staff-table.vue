<template>
  <div class="role-management-table">
    <base-table
      :fields="fields"
      :items="items"
      :is-loading="isLoading"
      :disabled="disabled"
      :tbody-tr-class="onDisabledRowStaff"
      @change-sort="$emit('change-sort', $event)"
      @row-clicked="$emit('row-clicked', $event)"
    >
      <template #cell(walletAddress)="{ item }">
        <div class="role-management-item wallet-address flex-row">
          <span class="wallet-address__name" :class="disabledCellItem(item)">
            {{ item?.walletAddress }}
          </span>

          <copy-button
            :id="`wallet-address-copy-${item?.id}`"
            :value="item?.walletAddress"
            :text-guide="$t('role_management.label.copy_wallet_address')"
          />
        </div>
        <div v-if="isOperator(item)" class="view-balance" @click="onOpenViewBalanceStaff(item)">
          <svg>
            <use xlink:href="#balance" />
          </svg>
          <span class="view-balance__text">{{ $t('role_management.view_balance') }}</span>
        </div>
      </template>

      <template #cell(nickName)="{ item }">
        <div :class="['role-management-item', disabledCellItem(item), { 'underline': hasPublicView(item) }]" @click="goToDashBoard(item)">
          {{ item?.nickName }}
        </div>
      </template>

      <template #cell(postShownCount)="{ item }">
        <div class="role-management-item" :class="disabledCellItem(item)">
          {{ getPostShownCount(item) }}
        </div>
      </template>

      <template #cell(orderWaitingCount)="{ item }">
        <div class="role-management-item d-flex" :class="disabledCellWaitingOrder(item)">
          <template v-if="item.status === USER_STATUS.ACTIVE && !item.deletedAt">
            {{ getTotalWaitingOrderCount(item) }}
          </template>
          <template v-else>
            <order-waiting-count
              v-if="hasWaitingOrAppealCountOrder(item?.statistic)"
              :order-count="getTotalWaitingOrderCount(item)"
              @click="$router.push(`/merchant-manager/staffs/${item.id}/orders`)"
            />
            <span v-else>{{ emptyOrder(item) }}</span>
          </template>
        </div>
      </template>

      <template #cell(orderAppealCount)="{ item }">
        <div v-if="item?.statistic?.orderAppealCount" class="d-flex">
          <div
            class="total-appeal"
            @click="$router.push(`/merchant-manager/staffs/${item.id}/appeal-orders`)"
          >
            <img class="icon-appeal" src="/assets/images/common/operation/appeal.svg" alt="appeal icon">
            <span class="count-appeal">{{ item?.statistic?.orderAppealCount || 0 }}</span>
          </div>
        </div>
        <div v-else class="role-management-item">
          {{ emptyOrder(item) }}
        </div>
      </template>

      <template #cell(type)="{ item }">
        <div class="role-management-item text-center" :class="disabledCellItem(item)">
          {{ roleName(item) }}
        </div>
      </template>

      <template #cell(status)="{ item }">
        <div class="role-management-item" :class="disabledCellItem(item)">
          <div class="active-status-wrapper sub-text" :class="getClassStatus(item)">
            {{ getLabelStatus(item) }}
          </div>
        </div>
      </template>

      <template #cell(updateAt)="{ item }" :class="disabledCellItem(item)">
        <div class="role-management-item">
          <div class="sub-text">
            <div>{{ item?.createdAt | formatDateTime }}</div>
            <div>{{ item?.updatedAt | formatDateTime }}</div>
          </div>
        </div>
      </template>

      <template #cell(actions)="{ item }">
        <div v-if="!item?.deletedAt" class="role-management-item actions actions--end">
          <span
            :id="'merchant-manager-icon-edit' + item?.id"
            class="icon-edit"
            @click="handleEdit(item)"
          />
          <b-tooltip :target="'merchant-manager-icon-edit' + item?.id" triggers="hover" placement="top">
            {{ $t('role_management.item.edit') }}
          </b-tooltip>
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

    <ModalEdit
      :staff="currentStaff"
      @on-reset="handleResetFilter"
      @on-close="handleCloseModalEdit"
    />
    <modal-view-balance-staff :staff="selectedStaff" />
  </div>
</template>

<script>
import roleManagementMixin from '@/mixins/role-management';
import { DATE_TIME_FORMAT, USER_STATUS, USER_ROLE } from '@/config/constant';
import { TABLE_FIELDS } from '@/resources/role-management';

export default {
  components: {
    BaseTable: () => import('~/components/desktop/commons/tables/index.vue'),
    PaginationLimit: () => import('~/components/desktop/commons/pagination-limit/index.vue'),
    CopyButton: () => import('~/components/common/copy-button.vue'),
    ModalEdit: () => import('~/components/common/staffs/modal-edit.vue'),
    OrderWaitingCount: () => import('~/components/desktop/orders/order-waiting-count/index.vue'),
    ModalViewBalanceStaff: () => import('~/components/desktop/modal/modal-view-balance-staff.vue')
  },
  mixins: [roleManagementMixin],
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
    },
    enablePublicView: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      DATE_TIME_FORMAT,
      fields: this.$_roleManagementMixin_getTableFields(TABLE_FIELDS.MERCHANT_MANAGER_STAFF),
      currentStaff: null,
      USER_STATUS
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
      if (!staff.deletedAt) {
        this.currentStaff = staff;
        this.$emit('on-edit', staff);
      }
    },
    handleCloseModalEdit () {
      this.currentStaff = null;
    },
    getClassStatus (item) {
      return this.$_roleManagementMixin_getClassStatus(item);
    },
    getLabelStatus (item) {
      return this.$_roleManagementMixin_getLabelStatus(item);
    },
    onDisabledRowStaff (item, type) {
      if (item?.deletedAt) {
        this.$set(item, '_rowVariant', 'not-hover')
      }
    },
    onOpenViewBalanceStaff (staff) {
      this.$bvModal.show('modalShowBalanceStaff')
      this.selectedStaff = staff
    },
    hasWaitingOrAppealCountOrder (statistic) {
      return statistic.orderAppealCount > 0 || statistic.orderWaitingCount > 0 || statistic.orderWaitingUserCount > 0
    },
    getTotalWaitingOrderCount (item) {
      if (this.isOperator(item)) {
        return item?.statistic.orderWaitingCount + item?.statistic.orderWaitingUserCount
      }
      return '-'
    },
    emptyOrder (item) {
      if (this.isOperator(item)) {
        return 0
      }
      return '-'
    },
    getPostShownCount (item) {
      if (this.isOperator(item)) {
        return item?.statistic?.postShownCount || 0
      }
      return '-'
    },
    disabledCellItem (item) {
      if (item?.deletedAt) {
        return 'disabled'
      }
    },
    disabledCellWaitingOrder (item) {
      if (item?.deletedAt && !this.hasWaitingOrAppealCountOrder(item.statistic)) {
        return 'disabled'
      }
    },
    roleName (item) {
      return this.$_roleManagementMixin_getLabelType(item);
    },
    isOperator (item) {
      return item?.type === USER_ROLE.MERCHANT_OPERATOR
    },
    hasPublicView (item) {
      return this.isOperator(item) && this.enablePublicView
    },
    goToDashBoard (item) {
      if (this.hasPublicView(item)) {
        this.$router.push(`/merchant-manager/staffs/dashboard/${item?.id}`)
      }
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/role-management/table.scss" />
