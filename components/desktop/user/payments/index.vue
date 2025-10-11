<template>
  <div class="payments">
    <div class="payments__header grey-900">
      <div class="title" :class="{'container': !isFullWidth}">
        {{ $t('user.payments.label.payment') }}
      </div>
    </div>
    <div class="payments__content" :class="{'container': !isFullWidth}">
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
          <div class="note font-t14r">
            <span>{{ $t('user.payments.note') }}</span>
          </div>
          <base-button variants="outlined" color="primary" @click="showModalAddBank">
            <div class="d-flex align-items-center">
              <span class="icon-add-primary" />
              {{ $t('user.payments.label.add_payment_method') }}
            </div>
          </base-button>
        </div>
        <p class="payments__title font-t14b grey-800 mb-0">{{ $t('user.payments.label.transfer') }}</p>
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
    FilterLoaderSkeleton: () => import('~/components/desktop/commons/loader/filters.vue'),
    BaseButton: () => import('~/components/common/base-button/index.vue')
  },
  props: {
    isFullWidth: {
      type: Boolean,
      default: true
    }
  },
  mounted () {
    this.getUserSupportBanks()
    this.setPaymentDetail({})
  },
  methods: {
    ...mapActions('payments', ['getUserSupportBanks', 'setPaymentDetail']),
    showModalAddBank () {
      this.$bvModal.show(MODAL.ADD_BANK)
    }
  }
};
</script>

<style lang="scss" scoped src="static/assets/scss/components/desktop/merchant/payments/index.scss" />
