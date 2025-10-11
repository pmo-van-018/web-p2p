<template>
  <div class="order-filter">
    <div class="order-filter__container">
      <div class="order-filter__right">
        <div
          :class="['order-filter__process', { 'order-filter__process--active': isActiveFilter }]"
          @click="onOpenModalFilter"
        >
          <div class="order-filter__process-text">{{ $t('order_filter.filter') }}</div>
          <span class="icon-filter" />
        </div>
      </div>
    </div>
    <client-only>
      <modal-orders-filter
        :is-visible-supporter-process="isVisibleSupporterProcess"
        @submit="onFilterOptions"
        @on-selected-field="searchField = $event"
      />
    </client-only>
  </div>
</template>
<script>
import { MODAL } from '@/resources/modal'
import { STATUS_PENDING_ORDER } from '@/resources/order-filters'

export default {
  components: {
    ModalOrdersFilter: () => import('~/components/mobile/modal/modal-orders-filter.vue')
  },
  props: {
    isVisibleSupporterProcess: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      searchField: 'refId',
      isActiveFilter: false
    }
  },
  methods: {
    onOpenModalFilter () {
      this.$bvModal.show(MODAL.ORDERS_FILTER)
    },
    onFilterOptions (options) {
      const { type, assetType, orderStatus, searchField, searchValue } = options
      this.isActiveFilter = type !== '' ||
          !!assetType ||
          !!searchField ||
          !!searchValue ||
          orderStatus !== STATUS_PENDING_ORDER
      this.$emit('on-filters', options)
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/mobile/orders/filters/order-filter.scss">
</style>
