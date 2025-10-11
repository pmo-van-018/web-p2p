<template>
  <div class="chat-appeal">
    <chat-frame>
      <template #header>
        <div class="chat-appeal__head">
          <svg-icon
            icon="read-message"
            class="chat-appeal__icon-system"
          />
          <div class="chat-appeal__text">Tin nhắn giao dịch</div>
          <span class="icon-info" @click="setVisibleCaution(true)" />
        </div>
      </template>
    </chat-frame>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import { ORDER_STATUS } from '@/config/constant'
import { CHAT_WS_EVENT } from '@/constants/chat';

export default {
  components: {
    ChatFrame: () => import('~/components/desktop/chat/index.vue'),
    SvgIcon: () => import('~/components/common/svg-icon/index.vue')
  },
  props: {
    order: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    order: {
      handler () {
        if ([ORDER_STATUS.COMPLETED, ORDER_STATUS.CANCELLED].includes(this.order?.status)) {
          this.setOrder(this.order)
        }
      }
    }
  },
  beforeDestroy () {
    if (this.$socketChat) {
      this.$socketChat.emit(CHAT_WS_EVENT.LEAVE_ROOM, {
        roomId: this.order?.roomId
      })
    }
  },
  methods: {
    ...mapActions('chat', ['setVisibleCaution', 'setOrder'])
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/admin/appeal-detail/chat/index.scss">
</style>
