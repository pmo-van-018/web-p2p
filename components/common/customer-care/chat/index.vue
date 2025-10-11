<template>
  <section class="chat-support">
    <div v-if="roomId" class="chat-support__frame chat-frame">
      <div class="chat-frame__body">
        <div class="chat-frame__rate-limit" :class="{'d-block': isErrorRateLimit}">
          {{ $t('chat.rate_limit') }}
        </div>
        <message-list
          :user-name="userName"
          :is-scroll-down="isScrollDown"
          @on-scroll="isVisibleArrowDown = $event; isScrollDown = false;"
        >
          <div v-if="visibleFirstContent" class="chat-support__first">
            <span class="chat-support__first-content">{{ $t('action.request_supporter') }} #{{ requestId }}</span>
            <copy-button
              :id="`supprort-${requestId}`"
              :show-text-copied="false"
              :value="requestId"
            />
          </div>
        </message-list>
        <div
          class="chat-frame__arrow-down"
          :class="{ 'visible': isVisibleArrowDown }"
          @click="onScrollDown"
        >
          <span class="icon-arrow-right" />
        </div>
      </div>
      <div v-if="isVisibleChatInput" class="chat-frame__footer">
        <user-input
          ref="userInput"
          @on-input="onInputMessage"
          @on-input-file="$_chatMixin_onSendMessageFile"
          @on-focus-input="$_chatMixin_onFocusInput"
        />
      </div>
    </div>
    <div v-else class="chat-support__request-type">
      <request-type @on-select="$emit('on-request-support', $event)" />
    </div>
  </section>
</template>
<script>
import chatSupportRequestMixin from '~/mixins/customer-care/chat.js'

export default {
  components: {
    RequestType: () => import('~/components/common/customer-care/request-type.vue'),
    MessageList: () => import('~/components/common/customer-care/chat/message-list.vue'),
    UserInput: () => import('~/components/common/customer-care/chat/user-input.vue'),
    CopyButton: () => import('~/components/common/copy-button.vue')
  },
  mixins: [chatSupportRequestMixin],
  props: {
    roomId: {
      type: String,
      default: ''
    },
    requestId: {
      type: String,
      default: ''
    },
    requestTypeText: {
      type: String,
      default: ''
    },
    userName: {
      type: String,
      default: ''
    },
    visibleFirstContent: {
      type: Boolean,
      default: true
    },
    pendingRequest: {
      type: Boolean,
      default: true
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/common/customer-care/chat/index.scss">
</style>
<style lang="scss" scoped src="static/assets/scss/components/desktop/chat/index.scss">
</style>
