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
      <template #cell(nickName)="{ item }">
        <div class="shift-management-table__name">
          <span :id="`nickname-${item.id}`" class="shift-management-table__nickname">
            {{ item?.nickName }}
          </span>
        </div>
        <b-tooltip :target="`nickname-${item.id}`" triggers="hover" custom-class="tooltip-wallet-address">
          <div class="wallet-address-content">
            <div class="wallet-address-content__name">{{ $t('role_management.label.wallet_address') }}</div>
            <div class="wallet-address-content__value">{{ item.walletAddress }}</div>
          </div>
        </b-tooltip>
      </template>
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
      </template>

      <template #cell(endBalanceAmount)="{ item }">
        <template v-if="item.closingBalance">
          <asset-amount :id="`end-balance-${item.id}`" :asset-amounts="item.closingBalance" @on-show-balance="handleShowBalance(item, 'checkout')" />
        </template>
      </template>

      <template #cell(orderAmount)="{ item }">
        <div v-if="item.orderAmount" class="amount-item">
          {{ item.orderAmount | formatMoney }}<span class="ml-1">{{ $t('home.unit-vnd') }}</span>
        </div>
      </template>

      <template #cell(workingDate)="{ item }">
        <div class="shift-management-table__name">
          {{ getDiffWorkingDate(item) }}
        </div>
      </template>

      <template #cell(action)="{ item }">
        <div class="d-flex justify-content-center">
          <base-button variants="contained" color="primary" size="small" @click="onApprovedShift(item)">
            {{ $t('action.approve') }}
          </base-button>
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
import shiftBalanceMixin from '~/mixins/merchant/shift-balance';

export default {
  components: {
    ModalShiftManagementBalance: () => import('~/components/desktop/merchant/shift-management/modal-shift-balance.vue'),
    BaseButton: () => import('~/components/common/base-button/index.vue'),
    BaseTable: () => import('~/components/desktop/commons/tables/index.vue'),
    PaginationLimit: () => import('~/components/desktop/commons/pagination-limit/index.vue'),
    AssetAmount: () => import('~/components/desktop/shift/asset-amount.vue')
  },
  mixins: [shiftBalanceMixin],
  props: {
    fields: {
      type: Array,
      default: () => []
    },
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
      selectedShift: null,
      type: 'checkin' // checkin | checkout
    }
  },
  computed: {
    disabled () {
      return !this.items?.length;
    },
    nickName () {
      return this.selectedShift?.nickName || ''
    },
    walletAddress () {
      return this.selectedShift?.walletAddress || ''
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
    },
    onApprovedShift (item) {
      this.$emit('on-approve-shift', { shift: item, type: 'single' });
    }
  }
}
</script>
<style lang="scss">
.tooltip-wallet-address {
  .tooltip-inner {
    min-width: 328px;
    padding: 12px;
  }
}
.wallet-address {
  display: flex;
  gap: 4px;
  flex-direction: column;
  align-items: flex-start;
  color: #F3F4F7;
  &__name {
    @include font-t12m;
  }
  &__value {
    @include font-t12r;
  }
}
</style>
<style lang="scss" scoped src="static/assets/scss/components/desktop/merchant/shift-management/table.scss" />
