<template>
  <div class="caution-message">
    <div v-b-toggle="'caution-message-1'" class="caution-message__head">
      <div class="caution-message__left d-flex align-items-center">
        <span class="icon-info" />
        <div class="caution-message__title">
          {{ cautionText }}
        </div>
      </div>
      <div class="caution-message__right" @click="$emit('on-close-caution')">
        <span class="icon-cancel caution-message__arrow" />
      </div>
    </div>
    <div class="caution-message__wrapper">
      <ul class="caution-message__list">
        <li v-for="(mes, index) in cautionMessages" :key="`caution_${index}`" class="caution-message__item">
          {{ mes }}
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { USER_ROLE } from '@/config/constant'

export default {
  props: {
    message: {
      type: Object,
      require: true
    }
  },
  computed: {
    ...mapState('user', ['user']),
    cautionText () {
      return this.user?.type === USER_ROLE.SUPER_ADMIN ? 'Những lưu ý quan trọng' : 'Lưu ý khi thực hiện giao dịch'
    },
    cautionMessages () {
      if (this.user?.type === USER_ROLE.SUPER_ADMIN) {
        return [
          'Yêu cầu các bên liên quan cung cấp bằng chứng về giao dịch',
          'Tuyệt đối không liên hệ người dùng qua bất kỳ kênh nào khác ngoài nhóm chat này.',
          'Kiểm tra và đối chiếu thật kỹ các bằng chứng được cung cấp, trước khi tiến hành phán quyết khiếu nại'
        ]
      }
      return [
        'Sử dụng phương thức chuyển khoản nhanh 24/7 để thanh toán. Bộ phận CSKH không hỗ trợ xử lý khiếu nại nếu bạn sử dụng phương thức thanh toán khác.',
        'Nhân viên ANOTRADE không liên hệ người dùng qua bất kỳ kênh nào khác ngoài nhóm chat này.',
        'Người mua: Ghi đúng nội dung chuyển khoản trong ứng dụng chuyển tiền, không được phép ghi các thông tin liên quan đến mua/ bán trong nội dung chuyển khoản ngân hàng. không hủy lệnh giao dịch sau khi chuyển khoản thành công.',
        'Người bán: Hãy kiểm tra kỹ số tiền mã hóa khi đã nhận đủ thanh toán tiền pháp định từ người mua.',
        'Nếu có thể, vui lòng chụp ảnh hoặc ghi hình quá trình thực hiện giao dịch của bạn. Đây sẽ là bằng chứng khi xảy ra phát sinh khiếu nại giữa các bên.',
        'Khi có sự cố, hãy trao đổi với đối tác để nhanh chóng xử lý vấn đề, trước khi yêu cầu sự hỗ trợ từ bộ phận CSKH',
        'Lịch sử chat sẽ được lưu giữ để giải quyết nếu có khiếu nại xảy ra. Sau khi kết thúc giao dịch, lịch sử chat sẽ được xóa.'
      ]
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/chat/message/caution-message.scss">
</style>
