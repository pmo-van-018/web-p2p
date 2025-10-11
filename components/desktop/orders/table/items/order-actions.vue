<template>
  <div class="order-actions">
    <div class="order-actions__container">
      <div v-if="isShowCopyAllBtn || visibleActionAppeal" class="order-actions__top">
        <copy-all-info-payment v-if="isShowCopyAllBtn" :order="order" :hidden-bank-name="order.postType === POST_TYPE.SELL" />
        <div v-if="visibleActionAppeal" class="order-actions__item">
          <base-button
            v-if="(visibleChat || visibleAppeal) && joinedRoom"
            variants="text"
            :disabled="order.readOnly"
            class="order-actions__button-action"
            @click.stop="onOpenAppeal"
          >
            <svg-icon
              v-b-tooltip.hover="{
                disabled: $device.isMobile
              }"
              :title="visibleChat ? $t('common.tooltip.partner_contact') : $t('common.tooltip.response_appeal')"
              :icon="!lastMessages.length || order.isSeenMessage || !order.roomId? 'read-message' : 'unread-message'"
              class="order-actions__message-icon"
            />
          </base-button>
        </div>
      </div>
      <div v-if="isShowButtonTransfer || (order?.confirmResolved && !order?.appealResolved)" class="order-actions__bottom">
        <div v-if="isShowButtonTransfer && isPostTypeBuy" class="order-actions__item">
          <base-button
            :disabled="disabled"
            variants="outlined"
            color="primary"
            @click="onTermTransfer"
          >
            {{ $t('action.term_transfer') }}
          </base-button>
        </div>
        <div v-if="isShowButtonTransfer" class="order-actions__item">
          <base-button variants="contained" color="primary" :disabled="disabled" @click.stop="$emit('click')">
            <span v-if="isShowIconTransfer" :class="['order-actions__icon-transfer', iconClass]" />
            <slot />
          </base-button>
        </div>
        <div v-if="order?.confirmResolved && !order?.appealResolved" class="order-actions__item">
          <base-button
            variants="contained"
            color="primary"
            :disabled="order?.appealResolved || isLoading"
            @click.stop="onHandleResolved"
          >
            {{ $t('action.confirmed_processed') }}
          </base-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { BUY_ORDER_STEPS } from '@/constants/orders'
import { POST_TYPE } from '@/config/constant';
import { isKeepPopupOptionsLocalStorage } from '@/helper';
import { MODAL } from '@/resources/modal';
import { mapState } from 'vuex';
import actionAppealMixin from '~/mixins/merchant/orders/action-appeal'

export default {
  components: {
    CopyAllInfoPayment: () => import('@/components/desktop/orders/copy-all-info-payment/index.vue'),
    BaseButton: () => import('~/components/common/base-button/index.vue'),
    SvgIcon: () => import('~/components/common/svg-icon/index.vue')
  },
  mixins: [actionAppealMixin],
  props: {
    order: {
      type: Object,
      default: () => {}
    },
    visibleChat: {
      type: Boolean,
      default: false
    },
    visibleAppeal: {
      type: Boolean,
      default: false
    },
    hiddenTransfer: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    visibleActionAppeal: {
      type: Boolean,
      default: true
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    joinedRoom: {
      type: Boolean,
      default: true
    },
    visibleCopyAll: {
      type: Boolean,
      default: false
    },
    isVisibleTermTransfer: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      POST_TYPE
    }
  },
  computed: {
    ...mapState('chat', [
      'lastMessages'
    ]),
    step () {
      return this.order.step
    },
    isShowButtonTransfer () {
      return this.hiddenTransfer && !this.order.supporterView
    },
    isShowIconTransfer () {
      return [
        BUY_ORDER_STEPS.BUY_SENDING_CRYPTO_BY_MERCHANT,
        BUY_ORDER_STEPS.BUY_SENDING_CRYPTO_FAILED
      ].includes(this.step)
    },
    isShowCopyAllBtn () {
      return (this.$device.isMobile && !this.order?.supporterView) || this.visibleCopyAll
    },
    iconClass () {
      if (BUY_ORDER_STEPS.BUY_SENDING_CRYPTO_FAILED === this.step) {
        return 'icon-transfer-again'
      }
      return 'icon-transfer'
    }
  },
  methods: {
    onOpenAppeal () {
      if (this.isShowAppealModal(this.order)) {
        if (isKeepPopupOptionsLocalStorage(MODAL.MERCHANT_APPEAL, this.order?.type)) {
          this.$emit('on-open-appeal')
        } else {
          this.$emit('on-open-chat', this.order)
        }
      } else {
        this.$emit('on-open-chat', this.order)
      }
    },
    onHandleResolved () {
      if (this.order?.appealResolved) {
        return;
      }
      this.$emit('on-confirmed-processed')
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/orders/table/items/order-actions.scss">
</style>
