<template>
  <div class="chat-action" :class="classUnread" @click="$emit('click')">
    <div class="chat-action__inner">
      <svg-icon
        :icon="unread ? 'unread-message' : 'read-message'"
        class="chat-action__icon"
      />
      <div class="chat-action__text"><slot /></div>
    </div>
  </div>
</template>
<script>
export default {
  components: {
    SvgIcon: () => import('~/components/common/svg-icon/index.vue')
  },
  props: {
    unread: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    classUnread () {
      return this.unread ? 'unread' : null
    }
  }
}
</script>
<style lang="scss" scoped>
.chat-action {
  padding: 4px 8px;
  border-radius: 8px;
  border: 1px solid $light-blue-100;
  &__icon {
    width: 20px;
    height: 20px;
  }
  &__inner {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  &__text {
    @include font-t12m;
    color: $light-blue-100;
  }
  &.unread {
    border: 1px solid $red-400;
    .chat-action {
      &__text {
        color: $red-400;
      }
    }
  }
}
</style>
