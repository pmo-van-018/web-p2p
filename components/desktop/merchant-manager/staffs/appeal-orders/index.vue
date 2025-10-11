<template>
  <section class="order-management">
    <div class="order-management__container">
      <div class="order-management__head">
        <client-only>
          <template #placeholder>
            <skeleton-head-info />
          </template>
          <head-info-staff :info="staff" :title="$t('role_management.appeal_orders')" />
        </client-only>
      </div>
      <div class="order-management__body">
        <appeal-orders @on-open-bank-qrcode="openModalBankQrcode" />
      </div>
    </div>
    <modal-bank-qrcode :qr-code-url="bankQrCode" />
  </section>
</template>
<script>
import { STAFF_BY_ID } from '@/api/staff';
import isEmpty from 'lodash/isEmpty';
import commonOrdersMixin from '@/mixins/merchant/orders/common';
import { MODAL } from '@/resources/modal';

export default {
  components: {
    HeadInfoStaff: () => import('~/components/desktop/merchant-manager/staffs/appeal-orders/info.vue'),
    SkeletonHeadInfo: () => import('~/components/desktop/merchant-manager/staffs/orders/info/skeleton.vue'),
    AppealOrders: () => import('~/components/desktop/merchant/orders-management/appeal-orders/index.vue'),
    ModalBankQrcode: () => import('@/components/common/modal/modal-bank-qrcode.vue')
  },
  mixins: [commonOrdersMixin],
  data () {
    return {
      staff: null,
      bankQrCode: ''
    }
  },
  computed: {
    staffId () {
      return this.$route?.params?.id
    }
  },
  async created () {
    await this.getStaff()
  },
  methods: {
    async getStaff () {
      try {
        const result = await this.$axios.$get(STAFF_BY_ID?.(this.staffId));
        if (!isEmpty(result?.data)) {
          this.staff = result.data
        }
      } catch (e) {
        console.error(e);
      }
    },
    openModalBankQrcode (order) {
      this.bankQrCode = order.bankQrCode
      this.$bvModal.show(MODAL.BANK_QRCODE)
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/role-management/orders/index.scss">
</style>
