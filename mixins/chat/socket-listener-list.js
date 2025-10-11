import { CHAT_WS_EVENT } from '@/constants/chat'
import { mapActions, mapState } from 'vuex'
import { ORDER_STATUS } from '@/config/constant';
import last from 'lodash/last';
export default {
  computed: {
    ...mapState('user', ['user']),
    ...mapState('chat', ['lastMessages', 'order', 'messages', 'socketListeners']),
    mapMessages () {
      return this.messages.map(e => e.room?._id)
    },
    lastRoomIdMessages () {
      return last(this.messages)?.room
    }
  },
  watch: {
    order: {
      handler (newOrder, oldOrder) {
        if (newOrder?.roomId) {
          if ([ORDER_STATUS.COMPLETED, ORDER_STATUS.CANCELLED].includes(newOrder?.status)) {
            this.$socketChat.emit(CHAT_WS_EVENT.LEAVE_ROOM, {
              roomId: newOrder?.roomId
            })
            this.removeAnItemInLastMessages(newOrder?.roomId)
          }
        }
      }
    }
  },
  methods: {
    ...mapActions('chat', ['setReadMessageInList', 'setMessage', 'setSocketListeners', 'setChatNoti', 'removeAnItemInLastMessages']),
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
      const isSameRoom = data.room === (this.order?.roomId);
      const isLastRoom = data.room === this.lastRoomIdMessages || data.room === this.lastRoomIdMessages?._id;
      const isDifferentUser = this.user?.peerChatId !== data.user?._id
      if (isSameRoom && isLastRoom) {
        this.setMessage(data)
      }

      if (isDifferentUser) {
        this.setReadMessageInList({ roomId: data.room, seen: false })
        if (isSameRoom || isLastRoom) {
          this.setChatNoti()
        }
      }
    }
  }
}
