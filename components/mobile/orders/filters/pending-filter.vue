<template>
  <div class="pending-filter">
    <div class="pending-filter__container">
      <div class="pending-filter__left">
        <div class="pending-filter__content">
          <filter-menu :active="activeFilterOptions">
            <filter-menu-item
              :ref="refName.amountType"
              :active="Number(amount) !== 0"
              :value-active="titleAmountFilter"
              :title="$t('order_filter.money')"
            >
              <form-content>
                <template>
                  <filter-order-amount v-model="amountValue" />
                </template>
                <template #action>
                  <base-button
                    variants="outlined"
                    @click="onResetFilterOptions(refName.amountType)"
                  >
                    {{ $t('order_filter.reset') }}
                  </base-button>
                  <base-button
                    variants="contained"
                    color="primary"
                    @click="onSubmitFilterOptions(refName.amountType)"
                  >
                    {{ $t('order_filter.confirm') }}
                  </base-button>
                </template>
              </form-content>
            </filter-menu-item>
            <filter-menu-item
              :ref="refName.transCodeType"
              :active="!!transCode"
              :value-active="titleTransCodeFilter"
              :title="$t('order_filter.transfer_code')"
            >
              <form-content>
                <template>
                  <div class="trans-code-form">
                    <crypto-input
                      v-model="transCodeValue"
                      class="trans-code-form__input"
                      :placeholder="$t('merchant.list_order.order_filter.placeholder_transcode')"
                      type="text"
                      :min-value="null"
                      :max-value="null"
                      :required="false"
                      :allow-decimal="false"
                      :allow-leading-zeroes="false"
                    />
                  </div>
                </template>
                <template #action>
                  <base-button
                    variants="outlined"
                    @click="onResetFilterOptions(refName.transCodeType)"
                  >
                    {{ $t('merchant.list_order.order_filter.reset') }}
                  </base-button>
                  <base-button
                    variants="contained"
                    color="primary"
                    @click="onSubmitFilterOptions(refName.transCodeType)"
                  >
                    {{ $t('merchant.list_order.order_filter.confirm') }}
                  </base-button>
                </template>
              </form-content>
            </filter-menu-item>
          </filter-menu>
        </div>
      </div>
      <div class="pending-filter__right">
        <div
          :class="['pending-filter__process', { 'pending-filter__process--active': isActiveFilter }]"
          @click="onOpenModalFilter"
        >
          <div class="pending-filter__process-text">{{ $t('order_filter.filter') }}</div>
          <span class="icon-filter" />
        </div>
      </div>
    </div>
    <client-only>
      <modal-orders-filter
        :is-visible-supporter-process="isVisibleSupporterProcess"
        @submit="onFilterOptions"
      />
    </client-only>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import { MODAL } from '@/resources/modal'

export default {
  components: {
    FilterMenu: () => import('~/components/mobile/commons/libs/filter-menu/index.vue'),
    FilterMenuItem: () => import('~/components/mobile/commons/libs/filter-menu-item/index.vue'),
    FormContent: () => import('~/components/common/forms/form-content/index.vue'),
    ModalOrdersFilter: () => import('~/components/mobile/modal/modal-orders-filter.vue'),
    FilterOrderAmount: () => import('~/components/mobile/commons/filters/order-amount/index.vue'),
    CryptoInput: () => import('~/components/common/home/crypto-input.vue'),
    BaseButton: () => import('~/components/common/base-button/index.vue')
  },
  props: {
    isActiveCalendar: {
      type: Boolean,
      default: false
    },
    isVisibleSupporterProcess: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      amountValue: '',
      transCodeValue: '',
      refName: {
        amountType: 'amountType',
        transCodeType: 'transCodeType'
      }
    }
  },
  computed: {
    ...mapState('filter-order', ['amount', 'transCode', 'postType', 'assetType', 'orderField', 'orderDirection', 'orderStatus', 'supporterId']),
    titleAmountFilter () {
      return Number(this.amount) !== 0 ? this.amount : this.$t('order_filter.money')
    },
    titleTransCodeFilter () {
      return this.transCode ? this.transCode : this.$t('order_filter.transfer_code')
    },
    activeFilterOptions () {
      return `${this.amount}_${this.transCode}`
    },
    isActiveFilter () {
      return Number(this.$options.filters.formatMoney(this.amount)) !== 0 || !!this.transCode || !!this.postType || !!this.assetType
    }
  },
  beforeDestroy () {
    this.resetFilter()
  },
  methods: {
    ...mapActions('filter-order', ['updateMultiFilter', 'resetFilter']),
    onSubmitFilterOptions (ref) {
      this.updateMultiFilter({
        amount: this.amountValue,
        transCode: this.transCodeValue
      })
      this.$refs[ref]?.toggle(false)
      const amountFormatter = this.$options.filters.formatMarkToNumber(this.amountValue)
      this.$emit('on-filters', {
        amount: amountFormatter !== 0 ? String(amountFormatter) : '',
        transCode: this.transCode,
        type: this.postType,
        assetType: this.assetType,
        orderField: this.orderField,
        orderStatus: this.orderStatus,
        orderDirection: this.orderDirection,
        supporterId: this.supporterId
      })
    },
    onOpenModalFilter () {
      this.$bvModal.show(MODAL.ORDERS_FILTER)
    },
    onFilterOptions (options) {
      const { type, assetType, amount, transCode, orderDirection, orderField, orderStatus, supporterId } = options
      this.amountValue = amount
      this.transCodeValue = transCode
      this.updateMultiFilter({
        amount: this.$options.filters.formatMoney(amount),
        transCode: this.transCodeValue,
        postType: type,
        assetType,
        orderDirection,
        orderField,
        orderStatus,
        supporterId
      })
      const amountFormatter = this.$options.filters.formatMarkToNumber(this.amountValue)
      this.$emit('on-filters', {
        ...options,
        amount: amountFormatter !== 0 ? String(amountFormatter) : ''
      })
    },
    onResetFilterOptions (ref) {
      if (ref === this.refName.amountType) {
        this.amountValue = ''
      }
      if (ref === this.refName.transCodeType) {
        this.transCodeValue = ''
      }
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/mobile/orders/filters/pending-filter.scss">
</style>
