<template>
  <section class="detail-support">
    <loading v-if="isDetailLoading" />
    <div v-else-if="!isDetailLoading && supportRequestDetail" class="detail-support__container">
      <div class="detail-support__inner d-flex align-items-stretch flex-column">
        <div class="detail-support__head">
          <div class="head-info">
            <div class="head-info__inner">
              <div class="head-info__back" @click="$router.go(-1)">
                <span class="head-info__back-icon icon-chevron-right1" />
              </div>
              <div class="head-info__content">
                <div class="info-content">
                  <div class="info-content__inner">
                    <div class="info-content__name">{{ userName }}</div>
                    <div class="info-content__order">{{ $t('customer_care.transfer') }} <span class="yellow">{{ totalOrder }}</span></div>
                    <div class="info-content__order">{{ $t('customer_care.completed') }} <span class="green">{{ rate }}%</span></div>
                  </div>
                  <div class="info-content__inner">
                    <div class="info-content__text">{{ $t('customer_care.code_request') }} <strong class="grey-800">#{{ supportRequestId }}</strong></div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="isAdminSupporter" class="head-info__inner">
              <base-button
                :loading="isResolveSupportRequestLoading"
                :disabled="isResolveSupportRequestLoading || !isPendingSupportRequest"
                class="head-info__processed-action"
                variants="contained"
                color="primary"
                @click="resolveSupportRequestDetail"
              >
                {{ $t('action.processed') }}
              </base-button>
            </div>
          </div>
        </div>
        <div class="detail-support__chat">
          <customer-chat
            :room-id="roomId"
            :ref-id="supportRequestId"
            :pending-request="isPendingSupportRequest"
            :user-name="userName"
            :visible-first-content="false"
          />
        </div>
      </div>
      <div class="detail-support__inner h-100 detail-support__attachment">
        <attachment-tabs
          :message-files="fileAttachments"
          :message-images="imageAttachments"
        />
      </div>
    </div>
    <section404 v-else :is-visible-home="false" />
  </section>
</template>
<script>
import { DASHBOARD_API } from '@/api/dashboard'
import { mapActions, mapState } from 'vuex'
import { REGEX_VALID_FILE_ATTACHMENT_CHAT, REGEX_VALID_URL_IMAGE } from '@/constants'
import { CUSTOMER_SUPPORT_STATUS } from '@/constants/customer-support'
import { USER_ROLE } from '@/config/constant'
import { CONFIRM_TYPE, RESPONSE_ICON, ERROR_TYPE } from '@/resources/message'
import ADMIN_SUPPORTER_API from '~/api/admin-supporter'

export default {
  components: {
    AttachmentTabs: () => import('~/components/desktop/admin/customers-care/attachment-tabs/index.vue'),
    CustomerChat: () => import('~/components/common/customer-care/chat/index.vue'),
    Section404: () => import('~/components/common/404/index.vue'),
    BaseButton: () => import('~/components/common/base-button/index.vue')
  },
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
        return this.userDashboard?.recentCompleteRate
      }
      return Number(this.userDashboard?.recentCompleteRate || 0).toFixed(1)
    }
  },
  async created () {
    this.resetStateChat()
    await this.getDetailSupportRequest()
    if (this.supportRequestDetail) {
      await this.getDataDashboard()
    }
  },
  methods: {
    ...mapActions('modal-response', ['showResponseModal']),
    ...mapActions('chat-support-request', ['resetStateChat']),
    isValidMessageHasLinkImage (message) {
      return message?.fileUpload?.completedUrl?.match(REGEX_VALID_URL_IMAGE)
    },
    isValidFileAttachment (message) {
      return message?.fileUpload?.completedUrl?.match(REGEX_VALID_FILE_ATTACHMENT_CHAT)
    },
    async getDetailSupportRequest () {
      try {
        this.isDetailLoading = true
        const { data, errors } = await this.$axios.$get(ADMIN_SUPPORTER_API.SHOW_SUPPORT_REQUEST_BY_ID(this.$route.params.id))
        if (errors?.length) {
          const errorKey = errors[0]?.key
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
        }
        if (data) {
          this.supportRequestDetail = data;
        }
      } catch (err) {
        console.error(err)
      } finally {
        this.isDetailLoading = false
      }
    },
    async resolveSupportRequestDetail () {
      try {
        this.isResolveSupportRequestLoading = true
        const { errors } = await this.$axios.$put(ADMIN_SUPPORTER_API.RESOLVE_SUPPORT_REQUEST_BY_ID(this.supportRequestId))
        if (errors?.length) {
          this.handleError(errors[0].key)
          return
        }
        this.supportRequestDetail = { ...this.supportRequestDetail, status: CUSTOMER_SUPPORT_STATUS.COMPLETED }
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
        this.handleError(keyError)
      } finally {
        this.isResolveSupportRequestLoading = false
      }
    },
    handleError (keyError) {
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
    },
    async getDataDashboard () {
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
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/admin/customer-care/detail/index.scss">
</style>
