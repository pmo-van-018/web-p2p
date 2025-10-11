<template>
  <wrapper-message
    :message="message"
    :received="received"
    :role-text="roleText"
    :role-operation-text="roleOperationText"
    :name-text-color="nameTextColor"
  >
    <div class="text-message__content" v-html="normalizeMessage" />
  </wrapper-message>
</template>
<script>
import dayjs from 'dayjs'
import { REGEX_URL_IN_TEXT, REGEX_VALID_URL } from '@/constants'

export default {
  components: {
    WrapperMessage: () => import('~/components/desktop/chat/message/wrapper-message.vue')
  },
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
    },
    normalizeMessage () {
      return this.message.msg.replace(REGEX_URL_IN_TEXT, (url) => {
        return `<a href="${url}" target="_blank">${url}</a>`;
      });
    }
  }
}
</script>
<style scoped lang="scss">
.text-message {
  &__content{
    white-space: pre-line;
  }
}
</style>
