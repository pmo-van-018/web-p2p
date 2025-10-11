<template>
  <div class="order-chat" :class="{ 'visible': isVisibleChat }">
    <chat-frame />
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  components: {
    ChatFrame: () => import('~/components/desktop/chat/index.vue')
  },
  computed: {
    ...mapState('chat', ['isVisibleChat'])
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/user-order-detail/order-chat.scss">
</style>
