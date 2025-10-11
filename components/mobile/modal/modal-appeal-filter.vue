<template>
  <b-modal
    :id="MODAL.APPEAL_FILTER"
    modal-class="modal-custom"
    centered
    hide-header
    hide-footer
    @hide="$emit('hide')"
    @show="onShow"
  >
    <div class="filter-content">
      <div class="header">
        {{ $t('order_filter.filter') }}
        <span class="icon-cancel" @click="$bvModal.hide(MODAL.APPEAL_FILTER)" />
      </div>
      <div class="body">
        <div class="selector">
          <div class="label">
            {{ $t('order_filter.type') }}
          </div>
          <div class="selector__radio-group">
            <div
              v-for="(item, index) in LIST_POST_TYPE"
              :key="index"
              :class="{ active: typeValue === item.value }"
              class="radio-button"
              @click="onSelectType(item.value)"
            >
              <span class="radio-button__icon" />
              <div class="radio-button__name">{{ $t(item.name) }}</div>
            </div>
          </div>
        </div>
        <div class="w-100 mb-4">
          <div class="label">{{ $t("order_filter.asset_type") }}</div>
          <DropdownFilter
            :title="$t('order_filter.asset_type')"
            :list-filter="listAsset"
            :selected="assetSelected"
            @on-select="onSelectAsset"
          />
          <div class="label mt-4">{{ $t("form_post.label.status") }}</div>
          <DropdownFilter
            :title="$t('form_post.label.status')"
            :list-filter="listStatus"
            :selected="statusSelected"
            @on-select="onSelectStatus"
          />
        </div>
        <div>
          <calendar-custom
            :is-show-note="false"
            :date-range="dateRange"
            :label="label"
            @on-confirm="onConfirmDatePicker"
            @on-close="onCloseDatePicker"
          />
        </div>
      </div>
      <div class="footer">
        <base-button
          :disabled="false"
          variants="outlined"
          @click="reset"
        >
          {{ $t('action.delete_filter') }}
        </base-button>
        <base-button variants="contained" color="primary" @click="submit">{{ $t('action.confirm') }}</base-button>
      </div>
    </div>
  </b-modal>
</template>
<script>
import { MODAL } from '@/resources/modal.js';
import CryptoInput from '@/components/common/home/crypto-input.vue';
import { ORDER_TYPE } from '@/resources/order-type.js';
import {
  LIST_POST_TYPE,
  LIST_SORT,
  AMOUNT_SUGGEST,
  STATUS_PENDING_ORDER
} from '@/resources/merchant/orders-filter.js';
import { mapActions, mapState } from 'vuex'
import { LIST_PENDING_STATUS } from '@/resources/order-filters'
import DropdownFilter from '~/components/desktop/commons/dropdown-filter/index.vue';

export default {
  components: {
    CryptoInput,
    DropdownFilter,
    BaseButton: () => import('~/components/common/base-button/index.vue')
  },
  props: {
    assetType: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      MODAL,
      LIST_SORT,
      ORDER_TYPE,
      LIST_POST_TYPE,
      AMOUNT_SUGGEST,
      STATUS_PENDING_ORDER,
      typeValue: '',
      orderStatusValue: 0,
      orderAssetValue: 0,
      amountValue: '',
      transferCodeValue: '',
      orderDirectionValue: LIST_SORT[0].value,
      statusSelected: {},
      assetSelected: {},
      orderSelected: {}
    };
  },
  computed: {
    ...mapState('filter-order', ['amount', 'transCode', 'postType', 'orderDirection', 'orderStatus']),
    ...mapState('resources', ['assets']),
    listAsset () {
      return this.assets.map(asset => ({
        ...asset,
        value: asset.id,
        name: `${asset.name} (${asset.network})`
      }))
    },
    listStatus () {
      return LIST_PENDING_STATUS
    },
    statusText () {
      return Number(this.orderStatusValue)
        ? this.listStatus.find(item => item.value === Number(this.orderStatusValue))?.name
        : 'form_post.label.status';
    },
    sortText () {
      return LIST_SORT.find(item => item.value === this.orderDirectionValue)?.name
    }
  },
  methods: {
    ...mapActions('resources', ['getResources']),
    activeQuick (value) {
      value = this.$options.filters.formatMoney(value)
      return this.amountValue === value
    },
    onSelectType (value) {
      this.orderStatusValue = STATUS_PENDING_ORDER;
      this.typeValue = value;
    },
    onSelectStatus (status) {
      this.orderStatusValue = status.value;
      this.statusSelected = status;
    },
    onSelectAsset (assetType) {
      this.assetSelected = assetType
      this.orderAssetValue = assetType.value
    },
    onSelectOrder (orderType) {
      this.orderSelected = orderType
      this.orderDirectionValue = orderType.value
    },
    onQuickSelect (value) {
      value = this.$options.filters.formatMoney(value)
      this.amountValue = value
    },
    onShow () {
      this.amountValue = Number(this.amount) !== 0 ? this.$options.filters.formatMoney(this.amount) : ''
      this.transferCodeValue = this.transCode
      this.orderAssetValue = this.assetType
      this.orderDirectionValue = this.orderDirection
      this.typeValue = this.postType
      this.orderStatusValue = this.orderStatus
    },
    reset () {
      this.amountValue = ''
      this.transferCodeValue = ''
      this.orderDirectionValue = LIST_SORT[0].value
      this.typeValue = ''
      this.statusSelected = {}
      this.assetSelected = {}
      this.orderSelected = {}
      this.orderAssetValue = 0
      this.orderStatusValue = STATUS_PENDING_ORDER
    },
    submit () {
      const amountFormatter = this.$options.filters.formatMarkToNumber(this.amountValue)
      const amount = amountFormatter !== 0 ? String(amountFormatter) : ''
      this.$emit('submit', {
        amount,
        transCode: this.transferCodeValue,
        orderDirection: this.orderDirectionValue,
        orderField: 'id',
        type: this.typeValue,
        orderStatus: this.orderStatusValue,
        assetType: this.orderAssetValue
      })
      this.$bvModal.hide(MODAL.ORDERS_FILTER)
    }
  }
};
</script>
<style scoped lang="scss" src="static/assets/scss/components/mobile/modal/modal-orders-filter.scss"></style>
