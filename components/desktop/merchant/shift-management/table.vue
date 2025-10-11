<template>
  <div class="shift-management-table">
    <base-table
      :fields="fields"
      :items="items"
      :is-loading="isLoading"
      :disabled="disabled"
      @change-sort="$emit('change-sort', $event)"
      @row-clicked="$emit('row-clicked', $event)"
    >
      <template #cell(startTime)="{ item }">
        <div class="shift-management-table__time-submit">
          <div class="badget-wrapper checkin">
            <span class="badget-wrapper__icon icon-checkin" />
          </div>
          <span>
            {{ item?.checkInAt | formatDateTime }}
          </span>
        </div>
      </template>

      <template #cell(startBalanceAmount)="{ item }">
        <template v-if="item.openingBalance">
          <asset-amount :id="`start-balance-${item.id}`" :asset-amounts="item.openingBalance" @on-show-balance="handleShowBalance(item, 'checkin')" />
        </template>
        <template v-else>--</template>
      </template>

      <template #cell(endTime)="{ item }">
        <div v-if="item?.checkOutAt" class="shift-management-table__time-submit">
          <div class="badget-wrapper checkout">
            <span class="badget-wrapper__icon icon-checkout" />
          </div>
          <span>
            {{ item?.checkOutAt | formatDateTime }}
          </span>
        </div>
        <template v-else>--</template>
      </template>

      <template #cell(endBalanceAmount)="{ item }">
        <template v-if="item.closingBalance">
          <asset-amount :id="`end-balance-${item.id}`" :asset-amounts="item.closingBalance" @on-show-balance="handleShowBalance(item, 'checkout')" />
        </template>
        <template v-else>--</template>
      </template>

      <template #cell(orderAmount)="{ item }">
        <div v-if="item.orderAmount" class="amount-item">
          {{ item.orderAmount | formatMoney }}<span class="ml-1">{{ $t('home.unit-vnd') }}</span>
        </div>
        <template v-else>--</template>
      </template>

      <template #cell(workingDate)="{ item }">
        <div v-if="item?.checkOutAt" class="shift-management-table__name">
          {{ getDiffWorkingDate(item) }}
        </div>
        <template v-else>--</template>
      </template>

      <template #cell(status)="{ item }">
        <div class="d-flex justify-content-center">
          <div class="status-item" :class="getStatusClass(item)">
            {{ getStatusText(item) }}
          </div>
        </div>
      </template>
    </base-table>

    <div v-if="total > 0" class="shift-management-table__pagination">
      <pagination-limit
        :page="page"
        :limit="limit"
        :total="total"
        :note="$t('role_management.pagination')"
        @set-limit="handleChangeLimit"
        @set-page="handleChangePagination"
      />
    </div>
    <modal-shift-management-balance
      :type="type"
      :wallet-address="walletAddress"
      :check-in-at="checkInAt"
      :check-out-at="checkOutAt"
      :nick-name="nickName"
      :balance-wallet-address="balanceWalletAddress"
      @close="handleCloseModalBalance"
    />
  </div>
</template>

<script>
import { SHIFT_STATUS } from '@/constants/shift';
import { mapState } from 'vuex';
import shiftBalanceMixin from '~/mixins/merchant/shift-balance';
export default {
  components: {
    ModalShiftManagementBalance: () => import('~/components/desktop/merchant/shift-management/modal-shift-balance.vue'),
    BaseTable: () => import('~/components/desktop/commons/tables/index.vue'),
    PaginationLimit: () => import('~/components/desktop/commons/pagination-limit/index.vue'),
    AssetAmount: () => import('~/components/desktop/shift/asset-amount.vue')
  },
  mixins: [shiftBalanceMixin],
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
      fields: [
        {
          key: 'startTime',
          label: this.$t('shift_management.table.check_in_date'),
          subLabel: '',
          sortField: 'checkIn',
          isSort: true,
          thStyle: {
            width: '12%'
          }
        },
        {
          key: 'startBalanceAmount',
          label: this.$t('shift_management.table.check_in_amount'),
          subLabel: '',
          sortField: '',
          isSort: false,
          thStyle: {
            width: '15%'
          }
        },
        {
          key: 'endTime',
          label: this.$t('shift_management.table.check_out_date'),
          subLabel: '',
          sortField: 'checkOut',
          isSort: true,
          thStyle: {
            width: '12%'
          }
        },
        {
          key: 'endBalanceAmount',
          label: this.$t('shift_management.table.check_out_amount'),
          subLabel: '',
          sortField: '',
          isSort: false,
          thStyle: {
            width: '15%'
          }
        },
        {
          key: 'orderAmount',
          label: this.$t('shift_management.table.amount'),
          subLabel: '',
          sortField: 'orderAmount',
          isSort: true,
          thStyle: {
            width: '11%'
          }
        },
        {
          key: 'workingDate',
          label: this.$t('shift_management.table.working_date'),
          subLabel: '',
          sortField: 'duringTime',
          isSort: true,
          thStyle: {
            width: '10%'
          }
        },
        {
          key: 'status',
          label: this.$t('shift_management.table.status'),
          subLabel: '',
          sortField: '',
          isSort: false,
          align: 'center',
          thStyle: {
            width: '10%'
          }
        }
      ]
    };
  },
  computed: {
    ...mapState('user', ['user']),
    nickName () {
      return this.user?.nickName || ''
    },
    walletAddress () {
      return this.user?.walletAddress || ''
    },
    disabled () {
      return !this.items?.length;
    }
  },
  methods: {
    getStatusText (item) {
      switch (item.status) {
        case SHIFT_STATUS.APPROVED:
          return this.$t('shift_management.status.approved')
        case SHIFT_STATUS.FINISHED:
          return this.$t('shift_management.status.processing')
        default:
          return '--'
      }
    },
    getStatusClass (item) {
      switch (item.status) {
        case SHIFT_STATUS.APPROVED:
          return 'approved'
        case SHIFT_STATUS.FINISHED:
          return 'processing'
        default:
          return ''
      }
    },
    handleChangePagination (page) {
      this.$emit('change-pagination', {
        page,
        limit: this.limit
      })
    },
    handleChangeLimit (limit) {
      this.$emit('change-pagination', {
        page: 1,
        limit
      })
    },
    async handleResetFilter () {
      await this.$emit('on-reset');
    },
    handleEdit (merchantManager) {
      this.currentMerchantManager = merchantManager;
      this.$emit('on-edit', merchantManager);
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/merchant/shift-management/table.scss" />
