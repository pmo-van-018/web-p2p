<template>
  <div class="chat-action" @click="$emit('click')">
    <div class="chat-action__container">
      <svg-icon
        :icon="chatNoti ? 'unread-message' : 'read-message'"
        class="chat-action__icon"
      />
      <div class="chat-action__text">{{ buttonText }}</div>
    </div>
    <div v-if="chatNoti" class="chat-action__noti-dot" />
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  components: {
    SvgIcon: () => import('~/components/common/svg-icon/index.vue')
  },
  props: {
    buttonText: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapState('chat', ['chatNoti'])
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/user-order-detail/chat-action.scss">
</style>
