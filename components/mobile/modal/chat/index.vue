<template>
  <b-modal
    :id="modalId"
    modal-class="modal-custom"
    centered
    hide-header
    hide-footer
    no-close-on-backdrop
    no-close-on-esc
  >
    <div class="modal-chat">
      <div class="modal-chat__container">
        <div class="modal-chat__head">
          <span class="modal-chat__icon-head icon-chevron-right1" @click="onCloseModal" />
          <div class="d-flex align-items-center">
            <svg class="modal-chat__icon-chat">
              <use xlink:href="#icon-chat-group" />
            </svg>
            <div class="modal-chat__text">Tin nhắn giao dịch</div>
          </div>
          <div>
            <span
              class="modal-chat__icon-head icon-info"
              :class="{ 'active': !isVisibleCaution }"
              @click="setVisibleCaution(!isVisibleCaution)"
            />
          </div>
        </div>
        <div class="modal-chat__body">
          <chat-frame :visible-header="false" />
        </div>
      </div>
    </div>
  </b-modal>
</template>
<script>
import { MODAL } from '@/resources/modal'
import { mapActions, mapState } from 'vuex'
export default {
  components: {
    ChatFrame: () => import('~/components/desktop/chat/index.vue')
  },
  data () {
    return {
      modalId: MODAL.CHAT_FRAME
    }
  },
  computed: {
    ...mapState('chat', ['isVisibleCaution'])
  },
  methods: {
    ...mapActions('chat', ['setVisibleCaution']),
    onCloseModal () {
      this.$bvModal.hide(this.modalId)
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/mobile/modal/chat/index.scss">
</style>
