<template>
  <div class="user-input">
    <images-file-list
      :images="imageFileSource"
      @on-remove="onRemoveImageFile"
    />
    <div class="user-input__container">
      <div v-if="isAdminSupporter" class="user-input__action">
        <span
          class="user-input__action-icon icon-comment-line"
          @click="toggleSuggestionMessage = !toggleSuggestionMessage"
        />
      </div>
      <div class="user-input__action">
        <span
          class="user-input__action-icon icon-attachment"
          @click="$refs.inputFile.click()"
        />
      </div>
      <textarea
        ref="inputMessage"
        v-model="inputValue"
        class="user-input__input"
        rows="1"
        autocomplete="off"
        :maxlength="maxLengthInput"
        placeholder="Nhập tin nhắn.."
        @focus="onFocusMessageInput"
        @keydown.enter.exact.prevent
        @keyup.enter.exact="onSendMessageText"
      />
      <div class="user-input__icon-send">
        <icon-send
          :disabled="!isActiveSendIconMessage"
          :active="isActiveSendIconMessage"
          @click="onSendMessageText"
        />
      </div>
    </div>
    <div
      v-if="isAdminSupporter"
      class="user-input__suggestion"
      :class="{'visible': toggleSuggestionMessage}"
    >
      <tabs-suggestion-message @on-input="onSetInputSuggestion" />
    </div>
    <input
      ref="inputFile"
      type="file"
      hidden
      name="choiceFile"
      accept="image/jpeg,image/webp,image/png,image/gif,image/svg+xml,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      @change="onChooseFile"
    >
  </div>
</template>
<script>
import { trimMultipleSpaceStartEndString } from '@/helper'
import { mapState } from 'vuex'
import { CHAT_MESSAGE_MAX_LENGTH } from '@/constants/chat'
import { USER_ROLE } from '@/config/constant';

export default {
  components: {
    IconSend: () => import('~/components/desktop/chat/icon-send.vue'),
    ImagesFileList: () => import('~/components/desktop/chat/images-file-list.vue'),
    TabsSuggestionMessage: () => import('~/components/desktop/chat/tabs-suggestion-message.vue')
  },
  data () {
    return {
      inputValue: '',
      toggleSuggestionMessage: false,
      imageFileSource: []
    }
  },
  computed: {
    ...mapState('user', ['user']),
    ...mapState('chat-support-request', ['isVisibleChat', 'isFocusInput']),
    activeSendMessage () {
      return this.inputValue.length > 0
    },
    isActiveSendIconMessage () {
      return this.activeSendMessage || !!this.imageFileSource.length
    },
    userType () {
      return this.user?.type
    },
    maxLengthInput () {
      return CHAT_MESSAGE_MAX_LENGTH.NORMAL
    },
    isAdminSupporter () {
      return this.userType === USER_ROLE.ADMIN_SUPPORTER
    }
  },
  watch: {
    isVisibleChat: {
      handler (value) {
        if (value) {
          this.onSetFocusInputMessage()
        }
      },
      immediate: true
    },
    isFocusInput (value) {
      if (value) {
        this.onSetFocusInputMessage()
      }
    }
  },
  methods: {
    onSendMessageText () {
      if (this.imageFileSource.length) {
        this.$emit('on-send-multiple-files', this.imageFileSource.map(item => item.file))
        this.imageFileSource = []
      }
      const message = trimMultipleSpaceStartEndString(this.inputValue)
      if (message !== '') {
        this.$emit('on-input', message)
        this.inputValue = ''
      }
    },
    onChooseFile (e) {
      const file = e.target.files[0]
      this.$emit('on-input-file', file)
      this.$refs.inputFile.value = null
    },
    onFocusMessageInput () {
      this.toggleSuggestionMessage = false
      this.$emit('on-focus-input')
    },
    onSetFocusInputMessage () {
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.inputMessage?.focus()
        }, 200)
      })
    },
    onSetInputSuggestion (value) {
      this.inputValue = value
      this.onSendMessageText()
      this.toggleSuggestionMessage = !this.toggleSuggestionMessage
    },
    onRemoveImageFile (file) {
      this.imageFileSource = this.imageFileSource.filter(item => item.image !== file.image)
    },
    onPasteFile (evt) {
      const dT = evt.clipboardData || window.clipboardData;
      const { items, files } = dT;
      if (items) {
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.includes('image')) {
            const blob = items[i].getAsFile();
            const URLObj = window.URL || window.webkitURL;
            const source = URLObj.createObjectURL(blob);
            files.url = source;
            this.imageFileSource.push({
              image: source,
              file: files[i]
            });
          }
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/chat/user-input.scss">
</style>
