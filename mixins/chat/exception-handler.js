import { CHAT_WS_EVENT } from '@/constants/chat';
import { mapActions, mapState } from 'vuex';

export default {
  computed: {
    ...mapState('chat', ['isErrorRateLimit']),
    ...mapState('user', ['user'])
  },
  mounted () {
    if (this.user) {
      this.$socketChat.on(CHAT_WS_EVENT.MESSAGE, this.onListenEventMessageClearError);
      this.$socketChat.on(CHAT_WS_EVENT.EXCEPTION, this.onListenEventExceptionMessage);
    }
  },
  beforeDestroy () {
    if (this.user) {
      this.$socketChat.off(CHAT_WS_EVENT.EXCEPTION);
    }
  },
  watch: {
    isErrorRateLimit: {
      handler (value) {
        if (value) {
          setTimeout(() => {
            this.setErrorRateLimit(false)
          }, 10000)
        }
      }
    }
  },
  methods: {
    ...mapActions('chat', ['setErrorRateLimit']),
    onListenEventMessageClearError () {
      if (this.isErrorRateLimit) {
        this.setErrorRateLimit(false)
      }
    },
    onListenEventExceptionMessage (data) {
      const { statusCode } = data
      if (statusCode === 5993) {
        this.setErrorRateLimit(true)
      }
    }
  }
}
