import { CHAT_WS_EVENT } from '@/constants/chat'
import { mapActions, mapState } from 'vuex'
export default {
  computed: {
    ...mapState('user', ['user']),
    ...mapState('chat-support-request', ['lastMessages'])
  },
  methods: {
    ...mapActions('chat-support-request', ['setReadMessageInList', 'setMessage', 'setSocketListeners', 'setChatNoti']),
    initSocketList (roomIds) {
      if (this.$socketChat) {
        roomIds.forEach((roomId) => {
          this.$socketChat.emit(CHAT_WS_EVENT.JOIN_ROOM, {
            roomId
          })
        })
        this.$socketChat.on(CHAT_WS_EVENT.MESSAGE, this.onListenEventMessage);
        this.setSocketListeners(roomIds)
      }
    },
    leaveRoomSocketList (roomIds) {
      if (this.$socketChat) {
        roomIds.forEach((roomId) => {
          this.$socketChat.emit(CHAT_WS_EVENT.LEAVE_ROOM, {
            roomId
          })
        })
        this.$socketChat.off(CHAT_WS_EVENT.MESSAGE);
        this.$socketChat.removeListener(CHAT_WS_EVENT.MESSAGE)
      }
    },
    onListenEventMessage ({ data }) {
      if (data?.room === this.roomId) {
        this.setMessage(data)
      }
      if (this.user?.peerChatId !== data.user?._id) {
        this.setReadMessageInList({
          roomId: data.room,
          seen: false
        })
        if (data?.room === this.roomId) {
          this.setChatNoti()
        }
      }
    }
  }
}
