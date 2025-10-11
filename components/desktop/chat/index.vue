<template>
  <div class="chat-frame" :class="{'visible': isVisibleChat }">
    <div v-if="visibleChatButton" class="chat-frame__btn-expand" @click="$emit('on-expand')">
      <div class="btn-expand">
        <svg-icon
          :icon="chatNoti ? 'unread-message' : 'read-message'"
          class="btn-expand__icon"
        />
        <div class="btn-expand__text">{{ btnExpandText }}</div>
      </div>
      <div v-if="chatNoti" class="btn-expand__noti-dot" />
    </div>
    <div v-if="visibleHeader" class="chat-frame__head">
      <slot name="header">
        <chat-header
          :is-visible-icon-caution="!isVisibleCaution"
          @on-hide="toggleVisibleChat"
          @on-show-caution="setVisibleCaution(true)"
        />
      </slot>
    </div>
    <div class="chat-frame__body">
      <div class="chat-frame__rate-limit" :class="{'d-block': isErrorRateLimit}">
        {{ $t('chat.rate_limit') }}
      </div>
      <message-list
        :is-scroll-down="isScrollDown"
        :participants="participants"
        @on-scroll="isVisibleArrowDown = $event; isScrollDown = false;"
      />
      <div v-show="isVisibleCaution" class="chat-frame__caution">
        <caution-message @on-close-caution="onCloseCaution" />
      </div>
      <div
        class="chat-frame__arrow-down"
        :class="{ 'visible': isVisibleArrowDown }"
        @click="onScrollDown"
      >
        <span class="icon-arrow-right" />
      </div>
    </div>
    <div v-if="visibleUserInputChat" class="chat-frame__footer">
      <user-input
        ref="userInput"
        @on-input="handleInputMessage"
        @on-input-file="$_chatMixin_sendFileFirstMessage"
        @on-send-multiple-files="$_chatMixin_onSendMultipleFiles"
        @on-focus-input="$_chatMixin_onFocusInput"
        @on-blur-input="$_chatMixin_onBlurInput"
      />
    </div>
  </div>
</template>
<script>
import chatMixin from '~/mixins/chat'

export default {
  components: {
    ChatHeader: () => import('~/components/desktop/chat/chat-header.vue'),
    MessageList: () => import('~/components/desktop/chat/message-list.vue'),
    UserInput: () => import('~/components/desktop/chat/user-input.vue'),
    CautionMessage: () => import('~/components/desktop/chat/message/caution-message.vue'),
    SvgIcon: () => import('~/components/common/svg-icon/index.vue')
  },
  mixins: [chatMixin],
  props: {
    visibleHeader: {
      type: Boolean,
      default: true
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/chat/index.scss">
</style>
