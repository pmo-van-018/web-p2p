<template>
  <b-modal
    id="modalConnectWallet"
    ref="modalConnectWallet"
    modal-class="modal-custom bottom modal-connect-wallet"
    centered
    hide-header
    hide-footer
    @hidden="$emit('close-modal-connect')"
  >
    <div class="modal-connect-wallet__content" :class="{'modal-connect-wallet__content--timeout': timeout}">
      <div class="modal-connect-wallet__header">
        <div v-if="title" class="modal-connect-wallet__title">{{ $t(`${title}`) }}</div>
        <div v-else class="modal-connect-wallet__title">{{ $t('home.open') }} <span>{{ $t('home.wallet') }}</span> {{ $t('home.title-connect-wallet') }}</div>
        <div class="modal-connect-wallet__close" @click="close()">
          <span class="icon-cancel" />
        </div>
      </div>
      <div class="modal-connect-wallet__img">
        <img :src="qrSrc">
        <div class="modal-connect-wallet__timeout">
          <div class="modal-connect-wallet__timeout-title">{{ $t('home.qr-timeout') }}</div>
          <button class="modal-connect-wallet__timeout-action" @click="refreshQr()">{{ $t('action.refresh') }}</button>
        </div>
      </div>
    </div>
  </b-modal>
</template>
<script>

export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    qrSrc: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      timeout: false,
      isOpen: false
    };
  },
  mounted () {
    this.$root.$on('bv::modal::hidden', (bvEvent) => {
      if (bvEvent.componentId === 'modalConnectWallet') {
        this.isOpen = false
      }
    });
  },
  methods: {
    show () {
      this.$refs.modalConnectWallet.show();
      this.isOpen = true;
    },
    close () {
      this.$refs.modalConnectWallet.hide();
    },
    refreshQr () {
      this.timeout = false
      this.show()
    }
  }
};
</script>
<style scoped lang="scss" src="static/assets/scss/components/desktop/modal/modal-connect-wallet.scss"></style>
