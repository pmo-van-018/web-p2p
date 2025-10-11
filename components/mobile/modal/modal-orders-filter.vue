<template>
  <b-modal
    :id="MODAL.ORDERS_FILTER"
    modal-class="modal-custom"
    centered
    hide-header
    hide-footer
    @hide="$emit('hide')"
  >
    <div class="filter-content">
      <div class="header">
        {{ $t('merchant.list_order.order_filter.filter') }}
        <span class="icon-cancel" @click="$bvModal.hide(MODAL.ORDERS_FILTER)" />
      </div>
      <div class="body">
        <div class="selector">
          <div class="label">
            {{ $t('merchant.list_order.order_filter.type') }}
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
        <div class="w-100">
          <div class="label">{{ $t("merchant.list_order.order_filter.asset_type") }}</div>
          <DropdownFilter
            :title="$t('merchant.list_order.order_filter.asset_type')"
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
        <div class="w-100 mt-4">
          <div class="label">{{ $t('placeholder.search') }}</div>
          <div>
            <div class="w-100 mt-4">
              <b-form-radio-group v-model="searchField" name="searchCustom" class="search-multiple-group">
                <radio-button value="refId">{{ $t('order_filter.trading_code') }}</radio-button>
                <radio-button value="totalPrice">{{ $t('order_filter.money') }}</radio-button>
                <radio-button value="transCode">{{ $t('order_filter.trans_code') }}</radio-button>
              </b-form-radio-group>
              <template v-if="searchField === 'totalPrice'">
                <CryptoInput
                  v-model="amountValue"
                  placeholder="Ví dụ:150,000"
                  type="tel"
                  unit="VND"
                  :min-value="null"
                  :max-value="null"
                  :required="false"
                  :allow-decimal="false"
                  :allow-leading-zeroes="false"
                />
                <div class="quick-suggest">
                  <div
                    v-for="(item, index) in AMOUNT_SUGGEST"
                    :key="`search_multiple_${index}`"
                    class="quick-suggest-item"
                    :class="{active: activeQuick(item.value)}"
                    @click="onQuickSelect(item.value)"
                  >
                    {{ item.name }}
                  </div>
                </div>
              </template>
              <template v-else>
                <search-input
                  ref="searchInput"
                  v-model="searchValue"
                  :placeholder="selectedOption?.placeholder || null"
                />
              </template>
            </div>
          </div>
        </div>
        <div v-if="isVisibleSupporterProcess" class="w-100 mt-4">
          <div class="label">{{ $t('merchant.list_order.order_filter.supporter_process') }}</div>
          <DropdownFilter
            v-if="isSupportersNotEmpty"
            :title="$t('merchant.list_order.order_filter.all')"
            :list-filter="listSupporter"
            :selected="supporterSelected"
            @on-select="onSelectSupporter"
          />
          <DropdownFilter
            v-else
            :title="$t('merchant.list_order.order_filter.all')"
            :list-filter="listSupporterEmpty"
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
    SearchInput: () => import('~/components/common/forms/search-input/index.vue'),
    BaseButton: () => import('~/components/common/base-button/index.vue'),
    RadioButton: () => import('~/components/common/forms/radio-button/index.vue')
  },
  props: {
    assetType: {
      type: Number,
      default: 0
    },
    isVisibleSupporterProcess: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      MODAL,
      ORDER_TYPE,
      LIST_POST_TYPE,
      AMOUNT_SUGGEST,
      STATUS_PENDING_ORDER,
      typeValue: '',
      orderStatusValue: 0,
      orderAssetValue: 0,
      amountValue: '',
      statusSelected: {},
      assetSelected: {},
      orderSelected: {},
      supporterSelected: {},
      searchField: 'refId',
      searchValue: '',
      searchOptions: [
        {
          icon: 'icon-encryption',
          title: this.$t('order_filter.money'),
          placeholder: this.$t('placeholder.money'),
          field: 'totalPrice'
        },
        {
          icon: 'icon-hashtag-square',
          title: this.$t('order_filter.trading_code'),
          placeholder: this.$t('placeholder.trading_code'),
          field: 'refId'
        },
        {
          icon: 'icon-bill-list',
          title: this.$t('order_filter.trans_code'),
          placeholder: this.$t('placeholder.trans_code'),
          field: 'transCode'
        }
      ]
    };
  },
  computed: {
    ...mapState('resources', ['assets']),
    ...mapState('merchant-orders', ['supporters']),
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
    listSupporter () {
      return this.supporters?.map((supporter) => {
        return {
          value: supporter.id,
          name: supporter?.nickName || this.$options.filters.formatHash(supporter.walletAddress)
        }
      })
    },
    isSupportersNotEmpty () {
      return this.supporters?.length !== 0
    },
    statusText () {
      return Number(this.orderStatusValue)
        ? this.listStatus.find(item => item.value === Number(this.orderStatusValue))?.name
        : 'form_post.label.status';
    },
    selectedOption () {
      return this.searchOptions.find(option => option.field === this.searchField)
    },
    isTotalPriceField () {
      return this.selectedOption?.field === 'totalPrice'
    },
    hasSearchFieldAndValue () {
      return ((this.searchValue !== '' || this.amountValue !== '') && this.searchField !== '')
    },
    listSupporterEmpty () {
      return [{
        name: this.$t('order_filter.empty_select'),
        value: null
      }]
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
    onSelectSupporter (supporter) {
      this.supporterSelected = supporter
    },
    onQuickSelect (value) {
      value = this.$options.filters.formatMoney(value)
      this.amountValue = value
    },
    reset () {
      this.amountValue = ''
      this.searchField = 'refId'
      this.searchValue = ''
      this.typeValue = ''
      this.statusSelected = {}
      this.assetSelected = {}

      this.orderAssetValue = 0
      this.orderStatusValue = STATUS_PENDING_ORDER
      this.supporterSelected = {}
    },
    submit () {
      const amountFormatter = this.$options.filters.formatMarkToNumber(this.amountValue)
      const amount = amountFormatter !== 0 ? String(amountFormatter) : ''
      this.$emit('submit', {
        amount,
        type: this.typeValue,
        orderStatus: this.orderStatusValue,
        assetType: this.orderAssetValue,
        supporterId: this.supporterSelected?.value,
        ...((this.hasSearchFieldAndValue) && { searchField: this.searchField }),
        ...((this.hasSearchFieldAndValue) && { searchValue: this.isTotalPriceField ? amount : this.searchValue })
      })
      this.$bvModal.hide(MODAL.ORDERS_FILTER)
    }
  }
};
</script>
  <style scoped lang="scss" src="static/assets/scss/components/mobile/modal/modal-orders-filter.scss"></style>
