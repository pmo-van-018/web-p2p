<template>
  <div class="chat-header">
    <div class="chat-header__container">
      <div class="chat-header__inner">
        <div class="d-flex align-items-center">
          <svg-icon
            icon="read-message"
            class="chat-header__icon-chat"
          />
          <div class="d-flex align-items-center flex-column">
            <div class="chat-header__text">Tin nhắn giao dịch</div>
          </div>
        </div>
      </div>
      <div class="chat-header__inner">
        <span v-show="isVisibleIconCaution" class="icon-info" @click="$emit('on-show-caution')" />
        <div class="chat-header__hide" @click="$emit('on-hide')">
          <img v-if="isDarkMode" src="/assets/images/common/hide-chat.svg" alt="Icon">
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <rect
              x="2.66675"
              y="7.33594"
              width="10.6667"
              height="1.33333"
              rx="0.666667"
              fill="#3F3F46"
            />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import dayjs from 'dayjs'
import { ORDER_TYPE } from '@/resources/order-type'
import { FULL_DATE_FORMAT } from '@/config/constant'
import darkMModeMixin from '@/mixins/dark-mode.js';

export default {
  components: {
    SvgIcon: () => import('~/components/common/svg-icon/index.vue')
  },
  mixins: [darkMModeMixin],
  props: {
    isVisibleIconCaution: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState('chat', ['order']),
    orderRefId () {
      return this.order?.orderRefId || ''
    },
    typeClass () {
      return this.order?.type === ORDER_TYPE.BUY ? 'buy' : 'sell'
    },
    createdAt () {
      return dayjs(this.order?.createdAt).format(FULL_DATE_FORMAT)
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/chat/chat-header.scss">
</style>
