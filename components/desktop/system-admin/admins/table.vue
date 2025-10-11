<template>
  <div class="role-management-table">
    <base-table
      :fields="fields"
      :items="items"
      :is-loading="isLoading"
      :disabled="disabled"
      :tbody-tr-class="onDisabledRow"
      @change-sort="$emit('change-sort', $event)"
      @row-clicked="$emit('row-clicked', $event)"
    >
      <template #cell(nickName)="{ item }">
        <div class="d-flex flex-column">
          <div :class="['role-management-item', disabledCellItem(item)]">
            <span class="role-management-item__text role-management-item__text--medium">{{ item?.nickName }}</span>
          </div>
          <div :class="['role-management-item wallet-address flex-row', disabledCellItem(item)]">
            <span class="role-management-item__text" :class="disabledCellItem(item)">
              {{ item?.walletAddress }}
            </span>
            <copy-button
              :id="`wallet-address-copy-${item?.id}`"
              :value="item?.walletAddress"
              :text-guide="$t('role_management.label.copy_wallet_address')"
            />
          </div>
        </div>
      </template>
      <template #cell(createdAt)="{ item }">
        <div class="role-management-item" :class="disabledCellItem(item)">
          <div class="role-management-item__text text-center">
            {{ item.createdAt | formatDateTime }}
          </div>
        </div>
      </template>
      <template #cell(updatedAt)="{ item }">
        <div class="role-management-item" :class="disabledCellItem(item)">
          <div class="role-management-item__text text-center">
            {{ item.updatedAt | formatDateTime }}
          </div>
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

      <template #cell(actions)="{ item }">
        <div v-if="!isDisabledItem(item)" class="role-management-item actions actions--end">
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
      :current-item="currentAdmin"
      @on-reset="handleResetFilter"
      @on-close="handleCloseModalEdit"
    />
  </div>
</template>

<script>
import roleManagementMixin from '@/mixins/role-management';
import { DATE_TIME_FORMAT, USER_STATUS } from '@/config/constant';
import { TABLE_FIELDS } from '@/resources/role-management';

export default {
  components: {
    BaseTable: () => import('~/components/desktop/commons/tables/index.vue'),
    PaginationLimit: () => import('~/components/desktop/commons/pagination-limit/index.vue'),
    CopyButton: () => import('~/components/common/copy-button.vue'),
    ModalEdit: () => import('~/components/desktop/system-admin/admins/modal-edit.vue')
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
      DATE_TIME_FORMAT,
      fields: this.$_roleManagementMixin_getTableFields(TABLE_FIELDS.SUPPER_ADMIN),
      currentAdmin: null,
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
    handleEdit (item) {
      if (!item.deletedAt) {
        this.currentAdmin = item;
        this.$emit('on-edit', item);
      }
    },
    handleCloseModalEdit () {
      this.currentAdmin = null;
    },
    getClassStatus (item) {
      return this.$_roleManagementMixin_getClassStatus(item);
    },
    getLabelStatus (item) {
      return this.$_roleManagementMixin_getLabelStatus(item);
    },
    isDisabledItem (item) {
      return item?.status === USER_STATUS.DELETED
    },
    onDisabledRow (item, type) {
      if (this.isDisabledItem(item)) {
        this.$set(item, '_rowVariant', 'not-hover')
      }
    },
    disabledCellItem (item) {
      if (this.isDisabledItem(item)) {
        return 'disabled'
      }
    },
    roleName (item) {
      return this.$_roleManagementMixin_getLabelType(item);
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/role-management/table.scss" />
