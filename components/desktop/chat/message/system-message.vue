<template>
  <div
    class="system-message"
    :class="{
      'reverse': reverseSystem,
      'none': bot && !reverseSystem
    }"
  >
    <div v-if="bot" class="system-message__note font-t14r text-center">
      {{ text }}
    </div>
    <div v-else class="system-message__wrapper">
      <div class="system-message__content">
        {{ text }}
      </div>
      <div class="system-message__date">
        {{ date }}
      </div>
    </div>
  </div>
</template>
<script>
import { CHAT_USER_TYPE } from '@/constants/chat'
import { mapState } from 'vuex'

export default {
  props: {
    message: {
      type: Object,
      required: true
    },
    // eslint-disable-next-line vue/require-default-prop
    text: {
      type: String,
      require: true
    },
    // eslint-disable-next-line vue/require-default-prop
    date: {
      type: String,
      require: true
    },
    reverseSystem: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState('user', ['user']),
    bot () {
      return this.message?.user?.type === CHAT_USER_TYPE.BOT
    },
    system () {
      return this.message?.user?.type === CHAT_USER_TYPE.SYSTEM
    }
  }
}
</script>
<style lang="scss" scoped>
.system-message {
  border-left: 3px solid $main-600;
  background: var(--system-chat-background-color);
  &.reverse {
    border-right: 3px solid $main-600;
    background: linear-gradient(270deg, rgba(255, 161, 51, 0.16) 0%, rgba(255, 161, 51, 0.00) 100%);
    border-left: none;
  }
  &.none {
    border-right: none;
    border-left: none;
    background: transparent;
  }
  &__note {
    color: var(--mode-light-dark-500);
  }
  &__wrapper {
    display: flex;
    flex-direction: column;
    padding: 6px 12px;
  }
  &__content {
    @include font-t14r;
    color: var(--mode-light-dark-1500);
    white-space: pre-line;
    margin-top: -20px;
  }
  &__date {
    @include font-t12r;
    color: var(--mode-light-dark-500);
    margin-left: auto;
  }
}
</style>
