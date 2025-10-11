<template>
  <div
    ref="scrollList"
    class="message-list"
    :class="[
      {'loading': isLoadingMessages },
      {'visible': isVisibleChatFrame }
    ]"
    @scroll="onScrollMessageList"
  >
    <div
      class="message-list__wrapper"
    >
      <div v-if="isLoadingMessages">Loading...</div>
      <div v-else ref="scrollListContainer">
        <slot />
        <transition-group tag="ul" name="list" class="message-list__container">
          <div v-for="message in mapRolesToMessages" :key="message._id" class="message-list__item">
            <message
              :message="message"
              :sign-cookie-query="signedCookieQueryParam"
              :visible-role-text="false"
            />
          </div>
        </transition-group>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapState } from 'vuex'
import throttle from 'lodash/throttle'
import merge from 'lodash/merge'
import { CHAT_MESSAGE_TYPE, CHAT_USER_TYPE, TYPE_ROLE_CHAT } from '@/constants/chat'
import { USER_ROLE } from '@/config/constant'
import { REQUEST_TYPE, REQUEST_TYPE_CODES } from '@/resources/customer-care';

export default {
  components: {
    Message: () => import('~/components/desktop/chat/message.vue')
  },
  props: {
    alwaysScrollToBottom: {
      type: Boolean,
      default: true
    },
    isScrollDown: {
      type: Boolean,
      default: true
    },
    userName: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      isShowMessageList: false,
      isVisibleArrowDown: false
    }
  },
  computed: {
    ...mapState('chat-support-request', ['isLoadingMessages', 'messages', 'isVisibleChat']),
    ...mapGetters('chat-support-request', ['signedCookieQueryParam']),
    ...mapState('user', ['user']),
    isVisibleChatFrame () {
      return this.isShowMessageList && !this.isLoadingMessages
    },
    autoReplyMessageConcatToList () {
      if ([USER_ROLE.ADMIN_SUPPORTER, USER_ROLE.SUPER_ADMIN].includes(this.user?.type)) {
        return this.messages
      }
      const firstMessage = this.messages.slice(0, 1)
      return this.messages.length ? [
        ...firstMessage,
        {
          _id: 'auto_reply_message',
          room: {
            _id: firstMessage[0]?.roomId
          },
          user: {
            _id: 'auto_reply_message',
            type: CHAT_USER_TYPE.ADMIN
          },
          msg: this.getFirstMessageAutoReply(firstMessage[0]?.msg),
          type: CHAT_MESSAGE_TYPE.RAW,
          createdAt: firstMessage[0]?.createdAt
        },
        ...this.messages.slice(1)
      ] : []
    },
    mapRolesToMessages () {
      return this.autoReplyMessageConcatToList.map((message) => {
        const updatedMessage = merge({}, message);
        updatedMessage.role = null;
        updatedMessage.nickName = '';
        updatedMessage.typeRoleChatText = this.getRoleChatText(message);
        updatedMessage.user.type = this.updateUserType(message)
        updatedMessage.typeRoleChat = TYPE_ROLE_CHAT.SUPPORTER_CHAT
        return updatedMessage;
      });
    }
  },
  watch: {
    isLoadingMessages: {
      handler (value) {
        setTimeout(() => {
          if (!value) {
            this.$nextTick(() => {
              this.scrollDown()
            })
          }
        }, 200)
      },
      immediate: true
    },
    isVisibleChat: {
      handler (value) {
        if (value) {
          this.$nextTick(() => {
            this.scrollDown()
          })
        }
      }
    },
    isScrollDown: {
      handler (value) {
        if (value) {
          this.$nextTick(() => {
            this.scrollDown()
          })
        }
      }
    }
  },
  updated () {
    if (this.shouldScrollToBottom() && this.isScrollDown) {
      this.scrollDown()
    }
  },
  methods: {
    getFirstMessageAutoReply (text) {
      const requestTypeFounded = REQUEST_TYPE.find(request => this.$t(request.text) === text)
      if (requestTypeFounded?.value === REQUEST_TYPE_CODES.MANAGER_REGISTRATION) {
        return this.$t('customer_care.auto_message_registration_manager')
      }
      return this.$t('customer_care.auto_message_first')
    },
    getRoleChatText (message) {
      if ([USER_ROLE.ADMIN_SUPPORTER, USER_ROLE.SUPER_ADMIN].includes(this.user?.type)) {
        return message.user?.type === CHAT_USER_TYPE.USER
          ? this.userName : this.$t('customer_care.nickname')
      }
      return this.$t('customer_care.nickname')
    },
    updateUserType (message) {
      if (this.user?.type === USER_ROLE.USER) {
        return message.user?.type === CHAT_USER_TYPE.ADMIN
          ? CHAT_USER_TYPE.SUPPORTER_CHAT : message.user?.type
      }
      return message.user?.type === CHAT_USER_TYPE.ADMIN
        ? CHAT_USER_TYPE.ADMIN : message.user?.type
    },
    scrollDown () {
      if (this.$refs.scrollList) {
        this.$nextTick(() => {
          setTimeout(() => {
            this.$refs.scrollList.scrollTop = this.$refs.scrollList?.scrollHeight - this.$refs.scrollList?.clientHeight
            this.isShowMessageList = true
          }, 100)
        })
      }
    },
    shouldScrollToBottom () {
      const scrollTop = this.$refs.scrollList.scrollTop
      const scrollable = scrollTop > (this.$refs.scrollList.scrollHeight - 100)
      return (this.alwaysScrollToBottom || scrollable)
    },
    onScrollMessageList: throttle(function () {
      const currentScroll = this.$refs.scrollList.scrollTop
      this.isVisibleArrowDown = Math.ceil(currentScroll) < (this.$refs.scrollList?.scrollHeight - this.$refs.scrollList?.clientHeight)
      this.$emit('on-scroll', this.isVisibleArrowDown)
    }, 500)
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/chat/message-list.scss">
</style>
