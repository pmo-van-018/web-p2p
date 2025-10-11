<template>
  <b-modal
    :id="MODAL.ORDERS_FILTER_TOP"
    modal-class="modal-custom"
    centered
    hide-header
    hide-footer
    @hide="$emit('hide')"
    @show="onShowTopFilter"
  >
    <div class="filter-content">
      <template v-if="filterSelected===TOP_FILTER.MONEY.id">
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
            :key="index"
            class="quick-suggest-item"
            :class="{active: activeQuick(item.value)}"
            @click="onQuickSelect(item.value)"
          >
            {{ item.name }}
          </div>
        </div>
      </template>
      <template v-else>
        <CryptoInput
          v-model="transferCodeValue"
          :placeholder="$t('order_filter.placeholder_transcode')"
          type="text"
          :min-value="null"
          :max-value="null"
          :required="false"
          :allow-decimal="false"
          :allow-leading-zeroes="false"
        />
      </template>
      <div class="footer">
        <base-button variants="outlined" color="grey" @click="reset">
          {{ $t('merchant.list_order.order_filter.reset') }}
        </base-button>
        <base-button variants="contained" color="primary" @click="confirm">
          {{ $t('merchant.list_order.order_filter.confirm') }}
        </base-button>
      </div>
    </div>
  </b-modal>
</template>
<script>
import { MODAL } from '@/resources/modal.js';
import CryptoInput from '@/components/common/home/crypto-input.vue'
import {
  AMOUNT_SUGGEST,
  TOP_FILTER
} from '@/resources/merchant/orders-filter.js';
export default {
  components: {
    CryptoInput,
    BaseButton: () => import('~/components/common/base-button/index.vue')
  },
  props: {
    filterSelected: {
      type: String,
      default: TOP_FILTER.MONEY.id
    },
    transferCode: {
      type: String,
      default: ''
    },
    amount: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      AMOUNT_SUGGEST,
      MODAL,
      TOP_FILTER,
      amountValue: '',
      transferCodeValue: ''
    };
  },
  methods: {
    onQuickSelect (value) {
      value = this.$options.filters.formatMoney(value)
      this.amountValue = value
    },
    activeQuick (value) {
      value = this.$options.filters.formatMoney(value)
      return this.amountValue === value
    },
    reset () {
      if (this.filterSelected === 'MONEY') {
        this.amountValue = ''
      } else {
        this.transferCodeValue = ''
      }
    },
    confirm () {
      if (this.filterSelected === 'MONEY') {
        this.$emit('confirm-amount', this.$options.filters.formatMarkToNumber(this.amountValue))
      } else {
        this.$emit('confirm-transfercode', this.transferCodeValue)
      }
      this.$bvModal.hide(MODAL.ORDERS_FILTER_TOP)
    },
    onShowTopFilter () {
      this.amountValue = this.amount ? this.$options.filters.formatMoney(this.amount) : ''
      this.transferCodeValue = this.transferCode
    }
  }
};
</script>
<style scoped lang="scss" src="static/assets/scss/components/mobile/modal/modal-orders-filter-top.scss"></style>
