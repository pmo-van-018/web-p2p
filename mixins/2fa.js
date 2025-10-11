import { mapState } from 'vuex';
import { MODAL } from '@/resources/modal';

export default {
  data () {
    return {
      MODAL,
      otp: '',
      loading: false
    };
  },
  computed: {
    ...mapState('modal-response', ['show']),
    ...mapState('2fa', ['otpProcessing']),
    enableSubmitOtp () {
      return this.otp && this.otp.length === 6
    }
  },
  methods: {
    validateOtp (e) {
      this.otp = e?.target?.value?.replace(/\D/g, '');
    },
    showResult (content, icon, type) {
      this.showResponseModal({
        title: this.$t('modal.message.system_notification'),
        content,
        icon,
        show: true,
        type
      })
    }
  }
};
