<template>
  <div class="user-input">
    <images-file-list
      :images="imageFileSource"
      @on-remove="onRemoveImageFile"
    />
    <div class="user-input__container">
      <div v-if="suggestionMessages.length" class="user-input__action">
        <span
          class="user-input__action-icon icon-comment-line"
          @click="toggleSuggestionMessage = !toggleSuggestionMessage"
        />
      </div>
      <div v-if="isVisibleSendAttachment" class="user-input__action">
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
        @blur="onBlurMessageInput"
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
      v-if="suggestionMessages?.length"
      class="user-input__suggestion"
      :class="{'visible': toggleSuggestionMessage}"
    >
      <suggestion-messages
        :suggestions="suggestionMessages"
        @on-input="onSetInputSuggestion"
      />
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
import { USER_ROLE } from '@/config/constant'
import { ORDER_TYPE } from '@/resources/order-type'
import { CHAT_MESSAGE_MAX_LENGTH } from '@/constants/chat'

export default {
  components: {
    IconSend: () => import('~/components/desktop/chat/icon-send.vue'),
    SuggestionMessages: () => import('~/components/desktop/chat/suggestion-message.vue'),
    ImagesFileList: () => import('~/components/desktop/chat/images-file-list.vue')
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
    ...mapState('chat', ['order', 'isVisibleChat', 'isFocusInput']),
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
      if (this.userType === USER_ROLE.SUPER_ADMIN) {
        return CHAT_MESSAGE_MAX_LENGTH.SMALL
      }
      return CHAT_MESSAGE_MAX_LENGTH.NORMAL
    },
    orderType () {
      return this.order?.type
    },
    isVisibleSendAttachment () {
      return ![USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN_SUPPORTER].includes(this.userType)
    },
    suggestionMessages () {
      if (!this.userType || this.userType === USER_ROLE.MERCHANT_MANAGER) {
        return []
      }
      const messageOfAdmin = [
        'Vui lòng cung cấp cho bộ phận CSKH bằng chứng liên quan đến giao dịch chuyển tiền mã hóa.',
        'Vui lòng cung cấp bộ phận CSKH bằng chứng liên quan đến giao dịch chuyển tiền pháp định.',
        'Các bên vui lòng cung cấp đầy đủ bằng chứng vào nhóm chat. Xin cảm ơn!',
        'Bộ phận CSKH đã chuyển tiền mã hóa vào địa chỉ ví của người bán.',
        'Bộ phận CSKH đã chuyển tiền pháp định vào tài khoản của người mua. Vui lòng kiểm tra!',
        'Có chút vấn đề trong quá trình xác minh các bằng chứng, vui lòng chờ trong giây lát, xin cảm ơn!',
        'Xin hãy mô tả chi tiết vấn đề bạn gặp phải trong giao dịch này.',
        'Để giải quyết vấn đề một cách hiệu quả, chúng tôi cần bạn xác nhận thời gian và ngày thực hiện giao dịch',
        'Vui lòng cung cấp bằng chứng về thông báo lỗi bạn nhận được từ hệ thống',
        'Vui lòng cung cấp địa chỉ ví dùng để gửi (hoặc nhận) liên quan đến giao dịch!',
        'Bạn đã liên hệ với bộ phận hỗ trợ trước đây về vấn đề này chưa? Nếu có, xin hãy cung cấp chi tiết về cuộc trao đổi.',
        'Vui lòng cung cấp thông tin hoặc chi tiết khác mà bạn muốn chia sẻ để giúp chúng tôi hiểu rõ hơn về vấn đề.',
        'Chúng tôi cần một chút thời gian để kiểm tra lại vấn đề từ phía hệ thống. Vui lòng kiên nhẫn chờ đợi, chúng tôi sẽ phản hồi lại sau khi hoàn tất việc kiểm tra.',
        'Nếu bạn nhận thấy bất kỳ hoạt động đáng ngờ nào trong tài khoản của mình, vui lòng báo cáo ngay lập tức. Chúng tôi cần thông tin này để bảo vệ tài khoản và tài sản của bạn khỏi hành vi gian lận.',
        'Vui lòng mô tả thao tác bạn đã thực hiện đến khi gặp phải vấn đề!',
        'Nếu có bất kỳ đề xuất cải thiện nào dựa trên trải nghiệm của bạn, xin đừng ngần ngại chia sẻ với chúng tôi. Ý kiến của bạn rất quan trọng để chúng tôi cải thiện dịch vụ.',
        'Chúng tôi muốn biết nếu bạn đã tiếp tục thử giao dịch sau lần đầu gặp sự cố. Bạn có thể cho biết số lần và kết quả'
      ]
      const messageOperationWithOrderType = {
        [ORDER_TYPE.BUY]: [
          'Rất vui khi được giao dịch với bạn. Vui lòng thông báo cho tôi sau khi bạn đã thanh toán bằng tiền pháp định, cảm ơn!',
          'Vui lòng gửi cho tôi chi tiết thanh toán của bạn cho giao dịch này.',
          'Tôi đã nhận được tiền pháp định, cảm ơn bạn. Tôi sẽ gửi tiền mã hóa sau vài phút.',
          'Tôi đã gửi tiền mã hóa. Vui lòng kiểm tra, cảm ơn bạn!'
        ],
        [ORDER_TYPE.SELL]: [
          'Tôi đã nhận được tiền mã hóa. Tôi sẽ thanh toán sau vài phút.',
          'Tôi sẽ chuyển tiền mã hóa cho bạn ngay bây giờ, xin đợi một chút.',
          'Tôi đã chuyển tiền mã hóa. Vui lòng kiểm tra và xác nhận, cảm ơn bạn.',
          'Có chút vấn đề trong quá trình xác minh giao dịch, vui lòng chờ trong giây lát, xin cảm ơn!'
        ]
      }
      return {
        [USER_ROLE.USER]: {
          [ORDER_TYPE.BUY]: [
            'Tôi đã thanh toán tiền pháp định, vui lòng kiểm tra và xác nhận. Xin cảm ơn!',
            'Tôi chưa nhận được tiền mã hóa, vui lòng kiểm tra lại giao dịch. Xin cảm ơn!',
            'Xin lỗi, tôi đã nhầm lẫn và cần hủy giao dịch.',
            'Tôi gặp vấn đề khi thực hiện giao dịch, bạn có thể giúp tôi giải quyết không?'
          ],
          [ORDER_TYPE.SELL]: [
            'Tiền mã hóa đã được gửi đến ví của bạn, vui lòng kiểm tra. Xin cảm ơn!',
            'Tôi chưa nhận được thanh toán tiền pháp định, vui lòng kiểm tra lại giao dịch.',
            'Tôi gặp vấn đề khi gửi tiền mã hóa đến địa chỉ ví của bạn, làm sao để xác minh tình trạng giao dịch?'
          ]
        },
        [USER_ROLE.MERCHANT_OPERATOR]: messageOperationWithOrderType,
        [USER_ROLE.MERCHANT_SUPPORTER]: messageOperationWithOrderType,
        [USER_ROLE.SUPER_ADMIN]: {
          [ORDER_TYPE.BUY]: messageOfAdmin,
          [ORDER_TYPE.SELL]: messageOfAdmin
        },
        [USER_ROLE.ADMIN_SUPPORTER]: {
          [ORDER_TYPE.BUY]: messageOfAdmin,
          [ORDER_TYPE.SELL]: messageOfAdmin
        }
      }[this.userType][this.orderType] || []
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
      if (this.isVisibleSendAttachment) {
        const file = e.target.files[0]
        this.$emit('on-input-file', file)
        this.$refs.inputFile.value = null
      }
    },
    onFocusMessageInput () {
      this.toggleSuggestionMessage = false
      this.$emit('on-focus-input')
    },
    onBlurMessageInput () {
      this.$emit('on-blur-input')
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
