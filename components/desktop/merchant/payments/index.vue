<template>
  <div class="payments">
    <div class="payments__header grey-900 p-4">
      <div class="title" :class="{'container': !isFullWidth}">
        {{ $t('merchant.payments.label.payment') }}
      </div>
    </div>
    <div class="payments__content p-4" :class="{'container': !isFullWidth}">
      <client-only>
        <template #placeholder>
          <filter-loader-skeleton class="delay-animation my-2" />
          <b-skeleton-table
            class="delay-animation"
            :rows="7"
            :columns="4"
            :table-props="{ bordered: false, striped: false }"
          />
        </template>
        <div class="tool-bar">
          <div class="note font-t14r grey-600">
            <span>{{ $t('merchant.payments.note') }}</span>
          </div>
          <base-button variants="outlined" color="primary" @click="showModalAddBank">
            <div class="d-flex align-items-center">
              <span class="icon-add-primary" />
              {{ $t('merchant.payments.label.add_payment_method') }}
            </div>
          </base-button>
        </div>
        <p class="payments__title font-t14b grey-800 mb-0">{{ $t('merchant.payments.label.transfer') }}</p>
        <PaymentsTable />
        <ModalAddBank />
      </client-only>
    </div>
  </div>
</template>

<script>
import { MODAL } from '@/resources/modal.js';
import { mapActions } from 'vuex';
import PaymentsTable from './payments-table.vue';

export default {
  components: {
    PaymentsTable,
    ModalAddBank: () => import('@/components/common/modal/modal-add-bank.vue'),
    BaseButton: () => import('~/components/common/base-button/index.vue'),
    FilterLoaderSkeleton: () => import('~/components/desktop/commons/loader/filters.vue')
  },
  props: {
    isFullWidth: {
      type: Boolean,
      default: true
    }
  },
  mounted () {
    this.getSupportBanks()
    this.setPaymentDetail({})
  },
  methods: {
    ...mapActions('payments', ['getSupportBanks', 'setPaymentDetail']),
    showModalAddBank () {
      this.$bvModal.show(MODAL.ADD_BANK)
    }
  }
};
</script>

<style lang="scss" scoped src="static/assets/scss/components/desktop/merchant/payments/index.scss" />
