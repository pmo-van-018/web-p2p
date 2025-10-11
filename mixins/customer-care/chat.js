import { CHAT_MESSAGE_TYPE, CHAT_WS_EVENT, FILE_SIZE_LIMIT_CHAT } from '@/constants/chat'
import axios from 'axios';
import CHAT_API from '@/api/chat'
import { mapActions, mapState } from 'vuex'
import { RESPONSE_ICON } from '@/resources/message'
import { USER_ROLE } from '@/config/constant'
import { REGEX_VALID_FILE_ATTACHMENT_CHAT, REGEX_VALID_FILE_IMAGE } from '@/constants'
import { formatFile } from '@/helper/file';

export default {
  data () {
    return {
      isVisibleArrowDown: false,
      isScrollDown: true,
      prevSavedRoomId: '',
      participants: []
    }
  },
  computed: {
    ...mapState('user', ['user']),
    ...mapState('chat-support-request', [
      'isVisibleChat',
      'messages',
      'lastMsgId',
      'chatNoti',
      'socketListeners',
      'resolvedSupportRequest'
    ]),
    ...mapState('chat', ['isErrorRateLimit']),
    visibleChatButton () {
      return this.user?.type === USER_ROLE.USER && !this.isVisibleChat && this.$device.isDesktop
    },
    isVisibleChatInput () {
      if (this.user?.type === USER_ROLE.SUPER_ADMIN) {
        return false
      }
      if (this.user?.type === USER_ROLE.ADMIN_SUPPORTER) {
        return this.pendingRequest && !this.resolvedSupportRequest
      }
      return this.user?.type === USER_ROLE.USER && !this.resolvedSupportRequest
    }
  },
  watch: {
    roomId: {
      async handler (newRoomId, oldRoomId) {
        if (newRoomId !== oldRoomId) {
          await this.$_chatMixin_onInitChat()
        }
      },
      immediate: true
    }
  },
  mounted () {
    if (this.isVisibleChat) {
      this.setErrorRateLimit(false)
    }
  },
  methods: {
    ...mapActions('chat-support-request', [
      'getMessageHistories',
      'setMessage',
      'toggleVisibleChat',
      'setVisibleChat',
      'resetStateChat',
      'getLastMessage',
      'setLastMessageId',
      'setChatNoti',
      'setReadMessageInList'
    ]),
    ...mapActions('chat-support-request', [
      'getSignedCookie'
    ]),
    ...mapActions('chat', ['setErrorRateLimit']),
    ...mapActions('modal-response', ['showResponseModal']),
    async $_chatMixin_onInitChat () {
      if (this.roomId && this.roomId !== this.prevSavedRoomId) {
        this.prevSavedRoomId = this.roomId
        if (!this.socketListeners?.includes(this.roomId)) {
          this.$socketChat.emit(CHAT_WS_EVENT.JOIN_ROOM, {
            roomId: this.roomId
          })
          if (!this.messages.length && this.requestTypeText) {
            this.onInputMessage(this.requestTypeText)
          }
          this.$socketChat.on(CHAT_WS_EVENT.MESSAGE, this.onListenEventMessage);
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
          this.getLastMessage(this.roomId)
        ])
        this.compareLastMessage()
      }
    },
    onListenEventMessage ({ data }) {
      if (data.room === this.roomId) {
        this.setMessage(data)
      }
      if (this.user?.peerChatId !== data.user?._id && !this.isVisibleChat) {
        this.setReadMessageInList({
          roomId: data.room,
          seen: false
        })
        if (data.room === this.roomId) {
          this.setChatNoti()
        }
      }
    },
    compareLastMessage () {
      if (this.messages.length) {
        const msgId = this.messages[this.messages.length - 1]?._id
        if (msgId !== this.lastMsgId) {
          this.setChatNoti()
        }
      }
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
    async $_chatMixin_onSendMessageFile (file) {
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
      const { fields, preSignedUrl, redirectUrl } = await this.$_chatMixin_onPreSignedUrl(file.name);
      if (fields && Object.keys(fields).length) {
        const isFileUploaded = await this.$_chatMixin_onUploadImageS3(preSignedUrl, { ...fields, file });
        if (isFileUploaded) {
          this.$socketChat.emit(CHAT_WS_EVENT.MESSAGE, {
            roomId: this.roomId,
            type: CHAT_MESSAGE_TYPE.ATTACHMENT,
            data: redirectUrl
          });
          this.isScrollDown = true
        }
      }
    },
    async $_chatMixin_onPreSignedUrl (fileName) {
      try {
        const response = await this.$axios.post(`${CHAT_API.PRESIGNED_URL(this.roomId)}`, {
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
    }
  }
}
