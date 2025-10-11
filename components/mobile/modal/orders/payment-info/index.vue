<template>
  <b-modal
    :id="modalId"
    modal-class="modal-custom order-payment-detail"
    centered
    hide-header
    hide-footer
  >
    <div class="modal-payment-detail">
      <div class="modal-payment-detail__container">
        <div class="modal-payment-detail__head">
          <span class="modal-payment-detail__back icon-chevron-right1" @click="onCloseModal"></span>
          <div class="modal-payment-detail__title">{{ $t('merchant.transaction_detail.payment_methods') }}</div>
          <div class="modal-payment-detail__close" @click="onCloseModal">
            <span class="icon-cancel" />
          </div>
        </div>
        <div class="modal-payment-detail__body">
          <order-payment-info :order="order" :is-show-header="false" is-show-qr-code />
        </div>
      </div>
    </div>
  </b-modal>
</template>
<script>
import { MODAL } from '@/resources/modal'

export default {
  components: {
    OrderPaymentInfo: () => import('~/components/mobile/orders/order-detail/order-payment-info.vue')

  },
  props: {
    order: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      modalId: MODAL.PAYMENT_DETAIL_INFO
    }
  },
  methods: {
    onCloseModal () {
      this.$bvModal.hide(this.modalId)
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/mobile/modal/orders/payment-info/index.scss">
</style>
