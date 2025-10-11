<template>
  <modal-common
    :id="modalId"
    :ref="modalId"
    centered
    hide-header
    hide-footer
    no-close-on-esc
    no-close-on-backdrop
  >
    <div class="confirm-transaction-failed">
      <div class="confirm-transaction-failed__container">
        <div v-if="thumbnail" class="confirm-transaction-failed__thumb">
          <img :src="thumbnail" alt="icon confirm">
        </div>
        <div class="confirm-transaction-failed__head">
          <h2 class="confirm-transaction-failed__title">{{ title }}</h2>
          <p v-if="desc" class="confirm-transaction-failed__desc">{{ desc }}</p>
        </div>
        <div v-if="order" class="confirm-transaction-failed__content">
          <div class="order-info">
            <div class="order-info__inner">
              <div class="order-info__title">{{ $t('transaction.order_type') }}</div>
              <div class="order-info__value"><span :class="orderClass">{{ orderText }}</span> {{ order.assetName }}({{ order.assetNetwork }})</div>
            </div>
            <div class="order-info__inner">
              <div class="order-info__title">{{ $t('transaction.id_type') }}</div>
              <div class="order-info__value">#{{ order?.orderRefId }}</div>
            </div>
            <div class="order-info__inner">
              <div class="order-info__title">{{ $t('transaction.amount') }}</div>
              <div class="order-info__value">{{ amount }} <span>{{ order?.assetName }}</span></div>
            </div>
          </div>
        </div>
        <div class="confirm-transaction-failed__note">
          <note-system :notes="notes" :title="$t('transaction.note')" />
        </div>
        <div class="confirm-transaction-failed__action">
          <base-button
            full-width
            color="info"
            variants="contained"
            @click="onClose"
          >
            {{ $t('action.close') }}
          </base-button>
          <base-button
            color="primary"
            full-width
            variants="contained"
            :disabled="isLoading"
            @click="onConfirm"
          >
            {{ $t('action.confirm') }}
          </base-button>
        </div>
      </div>
    </div>
  </modal-common>
</template>
<script>
import { MODAL } from '@/resources/modal'
import { ORDER_TYPE } from '@/resources/order-type';

export default {
  components: {
    ModalCommon: () => import('~/components/desktop/modal/modal-common.vue'),
    BaseButton: () => import('~/components/common/base-button/index.vue'),
    NoteSystem: () => import('~/components/common/note-system/index.vue')
  },
  props: {
    order: {
      type: Object,
      default: () => {}
    },
    title: {
      type: String,
      default: ''
    },
    desc: {
      type: String,
      default: ''
    },
    thumbnail: {
      type: String,
      default: ''
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    notes: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    amount () {
      return this.$options.filters.formatCrypto(this.order?.amount || 0)
    },
    orderText () {
      return this.order?.type === ORDER_TYPE.BUY ? this.$t('common.buy') : this.$t('common.sell')
    },
    orderClass () {
      return this.order?.type === ORDER_TYPE.BUY ? 'buy' : 'sell'
    }
  },
  data () {
    return {
      modalId: MODAL.CONFIRMATION_TRANSACTION_FAILED
    }
  },
  methods: {
    onClose () {
      this.$bvModal.hide(this.modalId);
    },
    onConfirm () {
      this.$emit('on-confirm', this.order)
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/admin/orders/confirmation-modal.scss"></style>
