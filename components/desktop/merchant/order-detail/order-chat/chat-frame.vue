<template>
  <div class="chat-frame">
    <div class="chat-frame__header">
      <div class="chat-frame__inner">
        <div class="d-flex align-items-center">
          <svg-icon
            :icon="hasReadMessage ? 'read-message' : 'unread-message'"
            class="chat-frame__icon-chat"
          />
          <div class="d-flex align-items-center flex-column">
            <div class="chat-frame__text">
              {{ isVisibleAppealButton ? 'Tin nhắn khiếu nại' : 'Tin nhắn thoả thuận' }}
            </div>
          </div>
        </div>
        <div v-if="!hasReadMessage" class="chat-frame__noti-dot" />
      </div>
      <div class="chat-frame__inner">
        <span
          v-show="isVisibleChat && !isVisibleCaution"
          class="icon-info"
          @click="setVisibleCaution(true)"
        />
        <span
          class="chat-frame__icon"
          :class="isVisibleChat ? 'icon-down-left-and-up-right-to-center' : 'icon-up-right-and-down-left-from-center active'"
          @click="onOpenChatFrame"
        />
      </div>
    </div>
    <div class="chat-frame__container" :class="{'visible': isVisibleChat }">
      <div class="chat-frame__body">
        <div class="chat-frame__rate-limit" :class="{'d-block': isErrorRateLimit}">
          {{ $t('chat.rate_limit') }}
        </div>
        <message-list
          :participants="participants"
          :is-scroll-down="isScrollDown"
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
      <div v-if="visibleOperationInputChat" class="chat-frame__footer">
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
  </div>
</template>
<script>
import chatMixin from '~/mixins/chat';
import actionAppealMixin from '~/mixins/merchant/orders/action-appeal';

export default {
  components: {
    MessageList: () => import('~/components/desktop/chat/message-list.vue'),
    UserInput: () => import('~/components/desktop/chat/user-input.vue'),
    CautionMessage: () => import('~/components/desktop/chat/message/caution-message.vue'),
    SvgIcon: () => import('~/components/common/svg-icon/index.vue')
  },
  mixins: [chatMixin, actionAppealMixin],
  methods: {
    onOpenChatFrame () {
      this.toggleVisibleChat()
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/merchant/order-detail/order-chat/chat-frame.scss">
</style>
