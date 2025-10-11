<template>
  <b-modal
    id="modalResultConnectWallet"
    ref="modalResultConnectWallet"
    modal-class="modal-custom result-connect-wallet"
    centered
    hide-header
    hide-footer
  >
    <div class="result-connect-wallet__content">
      <div class="result-connect-wallet__close" @click="close()"><span class="icon-cancel" /></div>
      <div class="result-connect-wallet__banner">
        <img :src="connectWalletImg.p2p_app" class="result-connect-wallet__img">
        <span class="result-connect-wallet__icon" :class="icon" />
        <img :src="connectWalletImg.wallet" class="result-connect-wallet__img">
      </div>
      <div class="result-connect-wallet__title">
        {{ title }}
      </div>
      <div v-if="isFail" class="result-connect-wallet__note">
        {{ $t('modal.connect_wallet.note_failed_section_1') }}<br>
        {{ $t('modal.connect_wallet.note_failed_section_2_1') }} <span>{{ $t('modal.connect_wallet.text_support') }}</span> {{ $t('modal.connect_wallet.note_failed_section_2_2') }}
      </div>
      <div v-else-if="isSuccess" class="result-connect-wallet__note" v-html="$t('modal.connect_wallet.note_successed')" />
      <div v-if="isFail" class="result-connect-wallet__action">
        <button class="secondary result-connect-wallet__action-btn" @click="close()">{{ $t('action.exit') }}</button>
        <button class="primary result-connect-wallet__action-btn" @click="close(); $emit('linkAgain')">{{ $t('action.link_again') }}</button>
      </div>
      <div v-else-if="isSuccess" class="result-connect-wallet__action result-connect-wallet__action--successed">
        <button class="primary result-connect-wallet__action-btn" @click="close(); $router.push('/')">{{ $t('action.buy_sell_crypto') }}</button>
      </div>
    </div>
  </b-modal>
</template>
<script>
import { STATUS, STATUS_CONNECT_WALLET, CONNECT_WALLET_IMG } from '@/resources/wallet.js';
export default {
  data () {
    return {
      connectWalletImg: CONNECT_WALLET_IMG
    }
  },
  computed: {
    resultConnectWallet () {
      return this.$store.state.wallet.resultConnectWallet;
    },
    icon () {
      return STATUS_CONNECT_WALLET[this.resultConnectWallet].icon
    },
    title () {
      return this.$t(STATUS_CONNECT_WALLET[this.resultConnectWallet].title)
    },
    isSuccess () {
      return this.resultConnectWallet === STATUS.SUCCESS
    },
    isFail () {
      return this.resultConnectWallet === STATUS.FAIL
    }
  },
  methods: {
    show () {
      this.$refs.modalResultConnectWallet.show();
    },
    close () {
      this.$refs.modalResultConnectWallet.hide();
    }
  }
}
</script>
<style scoped lang="scss" src="static/assets/scss/components/desktop/modal/result-connect-wallet.scss"></style>
