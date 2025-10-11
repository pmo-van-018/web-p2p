import CHAT_API from '@/api/chat';
import { ORDER_STATUS, USER_ROLE } from '@/config/constant';
import { REGEX_VALID_FILE_ATTACHMENT_CHAT, REGEX_VALID_FILE_IMAGE } from '@/constants';
import { CHAT_MESSAGE_TYPE, CHAT_WS_EVENT, FILE_SIZE_LIMIT_CHAT } from '@/constants/chat';
import { BUY_ORDER_STEPS, SELL_ORDER_STEPS } from '@/constants/orders';
import { RESPONSE_ICON } from '@/resources/message';
import { ORDER_TYPE } from '@/resources/order-type.js';
import axios from 'axios';
import { mapActions, mapState } from 'vuex';
import { formatFile } from '@/helper/file';
import last from 'lodash/last';

export default {
  data () {
    return {
      isVisibleArrowDown: false,
      isScrollDown: true,
      prevSavedRoomId: '',
      participants: [],
      firstMessage: '',
      isFirstFileSending: true,
      isFocusInputMessage: false
    }
  },
  computed: {
    ...mapState('user', ['user']),
    ...mapState('chat', [
      'isVisibleChat',
      'order',
      'isVisibleCaution',
      'errorSignCookie',
      'messages',
      'lastMsgId',
      'chatNoti',
      'socketListeners',
      'lastMessages',
      'isErrorRateLimit'
    ]),
    ...mapState({
      orderChat: state => state.chat.order
    }),
    roomId () {
      return this.orderChat?.roomId
    },
    orderId () {
      // TODO: need to improve when refactor order module
      return this.orderChat?.orderId
    },
    isReadMessage () {
      if (!this.lastMessages.length) {
        return true
      }
      return this.lastMessages.some(message => message.roomId === this.roomId && message.seen)
    },
    hasReadMessage () {
      return this.user?.type === USER_ROLE.MERCHANT_MANAGER || this.isReadMessage || !this.order?.roomId;
    },
    visibleOperationInputChat () {
      // NOTE: currently, we don't allow manager chatting due to business
      return ![
        ORDER_STATUS.COMPLETED,
        ORDER_STATUS.CANCELLED
      ].includes(this.orderChat?.status) && this.errorSignCookie === null && this.user?.type !== USER_ROLE.MERCHANT_MANAGER
    },
    visibleUserInputChat () {
      return ![
        ORDER_STATUS.COMPLETED,
        ORDER_STATUS.CANCELLED
      ].includes(this.orderChat?.status) && this.errorSignCookie === null
    },
    visibleChatButton () {
      return this.user?.type === USER_ROLE.USER && !this.isVisibleChat && this.$device.isDesktop
    },
    isMerchantOperator () {
      return this.user?.type === USER_ROLE.MERCHANT_OPERATOR
    },
    btnExpandText () {
      return this.orderChat?.type === ORDER_TYPE.BUY ? this.$t('chat.chat_with_seller') : this.$t('chat.chat_with_buyer')
    },
    isCreatedRoomChat () {
      return !this.roomId && [
        BUY_ORDER_STEPS.BUY_NOTIFY_SENT_FIAT_BY_USER,
        BUY_ORDER_STEPS.BUY_NOTIFY_SENT_FIAT_BY_USER_DEAL_TIME,
        SELL_ORDER_STEPS.SELL_SENDING_CRYPTO_SUCCESS,
        SELL_ORDER_STEPS.SELL_SENDING_CRYPTO_SUCCESS_DEAL_TIME
      ].includes(this.orderChat?.step)
    }
  },
  watch: {
    roomId: {
      handler (newRoomId, oldRoomId) {
        if (newRoomId && newRoomId !== oldRoomId) {
          this.$_chatMixin_onInitChat()
        }
      },
      immediate: true
    }
  },
  beforeDestroy () {
    this.setVisibleChat(false)
    this.setErrorRateLimit(false)
  },
  methods: {
    ...mapActions('chat', [
      'getSignedCookie',
      'getMessageHistories',
      'setMessage',
      'toggleVisibleChat',
      'setVisibleCaution',
      'setVisibleChat',
      'resetStateChat',
      'getLastMessage',
      'setLastMessageId',
      'setChatNoti',
      'setOrder',
      'setReadMessageInList',
      'setErrorRateLimit'
    ]),
    ...mapActions('modal-response', ['showResponseModal']),
    async onCreateOrderRoomChat (orderId) {
      try {
        const response = await this.$axios.$post(CHAT_API.CREATE_ORDER_ROOM_CHAT, {
          orderId
        })
        return response?.data?.id
      } catch (error) {
        console.error(error)
      }
      return null
    },
    async handleInputMessage (value) {
      if (this.isCreatedRoomChat && this.isMerchantOperator) {
        try {
          const roomId = await this.onCreateOrderRoomChat(this.orderId)
          if (roomId) {
            this.setOrder({ ...this.order, roomId })
            this.setReadMessageInList({ roomId: this.roomId, seen: true })
            this.onInputMessage(value)
            this.setVisibleChat(true)
          }
        } catch (error) {
          console.error(error);
        }
      } else {
        this.firstMessage = ''
        this.onInputMessage(value)
      }
    },
    async $_chatMixin_onInitChat () {
      if (this.roomId && this.roomId !== this.prevSavedRoomId) {
        this.prevSavedRoomId = this.roomId
        if (!this.socketListeners?.includes(this.roomId)) {
          this.$socketChat.emit(CHAT_WS_EVENT.JOIN_ROOM, {
            roomId: this.roomId
          })
          this.$socketChat.on(CHAT_WS_EVENT.MESSAGE, this.onListenEventMessage);
          this.$socketChat.on(CHAT_WS_EVENT.JOIN_ROOM, this.$_chatMixin_getAppealParticipants);
        }
        await Promise.all([
          this.getSignedCookie({
            roomId: this.roomId,
            role: this.user?.type
          }),
          this.getMessageHistories({
            roomId: this.roomId,
            role: this.user?.type
          })
        ])
        await Promise.all([
          this.$_chatMixin_getAppealParticipants(),
          this.getLastMessage(this.roomId)
        ])
        this.compareLastMessage()
      }
    },
    onListenEventMessage ({ data }) {
      const lastRoom = last(this.messages)?.room
      const isSameRoom = data.room === (this.roomId);
      const isLastRoom = data.room === lastRoom || data.room === lastRoom?._id;

      if (isSameRoom && isLastRoom) {
        this.setMessage(data);
      }

      const isDifferentUserAndNotVisible = this.user?.peerChatId !== data.user?._id && !this.isFocusInputMessage;
      if (isDifferentUserAndNotVisible) {
        this.setReadMessageInList({ roomId: data.room, seen: false });
        if (isSameRoom && isLastRoom) {
          this.setChatNoti();
        }
      }
    },
    compareLastMessage () {
      if (this.messages.length) {
        const msgId = this.messages[this.messages.length - 1]?._id
        const roomId = this.messages[this.messages.length - 1]?.room?._id
        if (msgId !== this.lastMsgId) {
          this.setChatNoti()
          if (!this.isFirstFileSending) {
            this.setReadMessageInList({
              roomId,
              seen: false
            })
          }
        } else {
          this.setReadMessageInList({
            roomId,
            seen: true
          })
        }
      }
    },
    onCloseCaution () {
      this.setVisibleCaution(false)
    },
    onScrollDown () {
      this.isScrollDown = true
    },
    onInputMessage (value) {
      this.$socketChat.emit(CHAT_WS_EVENT.MESSAGE, {
        roomId: this.roomId,
        type: CHAT_MESSAGE_TYPE.RAW,
        data: value
      })
      this.isScrollDown = true
    },
    async $_chatMixin_getAppealParticipants () {
      try {
        let getParticipantFunc = CHAT_API.USER_PARTICIPANTS
        if ([USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN_SUPPORTER].includes(this.user?.type)) {
          getParticipantFunc = CHAT_API.ADMIN_PARTICIPANTS
        }
        if ([USER_ROLE.MERCHANT_MANAGER, USER_ROLE.MERCHANT_OPERATOR, USER_ROLE.MERCHANT_SUPPORTER].includes(this.user?.type)) {
          getParticipantFunc = CHAT_API.MERCHANT_PARTICIPANTS
        }
        // TODO: remove 'this.orderChat?.orderRefId' when integrate new order module
        const { data } = await this.$axios.$get(getParticipantFunc(this.orderChat?.orderRefId || this.orderChat?.id))
        if (data) {
          this.participants = data.participants;
        }
      } catch (err) {
        console.error(err)
      }
    },
    async $_chatMixin_onSendMultipleFiles (files) {
      const promise = files.map(async (file) => {
        const { fields, preSignedUrl, redirectUrl } = await this.$_chatMixin_onPreSignedUrl(file.name);
        if (fields) {
          const isFileUploaded = await this.$_chatMixin_onUploadImageS3(preSignedUrl, { ...fields, file });
          if (isFileUploaded) {
            const socketChatMessage = {
              roomId: this.roomId,
              type: CHAT_MESSAGE_TYPE.ATTACHMENT,
              data: redirectUrl
            };
            this.$socketChat.emit(CHAT_WS_EVENT.MESSAGE, socketChatMessage);
          }
        }
      });
      await Promise.allSettled(promise);
    },
    async $_chatMixin_sendFileFirstMessage (file) {
      if (this.isCreatedRoomChat && this.isMerchantOperator) {
        const roomId = await this.onCreateOrderRoomChat(this.orderId)
        if (roomId) {
          this.setOrder({ ...this.orderChat, roomId })
          await this.$_chatMixin_onSendMessageFile(file, roomId)
          this.setReadMessageInList({ roomId, seen: true })
          this.isFirstFileSending = true
        }
      } else {
        this.isFirstFileSending = false
        await this.$_chatMixin_onSendMessageFile(file, this.roomId)
      }
    },
    async $_chatMixin_onSendMessageFile (file, roomId) {
      if (!(REGEX_VALID_FILE_IMAGE.test(file.name) || REGEX_VALID_FILE_ATTACHMENT_CHAT.test(file.name))) {
        this.showResponseModal({
          title: '',
          content: this.$t('modal.content.upload_file_failed'),
          description: this.$t('modal.message.upload_file_invalid'),
          icon: RESPONSE_ICON.CONNECT_ERROR_WALLET,
          show: true
        })
        return;
      }
      if (file.size > FILE_SIZE_LIMIT_CHAT) {
        this.showResponseModal({
          title: '',
          content: this.$t('modal.content.upload_file_failed'),
          description: this.$t('modal.message.upload_file_failed'),
          icon: RESPONSE_ICON.CONNECT_ERROR_WALLET,
          show: true
        })
        return;
      }
      file = formatFile(file);
      const { fields, preSignedUrl, redirectUrl } = await this.$_chatMixin_onPreSignedUrl(file.name, roomId);
      if (fields) {
        const isFileUploaded = await this.$_chatMixin_onUploadImageS3(preSignedUrl, { ...fields, file });
        if (isFileUploaded) {
          this.$socketChat.emit(CHAT_WS_EVENT.MESSAGE, {
            roomId,
            type: CHAT_MESSAGE_TYPE.ATTACHMENT,
            data: redirectUrl
          });
          this.isScrollDown = true
        }
      }
    },
    async $_chatMixin_onPreSignedUrl (fileName, roomId) {
      try {
        const response = await this.$axios.post(`${CHAT_API.PRESIGNED_URL(roomId)}`, {
          fileName
        });
        const { statusCode, data } = response.data;
        if (statusCode === 201 && data) {
          const { fields } = data;
          return {
            preSignedUrl: data.preSingedUrl, // update preSingedUrl to preSignedUrl in api
            redirectUrl: data.redirectUrl,
            fields
          };
        }
        if (statusCode === 5993) {
          this.setErrorRateLimit(true)
          return
        }
      } catch (error) {
        console.error(error);
        return {
          preSignedUrl: '',
          redirectUrl: '',
          fields: {}
        };
      }
    },
    async $_chatMixin_onUploadImageS3 (url, fields) {
      try {
        const formData = new FormData();
        for (const key in fields) {
          formData.append(key, fields[key]);
        }
        await axios.post(url, formData);
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    $_chatMixin_onFocusInput () {
      if (this.user?.type !== USER_ROLE.SUPER_ADMIN && this.messages.length) {
        const msgId = this.messages[this.messages.length - 1]?._id
        this.isFocusInputMessage = true
        if (msgId !== this.lastMsgId) {
          this.$socketChat.emit(CHAT_WS_EVENT.SEEN_MESSAGE, {
            roomId: this.roomId,
            msgId
          });
          this.setLastMessageId(msgId)
          this.setReadMessageInList({
            roomId: this.roomId,
            seen: true
          })
        }
      }
    },
    $_chatMixin_onBlurInput () {
      this.isFocusInputMessage = false
    }
  }
}
