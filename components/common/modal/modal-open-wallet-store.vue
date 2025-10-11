<template>
  <ModalCommon
    :id="MODAL.WALLET_APP_STORE"
    :ref="MODAL.WALLET_APP_STORE"
    centered
    hide-header
    @hide-modal="closePopup()"
  >
    <div class="modal-open-wallet">
      <div class="modal-open-wallet__loader-container">
        <loader class="modal-open-wallet__loader" />
      </div>
      <p class="modal-open-wallet__title">Đang kết nối...</p>
      <p class="modal-open-wallet__statement">Xác minh liên kết trong ví của bạn</p>
      <p class="modal-open-wallet__link">
        <span class="question">Bạn chưa có ví?</span>
        <span class="link hoverable" @click="openLink()"> Nhấn vào đây để tải
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3.64645 11.6464C3.45118 11.8417 3.45118 12.1583 3.64645 12.3536C3.84171 12.5488 4.15829 12.5488 4.35355 12.3536L9 7.70711L11.6464 10.3536C11.7894 10.4966 12.0045 10.5393 12.1913 10.4619C12.3782 10.3846 12.5 10.2022 12.5 10V4C12.5 3.72386 12.2761 3.5 12 3.5L6 3.5C5.79777 3.5 5.61545 3.62182 5.53806 3.80866C5.46067 3.9955 5.50345 4.21055 5.64645 4.35355L8.29289 7L3.64645 11.6464Z" fill="#13C7C7"/></svg>
        </span>
      </p>
    </div>
  </ModalCommon>
</template>
<script>
import ModalCommon from '@/components/desktop/modal/modal-common.vue';
import { MODAL } from '@/resources/modal'

export default {
  components: {
    ModalCommon,
    Loader: () => import('~/components/common/loader.vue')
  },
  props: {
    modalClass: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      MODAL
    }
  },
  methods: {
    openLink () {
      window.location.href = this.getLink()
    },
    getLink () {
      return localStorage.getItem('appLink')
    },
    showPopup () {
      this.$bvModal.show(MODAL.WALLET_APP_STORE)
    },
    closePopup () {
      this.$bvModal.hide(MODAL.WALLET_APP_STORE)
    }
  }
}
</script>
<style scoped lang="scss" src="static/assets/scss/components/common/modal/modal-open-wallet-store.scss"></style>
