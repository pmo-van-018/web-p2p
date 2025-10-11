<template>
  <b-modal
    :id="modalId"
    modal-class="modal-custom order-detail"
    centered
    hide-header
    hide-footer
    @shown="onShowOrderDetail"
  >
    <div class="modal-detail">
      <div class="modal-detail__container">
        <div class="modal-detail__head">
          <div v-if="Object.keys(orderDetail).length" class="modal-detail__status-label">
            <order-type
              :post-type="orderDetail.postType"
              :name="orderDetail.assetName"
              :network="orderDetail.assetNetwork"
              is-horizontal
            />
          </div>
          <div class="modal-detail__close" @click="onCloseModal">
            <span class="icon-cancel" />
          </div>
        </div>
        <div v-if="Object.keys(orderDetail).length" class="modal-detail__body">
          <div class="modal-detail__wrapper">
            <div class="modal-detail__item">
              <order-info :order="orderDetail" />
            </div>
            <div class="modal-detail__item">
              <order-main-info :order="orderDetail" />
            </div>
            <div class="modal-detail__item">
              <order-payment-info :order="orderDetail" is-show-qr-code />
            </div>
            <div class="modal-detail__item">
              <order-transaction :order="orderDetail" />
              <div v-if="enableSubmitTx" class="tx-hash">
                <span class="font-14r grey-600">{{ $t('tx_confirm.text_pc_operation') }}</span>
                <div class="tx-submit" @click="$refs.popupTxConfirmation.show()">
                  <span>{{ $t('action.reconfirm') }}</span>
                  <span class="modal-detail__external-icon icon-arrow-right-up"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="isVisibleAction" class="modal-detail__footer">
          <order-footer
            :order="orderDetail"
            @on-transfer="$emit('on-transfer', $event)"
            @on-pay="$emit('on-pay', $event)"
            @on-open-appeal="onOpenAppeal"
          />
        </div>
      </div>
    </div>
    <ModalTxConfirmation ref="popupTxConfirmation" />
  </b-modal>
</template>
<script>
import { mapState } from 'vuex';
import { MODAL } from '@/resources/modal'
import { ORDER_STATUS, POST_TYPE, USER_ROLE } from '@/config/constant'

export default {
  components: {
    ModalTxConfirmation: () => import('@/components/mobile/modal/tx-confirm'),
    OrderType: () => import('~/components/desktop/orders/table/items/order-type.vue'),
    OrderFooter: () => import('~/components/desktop/orders/table/detail-row-order/order-footer/index.vue'),
    OrderInfo: () => import('~/components/mobile/orders/order-detail/order-info.vue'),
    OrderMainInfo: () => import('~/components/mobile/orders/order-detail/order-main-info.vue'),
    OrderPaymentInfo: () => import('~/components/mobile/orders/order-detail/order-payment-info.vue'),
    OrderTransaction: () => import('~/components/mobile/orders/order-detail/order-transaction.vue')
  },
  props: {
    orderDetail: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      modalId: MODAL.ORDER_DETAIL
    }
  },
  computed: {
    ...mapState('user', ['user']),
    isVisibleAction () {
      return ![ORDER_STATUS.COMPLETED, ORDER_STATUS.CANCELLED].includes(this.orderDetail?.status)
    },
    enableSubmitTx () {
      return this.orderDetail?.postType === POST_TYPE.SELL &&
      this.orderDetail.status === ORDER_STATUS.PAID &&
      this.user?.type === USER_ROLE.MERCHANT_OPERATOR
    }
  },
  watch: {
    orderDetail: {
      handler (detail) {
        if (detail && [ORDER_STATUS.CANCELLED, ORDER_STATUS.COMPLETED].includes(detail?.status)) {
          this.$bvModal.hide(MODAL.ORDER_DETAIL)
        }
      },
      immediate: true
    }
  },
  methods: {
    onShowOrderDetail () {
      const id = this.$route?.query?.id || 1
      const postType = this.$route?.query?.postType
      if (id && postType) {
        this.$emit('on-open-detail', { type: postType, id })
      }
    },
    onCloseModal () {
      this.$bvModal.hide(MODAL.ORDER_DETAIL)
    },
    onOpenAppeal (order) {
      this.$emit('on-open-appeal', this.orderDetail)
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/mobile/modal/orders/detail/index.scss">
</style>
