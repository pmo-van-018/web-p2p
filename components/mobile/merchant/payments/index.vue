<template>
  <div class="payments">
    <client-only>
      <template #placeholder>
        <div class="my-2 mx-2">
          <order-filter-skeleton-loader class="my-2" />
          <order-card-skeleton-loader v-for="key in DEFAULT_LOADER" :key="key" />
        </div>
      </template>
      <div class="payments__btn d-flex justify-content-between align-items-center">
        <span class="grey-900 font-t16b">{{ $t('merchant.payments.label.add_payment_mobile') }}</span>
        <base-button variants="text" color="primary" @click="showModalAddBank">
          <span class="icon-add-primary" />
        </base-button>
      </div>
      <div class="payments__content">
        <div class="payments__note font-t14r grey-600">
          <span>{{ $t('merchant.payments.note') }}</span>
        </div>
        <p class="payments__title font-t14b grey-800 mb-0">{{ $t('merchant.payments.label.transfer') }}</p>
        <PaymentsTable />
        <ModalAddBank :is-merchant="true" />
      </div>
    </client-only>
  </div>
</template>

<script>
import { MODAL } from '@/resources/modal.js';
import { mapState, mapActions } from 'vuex';
import PaymentsTable from './payments-table.vue';

export default {
  components: {
    PaymentsTable,
    ModalAddBank: () => import('@/components/mobile/modal/modal-add-bank.vue'),
    OrderCardSkeletonLoader: () => import('~/components/mobile/commons/loader/order/index.vue'),
    OrderFilterSkeletonLoader: () => import('~/components/mobile/commons/loader/filters/index.vue'),
    BaseButton: () => import('~/components/common/base-button/index.vue')
  },
  data () {
    return {
      DEFAULT_LOADER: 5
    }
  },
  computed: {
    ...mapState('payments', ['payments'])
  },
  mounted () {
    this.getListPayment()
    this.getSupportBanks()
    this.setPaymentDetail({})
  },
  methods: {
    ...mapActions('payments', ['getSupportBanks', 'getListPayment', 'setPaymentDetail']),
    showModalAddBank () {
      this.$bvModal.show(MODAL.ADD_BANK)
    }
  }
};
</script>

<style lang="scss" scoped src="static/assets/scss/components/mobile/merchant/payments/index.scss" />
