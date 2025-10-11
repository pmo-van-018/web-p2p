<template>
  <div class="wrapper-message" :class="{'received' : received }">
    <div class="wrapper-message__container">
      <div
        v-if="received && nameTextColor !== ''"
        class="wrapper-message__info"
        :style="{'color': nameTextColor }"
      >
        <strong>{{ message.typeRoleChatText }}</strong> <span v-if="message.nickName">({{ message.nickName }})</span>
        <template v-if="roleText">
          <div class="dots" :style="{'backgroundColor': nameTextColor }" />
          <span :style="{'color': nameTextColor }" class="wrapper-message__info-role">{{ roleText }}</span>
        </template>
      </div>
      <template v-else-if="roleOperationText">
        <div class="wrapper-message__role-operation">{{ roleOperationText }}</div>
      </template>
      <div class="wrapper-message__content">
        <slot></slot>
      </div>
      <div v-if="createdAt" class="wrapper-message__footer">
        <div class="wrapper-message__date">{{ createdAt }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import dayjs from 'dayjs'
import { REGEX_VALID_URL } from '@/constants'

export default {
  props: {
    message: {
      type: Object,
      required: true
    },
    received: {
      type: Boolean,
      default: false
    },
    nameTextColor: {
      type: String,
      default: ''
    },
    roleText: {
      type: String,
      default: ''
    },
    roleOperationText: {
      type: String,
      default: ''
    }
  },
  computed: {
    createdAt () {
      return dayjs(this.message?.createdAt).format('HH:mm')
    },
    isValidUrl () {
      return this.message?.msg?.match(REGEX_VALID_URL);
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/chat/message/wrapper-message.scss">
</style>
