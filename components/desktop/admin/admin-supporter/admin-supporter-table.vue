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

      <template #cell(appealReceivedCount)="{ item }">
        <div class="role-management-item text-center">
          {{ item?.pickAppealCount || 0 }}
        </div>
      </template>

      <template #cell(pickSupportRequestCount)="{ item }">
        <div class="role-management-item text-center">
          {{ item?.pickSupportRequestCount || 0 }}
        </div>
      </template>

      <template #cell(nickName)="{ item }">
        <div class="role-management-item">
          {{ item?.nickName }}
        </div>
      </template>

      <template #cell(status)="{ item }">
        <div class="role-management-item">
          <div class="active-status-wrapper" :class="getClassStatus(item)">
            <div>
              {{ getLabelStatus(item) }}
            </div>
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

      <template #cell(actions)="{ item }">
        <div class="role-management-item actions">
          <span
            :id="'admin-supporter-icon-edit' + item?.id"
            class="icon-edit"
            @click="handleEdit(item)"
          />
          <b-tooltip :target="'admin-supporter-icon-edit' + item?.id" triggers="hover" placement="top">
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
    <modal-edit
      :admin-supporter="currentAdminSupporter"
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
    ModalEdit: () => import('~/components/desktop/admin/modal/admin-supporter/modal-edit.vue')
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
      fields: this.$_roleManagementMixin_getTableFields(TABLE_FIELDS.ADMIN_SUPPORTER),
      currentAdminSupporter: null
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
    handleEdit (adminSupporter) {
      this.currentAdminSupporter = adminSupporter;
      this.$emit('on-edit', adminSupporter);
    },
    handleCloseModalEdit () {
      this.currentAdminSupporter = null;
    },
    getClassStatus (item) {
      return this.$_roleManagementMixin_getClassStatus(item);
    },
    getLabelStatus (item) {
      return this.$_roleManagementMixin_getLabelStatus(item);
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/role-management/table.scss" />
