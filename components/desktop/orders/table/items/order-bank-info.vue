<template>
  <div class="order-bank-info">
    <div v-if="bankNumberInfo">
      <img class="bank-icon" :src="bankIcon?.icon" :alt="bankIcon?.bankName">
      <span class="order-bank-info__text">
        {{ bankNumberInfo }}
      </span>
      <span v-if="isSellOrder" class="order-bank-info__icon icon-qrcode" @click="showBankQrcodeModal()" />
    </div>
    <div>
      <span class="order-bank-info__text">
        {{ transCode }}
      </span>
      <copy-button :id="`copy-trans-code-${orderId}`" :value="transCode" />
    </div>
  </div>
</template>

<script>
import { ORDER_TYPE } from '@/resources/order-type';
import { MODAL } from '@/resources/modal';
import { BANK } from '@/resources/bank';

export default {
  components: {
    CopyButton: () => import('@/components/common/copy-button.vue')
  },
  props: {
    order: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      MODAL
    }
  },
  computed: {
    orderId () {
      return this.order?.orderId;
    },
    isSellOrder () {
      return this.order?.postType === ORDER_TYPE.BUY
    },
    bankNumberInfo () {
      let bankNumberInfo = '';
      if (this.order?.bankName) {
        bankNumberInfo += BANK.find(e => e.bankName === this.order?.bankName)?.name ?? '';
      }
      if (this.order?.bankNumber) {
        bankNumberInfo += ` - ${this.order.bankNumber}`;
      }
      return bankNumberInfo;
    },
    bankIcon () {
      const bankIcon = BANK.find(e => e.bankName === this.order?.bankName)
      return bankIcon;
    },
    transCode () {
      return this.order?.transCode;
    }
  },
  methods: {
    showBankQrcodeModal () {
      this.$emit('on-open-bank-qrcode', this.order)
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/orders/table/items/order-bank-info.scss">
</style>
