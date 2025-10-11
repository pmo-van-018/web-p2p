<template>
  <div class="bank-qr">
    <div class="qrcode" :style="styleOfQrCode">
      <b-skeleton-img v-show="!isLoaded" animation="fade" :no-aspect="true" class="qrcode-img" />
      <img class="qrcode-img" v-show="isLoaded" :src="qrCodeUrl" @load="isLoaded = true" />
    </div>
    <div v-if="showNote" class="note">{{ $t('label.bank_qrcode') }}</div>
  </div>
</template>
<script>

export default {
  props: {
    qrCodeUrl: {
      type: String,
      default: ''
    },
    showNote: {
      type: Boolean,
      default: true
    },
    size: {
      type: Number,
      default: 120
    }
  },
  data () {
    return {
      isLoaded: false
    }
  },
  computed: {
    styleOfQrCode () {
      return {
        width: this.size + 'px',
        height: this.size + 'px'
      }
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/common/transfer-to-seller/transfer-info/bank-qrcode.scss" />
