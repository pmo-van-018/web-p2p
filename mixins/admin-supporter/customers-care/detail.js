import { mapActions, mapState } from 'vuex'
import { USER_ROLE } from '@/config/constant'
import { CUSTOMER_SUPPORT_STATUS } from '@/constants/customer-support'
import { REGEX_VALID_FILE_ATTACHMENT_CHAT, REGEX_VALID_URL_IMAGE } from '@/constants'
import ADMIN_SUPPORTER_API from '@/api/admin-supporter'
import { CONFIRM_TYPE, ERROR_TYPE, RESPONSE_ICON } from '@/resources/message'
import { DASHBOARD_API } from '@/api/dashboard'

export default {
  data () {
    return {
      supportRequestDetail: null,
      userDashboard: null,
      isDetailLoading: false,
      isResolveSupportRequestLoading: false
    }
  },
  computed: {
    ...mapState('chat-support-request', ['messages']),
    ...mapState('user', ['user']),
    isAdminSupporter () {
      return this.user?.type === USER_ROLE.ADMIN_SUPPORTER
    },
    fileAttachments () {
      return this.messages.filter((message) => {
        return this.isValidFileAttachment(message)
      })?.reverse() || []
    },
    imageAttachments () {
      return this.messages.filter((message) => {
        return this.isValidMessageHasLinkImage(message)
      })?.reverse() || []
    },
    userName () {
      return this.supportRequestDetail?.userName || ''
    },
    roomId () {
      return this.supportRequestDetail?.roomId || ''
    },
    isPendingSupportRequest () {
      return this.supportRequestDetail?.status === CUSTOMER_SUPPORT_STATUS.PENDING
    },
    supportRequestId () {
      return this.supportRequestDetail?.id || ''
    },
    totalOrder () {
      return this.userDashboard?.totalOrder || 0
    },
    rate () {
      if (this.userDashboard?.recentCompleteRate === 0 || this.userDashboard?.recentCompleteRate === 100) {
        return this.userDashboard?.recentCompleteRate?.toString()
      }
      return Number(this.userDashboard?.recentCompleteRate || 0).toFixed(1)
    }
  },
  methods: {
    ...mapActions('modal-response', ['showResponseModal']),
    isValidMessageHasLinkImage (message) {
      return message?.fileUpload?.completedUrl?.match(REGEX_VALID_URL_IMAGE)
    },
    isValidFileAttachment (message) {
      return message?.fileUpload?.completedUrl?.match(REGEX_VALID_FILE_ATTACHMENT_CHAT)
    },
    async $_detailSupportRequestMixin_getDetailSupportRequest () {
      try {
        this.isDetailLoading = true
        const { data } = await this.$axios.$get(ADMIN_SUPPORTER_API.SHOW_SUPPORT_REQUEST_BY_ID(this.$route.params.id))
        if (data) {
          this.supportRequestDetail = data;
        }
      } catch (err) {
        const errorKey = err.response?.data?.errors[0]?.key
        if ([
          'ADMIN_SUPPORTER_VIEW_SUPPORT_REQUEST_PERMISSION_DENIED'
        ].includes(errorKey)) {
          this.$store.commit('modal-message/INIT_MODAL', {
            type: ERROR_TYPE.MANUAL,
            message: [{ key: errorKey }],
            isShow: true,
            api: '/admin/show-support-request'
          })
          this.$router.replace('/admin-supporter/support-requests')
        }
      } finally {
        this.isDetailLoading = false
      }
    },
    async $_detailSupportRequestMixin_resolveSupportRequestDetail () {
      try {
        this.isResolveSupportRequestLoading = true
        const { data } = await this.$axios.$put(ADMIN_SUPPORTER_API.RESOLVE_SUPPORT_REQUEST_BY_ID(this.supportRequestId))
        if (data) {
          this.supportRequestDetail = { ...this.supportRequestDetail, status: CUSTOMER_SUPPORT_STATUS.COMPLETED }
        }
        const modalConfig = {
          title: this.$t('modal.title.system'),
          content: this.$t('modal.message.update_support_request_succeed'),
          show: true,
          type: 'success',
          visibleClose: false,
          preventClose: true,
          icon: RESPONSE_ICON.UPDATE_SUPPORT_REQUEST_SUCCEED,
          confirmAction: this.$t('action.confirm'),
          confirmActionType: CONFIRM_TYPE.REDIRECT_SUPPORT_REQUEST_LIST
        };
        this.showResponseModal(modalConfig);
      } catch (error) {
        const keyError = error.response?.data?.errors[0]?.key || 'error_system'
        const modalConfig = {
          title: this.$t('modal.title.system'),
          description: this.$t(`modal.message.${keyError}`),
          content: '',
          show: true
        };

        switch (keyError) {
          case 'CANNOT_RESOLVE_SUPPORT_REQUEST':
            modalConfig.icon = RESPONSE_ICON.SUPPORT_PROCEED;
            modalConfig.description = this.$t('modal.message.SUPPORT_REQUEST_ALREADY_RECEIVED');
            modalConfig.confirmAction = this.$t('action.confirm');
            modalConfig.visibleClose = false;
            modalConfig.confirmActionType = CONFIRM_TYPE.CLOSE;
            break;
          case 'SUPPORT_REQUEST_STATUS_IS_INVALID':
            modalConfig.icon = RESPONSE_ICON.UPDATE_SUPPORT_REQUEST_FAILED;
            modalConfig.description = '';
            modalConfig.content = this.$t('modal.message.update_support_request_failed');
            modalConfig.confirmAction = this.$t('action.confirm');
            modalConfig.visibleClose = false;
            modalConfig.confirmActionType = CONFIRM_TYPE.CLOSE;
            break;
          default:
            modalConfig.icon = RESPONSE_ICON.RESPONSE_FAILED;
            break;
        }
        this.showResponseModal(modalConfig);
      } finally {
        this.isResolveSupportRequestLoading = false
      }
    },
    async $_detailSupportRequestMixin_getDataDashboard () {
      try {
        const userId = this.supportRequestDetail?.userId
        const { data } = await this.$axios.$get(DASHBOARD_API.SHOW_USER_DASHBOARD(userId))
        this.userDashboard = data
      } catch (error) {
        console.error(error)
      }
    }
  }
}
