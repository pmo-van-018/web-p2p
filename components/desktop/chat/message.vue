<template>
  <div
    class="message"
    :class="{
      'received': received,
      'system': isSystemType,
    }"
  >
    <div
      class="message__wrapper"
    >
      <div class="message__content">
        <system-message
          v-if="isSystemType"
          :message="message"
          :text="systemMessageText"
          :date="createdAt"
          :reverse-system="isMessageCurrentAdmin"
        />
        <image-message
          v-else-if="isValidMessageHasLinkImage"
          :message="message"
          :received="received"
          :date="createdAt"
          :role-text="roleText"
          :sign-cookie-query="signCookieQuery"
          :role-operation-text="roleOperatorAndSupporterText"
          :name-text-color="nameTextColor"
        />
        <attachment-message
          v-else-if="isValidFileAttachment"
          :message="message"
          :received="received"
          :date="createdAt"
          :role-text="roleText"
          :sign-cookie-query="signCookieQuery"
          :role-operation-text="roleOperatorAndSupporterText"
          :name-text-color="nameTextColor"
        />
        <text-message
          v-else
          :message="message"
          :received="received"
          :role-text="roleText"
          :role-operation-text="roleOperatorAndSupporterText"
          :name-text-color="nameTextColor"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { CHAT_MESSAGE_TYPE, CHAT_USER_TYPE, TYPE_ROLE_CHAT } from '@/constants/chat'
import { BUY_ORDER_STEPS, SELL_ORDER_STEPS } from '@/constants/orders'
import { REGEX_VALID_FILE_ATTACHMENT_CHAT, REGEX_VALID_URL_IMAGE } from '@/constants'
import { USER_ROLE } from '@/config/constant'
import dayjs from 'dayjs'

export default {
  components: {
    TextMessage: () => import('~/components/desktop/chat/message/text-message.vue'),
    SystemMessage: () => import('~/components/desktop/chat/message/system-message.vue'),
    AttachmentMessage: () => import('~/components/desktop/chat/message/attachment-message.vue'),
    ImageMessage: () => import('~/components/desktop/chat/message/image-message.vue')
  },
  props: {
    message: {
      type: Object,
      required: true
    },
    visibleRoleText: {
      type: Boolean,
      default: true
    },
    signCookieQuery: {
      type: String,
      default: ''
    }
  },
  computed: {
    attachment () {
      return this.message?.type === CHAT_MESSAGE_TYPE.ATTACHMENT
    },
    ...mapState('user', ['user']),
    received () {
      if ([USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN_SUPPORTER].includes(this.userType)) {
        return !this.admin
      }
      return this.peerChatId !== this.message?.user?._id && !this.isRoleOperation
    },
    isValidMessageHasLinkImage () {
      return this.attachment && !!this.message?.fileUpload?.completedUrl?.match(REGEX_VALID_URL_IMAGE)
    },
    isValidFileAttachment () {
      return this.attachment && !!this.message?.fileUpload?.completedUrl?.match(REGEX_VALID_FILE_ATTACHMENT_CHAT)
    },
    bot () {
      return this.message?.user?.type === CHAT_USER_TYPE.BOT
    },
    admin () {
      return this.message?.user?.type === CHAT_USER_TYPE.ADMIN
    },
    system () {
      return this.message?.user?.type === CHAT_USER_TYPE.SYSTEM
    },
    isSystemType () {
      if ([USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN_SUPPORTER].includes(this.user?.type)) {
        return this.system || this.bot
      }
      return this.system || this.bot || this.admin
    },
    isRoleOperation () {
      return [USER_ROLE.MERCHANT_OPERATOR, USER_ROLE.MERCHANT_SUPPORTER].includes(this.messageRoleType)
    },
    roleOperatorAndSupporterText () {
      if (this.isRoleOperation) {
        return this.messageRoleType === USER_ROLE.MERCHANT_OPERATOR
          ? this.$t('chat.merchant_operator') : this.$t('chat.merchant_supporter')
      }
      return ''
    },
    peerChatId () {
      return this.user?.peerChatId || ''
    },
    createdAt () {
      return dayjs(this.message?.createdAt).format('HH:mm')
    },
    userType () {
      return this.user?.type
    },
    messageRoleType () {
      return this.message?.role?.toUpperCase()
    },
    isMessageCurrentAdmin () {
      return this.admin && this.peerChatId === this.message?.user?._id
    },
    roleText () {
      if (this.userType === USER_ROLE.SUPER_ADMIN && this.received && this.visibleRoleText) {
        return this.messageRoleType === USER_ROLE.USER ? this.$t('chat.user') : this.$t('chat.merchant')
      }
      return ''
    },
    nameTextColor () {
      switch (this.message?.typeRoleChat) {
        case TYPE_ROLE_CHAT.BUYER:
        case TYPE_ROLE_CHAT.SUPPORTER_CHAT: {
          return '#45B957'
        }
        case TYPE_ROLE_CHAT.SELLER: {
          return '#EA290E'
        }
        default: {
          return ''
        }
      }
    },
    systemMessageText () {
      if (this.bot || this.admin) {
        return this.message.msg
      }
      if (this.system) {
        const {
          BUY_ORDER_CREATED_BY_USER,
          BUY_ORDER_CREATED_BY_USER_DEAL_TIME,
          BUY_NOTIFY_SENT_FIAT_BY_USER,
          BUY_NOTIFY_SENT_FIAT_BY_USER_DEAL_TIME,
          BUY_CONFIRMED_FIAT_BY_MERCHANT,
          BUY_APPEAL_SENT_WHILE_CONFIRMING_FIAT_BY_MERCHANT,
          BUY_APPEAL_SENT_SENDING_CRYPTO_FAILED,
          BUY_SENDING_CRYPTO_SUCCESS,
          BUY_ORDER_CANCELLED_BY_USER,
          BUY_ORDER_CANCELLED_BY_SYSTEM
        } = BUY_ORDER_STEPS
        const {
          SELL_ORDER_CREATED_BY_USER,
          SELL_SENDING_CRYPTO_SUCCESS,
          SELL_SENDING_CRYPTO_SUCCESS_DEAL_TIME,
          SELL_APPEAL_SENT_FIAT_NOT_RECEIVED_BY_USER,
          SELL_CONFIRMED_FIAT_BY_USER,
          SELL_ORDER_CANCELLED_BY_USER,
          SELL_ORDER_CANCELLED_BY_SYSTEM
        } = SELL_ORDER_STEPS
        return {
          [BUY_ORDER_CREATED_BY_USER]: 'Giao dịch được tạo thành công',
          [BUY_ORDER_CREATED_BY_USER_DEAL_TIME]: 'Người mua đã liên hệ với người bán',
          [BUY_NOTIFY_SENT_FIAT_BY_USER]: 'Người mua đã thanh toán tiền pháp định cho người bán, vui lòng chờ người bán xác nhận.',
          [BUY_NOTIFY_SENT_FIAT_BY_USER_DEAL_TIME]: 'Người mua đã liên hệ với người bán',
          [BUY_CONFIRMED_FIAT_BY_MERCHANT]: 'Người bán đã nhận được thanh toán từ người mua. Vui lòng chờ người bán chuyển tiền mã hóa',
          [BUY_APPEAL_SENT_WHILE_CONFIRMING_FIAT_BY_MERCHANT]: 'Giao dịch có khiếu nại',
          [BUY_APPEAL_SENT_SENDING_CRYPTO_FAILED]: 'Giao dịch có khiếu nại',
          [BUY_SENDING_CRYPTO_SUCCESS]: 'Tiền mã hóa đã được chuyển vào địa chỉ ví của người mua. Giao dịch hoàn thành.',
          [BUY_ORDER_CANCELLED_BY_USER]: 'Giao dịch đã bị hủy. Vui lòng liên hệ bộ phận CSKH nếu có thắc mắc.',
          [BUY_ORDER_CANCELLED_BY_SYSTEM]: 'Giao dịch đã bị hủy. Vui lòng liên hệ bộ phận CSKH nếu có thắc mắc.',
          [SELL_ORDER_CREATED_BY_USER]: 'Giao dịch được tạo thành công',
          [SELL_SENDING_CRYPTO_SUCCESS]: 'Người bán đã chuyển tiền mã hóa vào địa chỉ ví của người mua. Vui lòng chờ người mua xác nhận.',
          [SELL_SENDING_CRYPTO_SUCCESS_DEAL_TIME]: 'Người bán đã liên hệ với người mua',
          [SELL_APPEAL_SENT_FIAT_NOT_RECEIVED_BY_USER]: 'Giao dịch có khiếu nại',
          [SELL_APPEAL_SENT_FIAT_NOT_RECEIVED_BY_USER]: 'Giao dịch có khiếu nại',
          [SELL_CONFIRMED_FIAT_BY_USER]: 'Người bán đã nhận được thanh toán từ người mua. Giao dịch hoàn thành.',
          [SELL_ORDER_CANCELLED_BY_USER]: 'Giao dịch đã bị hủy. Vui lòng liên hệ hỗ trợ khách hàng nếu có thắc mắc.',
          [SELL_ORDER_CANCELLED_BY_SYSTEM]: 'Giao dịch đã bị hủy. Vui lòng liên hệ hỗ trợ khách hàng nếu có thắc mắc.'
        }[this.message.msg] || ''
      }
      return ''
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/chat/message.scss">
</style>
