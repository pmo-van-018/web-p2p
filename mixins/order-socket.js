import { NAME_EVENT_WS_LISTEN } from '@/config/constant'
import { mapActions } from 'vuex'
import { events } from '@/constants/socket-events';
import { ORDER_SELL_STEP } from '@/resources/transfer-to-seller/index.js';

export default {
  mounted () {
    this.$socket.client.on(NAME_EVENT_WS_LISTEN, this.handleSocketEvent)
  },
  beforeDestroy () {
    this.$socket.client.off(NAME_EVENT_WS_LISTEN, this.handleSocketEvent)
  },
  methods: {
    ...mapActions('end-user', ['setBuyInfo', 'setSubmitHashTime']),
    ...mapActions('statistics', ['setStatistic']),
    handleSocketEvent (data) {
      const dataTransferred = JSON.parse(data);
      if (dataTransferred.event === events.objects.user) {
        this.setStatistic(dataTransferred)
      }
      if (dataTransferred.event === events.objects.order) {
        this.setBuyInfo(dataTransferred)
        if (dataTransferred.step === ORDER_SELL_STEP.SELL_SENDING_CRYPTO_FAILED.name) {
          this.setSubmitHashTime(dataTransferred.retryTime)
        }
      }
      if (dataTransferred.event === events.objects.appeal &&
        (dataTransferred.action === events.actions.appeal.onExtraTimeBuyAppeal ||
          dataTransferred.action === events.actions.appeal.onExtraTimeSellAppeal)
      ) {
        this.setBuyInfo(dataTransferred.order)
      }
    }
  }
};
