<template>
  <b-modal
    :id="MODAL.BANK_QRCODE"
    :ref="MODAL.BANK_QRCODE"
    centered
    hide-header
    hide-footer
  >
    <div class="bank-qrcode">
      <div class="bank-qrcode__header">
        <div class="title">{{ $t('label.bank_qrcode') }}</div>
        <div class="close" @click="close()"><span class="icon-cancel" /></div>
      </div>
      <div class="bank-qrcode__body">
        <b-skeleton-img v-show="!isLoaded" animation="fade" :no-aspect="true" class="qrcode-img" />
        <img class="qrcode-img" v-show="isLoaded" :src="qrCodeUrl" @load="isLoaded = true" />
      </div>
    </div>
  </b-modal>
</template>
<script>
import { MODAL } from '@/resources/modal'
export default {
  props: {
    qrCodeUrl: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      isLoaded: false,
      MODAL
    }
  },
  methods: {
    close () {
      this.$bvModal.hide(MODAL.BANK_QRCODE)
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/common/modal/modal-bank-qrcode.scss">
</style>
