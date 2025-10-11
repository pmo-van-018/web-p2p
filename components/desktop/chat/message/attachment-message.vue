<template>
  <wrapper-message
    :message="message"
    :received="received"
    :role-text="roleText"
    :role-operation-text="roleOperationText"
    :name-text-color="nameTextColor"
  >
    <div class="attachment-message" :class="{'received' : received }">
      <div class="attachment-message__wrapper">
        <div class="attachment-message__container">
          <div class="attachment-message__icon">
            <svg>
              <use xlink:href="#icon-document" />
            </svg>
          </div>
          <a class="attachment-message__content" :href="fileUrl" :download="fileName" target="_blank">
            {{ fileName }}
          </a>
        </div>
      </div>
    </div>
  </wrapper-message>
</template>
<script>
import downloadFileChatMixin from '~/mixins/chat/download-file.js'

export default {
  components: {
    WrapperMessage: () => import('~/components/desktop/chat/message/wrapper-message.vue')
  },
  mixins: [downloadFileChatMixin],
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
    date: {
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
    },
    signCookieQuery: {
      type: String,
      default: ''
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/chat/message/attachment-message.scss">
</style>
