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
        <div :class="['role-management-item', 'underline']" @click="goToDashboard(item)">
          {{ item?.nickName }}
        </div>
      </template>

      <template #cell(numberMembers)="{ item }">
        <div class="role-management-item">
          {{ item?.registeredMembers }}
        </div>
      </template>

      <template #cell(contract)="{ item }">
        <div class="role-management-item">
          <div class="sub-text">
            <div>{{ item?.contractFrom | formatDateTime(DATE_FORMAT) }}</div>
          </div>
        </div>
      </template>

      <template #cell(completedTime)="{ item }">
        <div class="role-management-item">
          <div class="d-flex align-items-center flex-wrap">
            <span class="role-management-item__text role-management-item__text--grey"> {{ $t('role_management.successful') }}:</span>
            <span class="role-management-item__text ml-1">{{ item?.averageCompletedTime | formatSecondsToDate }}</span>
          </div>
          <div class="d-flex align-items-center flex-wrap">
            <span class="role-management-item__text role-management-item__text--grey"> {{ $t('role_management.failed') }}:</span>
            <span class="role-management-item__text ml-1">{{ item?.averageCancelledTime | formatSecondsToDate }}</span>
          </div>
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

      <template #cell(staff)="{ item }">
        <div class="role-management-item actions">
          <span class="staff-list" @click="handleClickListStaffs(item)">
            {{ $t('merchant_managers.view') }}
          </span>
        </div>
      </template>

      <template #cell(gasless)="{ item }">
        <div class="role-management-item">
          <div class="active-status-wrapper" :class="getClassAllowGasless(item)">
            <div>
              {{ getLabelAllowGasless(item) }}
            </div>
          </div>
        </div>
      </template>

      <template #cell(actions)="{ item }">
        <div class="role-management-item actions">
          <span
            class="icon-edit"
            @click="goToProfile(item)"
          />
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
      :merchant-manager="currentMerchantManager"
      @on-reset="handleResetFilter"
      @on-close="handleCloseModalEdit"
    />
  </div>
</template>

<script>
import roleManagementMixin from '@/mixins/role-management';
import { DATE_FORMAT } from '@/config/constant';
import { TABLE_FIELDS } from '@/resources/role-management';

export default {
  components: {
    BaseTable: () => import('~/components/desktop/commons/tables/index.vue'),
    PaginationLimit: () => import('~/components/desktop/commons/pagination-limit/index.vue'),
    CopyButton: () => import('~/components/common/copy-button.vue'),
    ModalEdit: () => import('~/components/common/merchant-managers/modal-edit.vue')
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
    }
  },
  data () {
    return {
      DATE_FORMAT,
      fields: this.$_roleManagementMixin_getTableFields(TABLE_FIELDS.ADMIN_MERCHANT_MANAGER),
      currentMerchantManager: null
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
    handleEdit (merchantManager) {
      this.currentMerchantManager = merchantManager;
      this.$emit('on-edit', merchantManager);
    },
    handleCloseModalEdit () {
      this.currentMerchantManager = null;
    },
    getClassStatus (item) {
      return this.$_roleManagementMixin_getClassStatus(item);
    },
    getLabelStatus (item) {
      return this.$_roleManagementMixin_getLabelStatus(item);
    },
    getClassAllowGasless (item) {
      return item?.allowGasless ? 'active-status' : 'inactive-status';
    },
    getLabelAllowGasless (item) {
      return item?.allowGasless ? this.$t('role_management.used') : this.$t('role_management.unused');
    },
    handleClickListStaffs (merchantManager) {
      const id = merchantManager?.id;
      if (!id) {
        return;
      }
      this.$router.push(`/merchant-managers/${id}/staffs`);
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/role-management/table.scss" />
