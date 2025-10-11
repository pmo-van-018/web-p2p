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
        <transition-group tag="ul" name="list" class="message-list__container">
          <div v-for="message in mapRolesToMessagesWithStatusOrder" :key="message._id" class="message-list__item">
            <message :message="message" :sign-cookie-query="signedCookieQueryParam" />
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
import { ORDER_STATUS, USER_ROLE } from '@/config/constant'
import { CHAT_USER_TYPE, TYPE_ROLE_CHAT } from '@/constants/chat'
import { ORDER_TYPE } from '@/resources/order-type'

export default {
  components: {
    Message: () => import('~/components/desktop/chat/message.vue')
  },
  props: {
    alwaysScrollToBottom: {
      type: Boolean,
      default: true
    },
    participants: {
      type: Array,
      default: () => []
    },
    isScrollDown: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      isShowMessageList: false,
      isVisibleArrowDown: false
    }
  },
  computed: {
    ...mapGetters('chat', ['signedCookieQueryParam']),
    ...mapState('chat', ['isLoadingMessages', 'messages', 'isVisibleChat', 'order']),
    ...mapState('user', ['user']),
    isVisibleChatFrame () {
      return this.isShowMessageList && !this.isLoadingMessages
    },
    orderType () {
      return this.order?.type
    },
    mapRolesToMessages () {
      if (!this.participants?.length) {
        return []
      }
      const rolesDictionary = {};
      this.participants.forEach((participant) => {
        rolesDictionary[participant?.peerChatId] = participant;
      });
      return this.messages.map((message) => {
        const role = rolesDictionary[message.user._id];
        const updatedMessage = merge({}, message);
        let isCurrentSelfChat = false;
        if (role) {
          updatedMessage.role = role?.role || null;
          updatedMessage.nickName = role?.nickName || null;
          isCurrentSelfChat = role?.peerChatId === this.user?.peerChatId;
        } else {
          updatedMessage.role = null;
          updatedMessage.nickName = role?.nickName || null;
        }
        updatedMessage.typeRoleChat = this.getTypeRoleChat(role?.role, isCurrentSelfChat) || null
        updatedMessage.typeRoleChatText = this.getTypeRoleChat(role?.role, isCurrentSelfChat) === TYPE_ROLE_CHAT.BUYER
          ? this.$t('chat.buyer') : this.$t('chat.seller')
        return updatedMessage;
      });
    },
    mapRolesToMessagesWithStatusOrder () {
      if ([ORDER_STATUS.COMPLETED, ORDER_STATUS.CANCELLED].includes(this.order?.status) && this.user?.type !== USER_ROLE.SUPER_ADMIN) {
        return this.mapRolesToMessages.filter((message) => {
          return message.user?.type !== CHAT_USER_TYPE.USER
        });
      }
      return this.mapRolesToMessages
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
    getTypeRoleChat (roleChat, isCurrentSelfChat) {
      if (roleChat) {
        return this.getTypeChatWithRole(roleChat)
      }
      if (this.user?.type === USER_ROLE.USER) {
        return (this.orderType === ORDER_TYPE.BUY && isCurrentSelfChat) ||
        (this.orderType === ORDER_TYPE.SELL && !isCurrentSelfChat)
          ? TYPE_ROLE_CHAT.BUYER
          : TYPE_ROLE_CHAT.SELLER
      }
      if ([USER_ROLE.MERCHANT_OPERATOR, USER_ROLE.MERCHANT_SUPPORTER].includes(this.user?.type)) {
        return (this.orderType === ORDER_TYPE.BUY && isCurrentSelfChat) ||
        (this.orderType === ORDER_TYPE.SELL && !isCurrentSelfChat)
          ? TYPE_ROLE_CHAT.SELLER
          : TYPE_ROLE_CHAT.BUYER
      }
      return null
    },
    getTypeChatWithRole (role) {
      const roleUpperCase = role.toUpperCase()
      if (roleUpperCase === USER_ROLE.USER) {
        return (this.orderType === ORDER_TYPE.BUY) ? TYPE_ROLE_CHAT.BUYER : TYPE_ROLE_CHAT.SELLER
      }
      if ([USER_ROLE.MERCHANT_OPERATOR, USER_ROLE.MERCHANT_SUPPORTER].includes(roleUpperCase)) {
        return (this.orderType === ORDER_TYPE.BUY) ? TYPE_ROLE_CHAT.SELLER : TYPE_ROLE_CHAT.BUYER
      }
      return null
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
