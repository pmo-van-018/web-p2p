<template>
  <b-modal
    :id="modalInformationId"
    modal-class="modal-custom"
    centered
    hide-header
    hide-footer
    hide-backdrop
    hide-header-close
    no-close-on-backdrop
    no-close-on-esc
    no-fade
    @hide="$emit('hide')"
  >
    <div class="information">
      <div class="information__head">
        <span class="information__head-left icon-arrow-left-long" @click="onBackToSection" />
        <div class="information__head-center">{{ title }}</div>
      </div>
      <div class="information__body">
        <template v-if="nameComponent === 'info'">
          <div class="information__inner">
            <info-user
              :ref-id="refId"
              :user-name="userName"
              :total-order="totalOrder"
              :rate="rate"
            />
          </div>
          <div class="information__inner">
            <div class="attachment">
              <div class="attachment__inner" @click="onOpenAttachment('files')">
                <div class="attachment__left">
                  <svg>
                    <use xlink:href="#icon-file-attachment" />
                  </svg>
                  <div class="attachment__text">{{ $t('customer_care.attachment_file') }}</div>
                </div>
                <div class="attachment__right">{{ fileAttachmentMessages.length }}</div>
              </div>
              <div class="attachment__inner" @click="onOpenAttachment('images')">
                <div class="attachment__left">
                  <svg>
                    <use xlink:href="#icon-image-attachment" />
                  </svg>
                  <div class="attachment__text">{{ $t('customer_care.attachment_image') }}</div>
                </div>
                <div class="attachment__right">{{ imageAttachmentMessages.length }}</div>
              </div>
            </div>
          </div>
          <div v-if="!resolved" class="information__action">
            <base-button
              variants="contained"
              color="primary"
              full-width
              :disabled="isLoading"
              :loading="isLoading"
              @click="onResolveSupportRequestDetail"
            >
              {{ $t('action.processed') }}
            </base-button>
          </div>
        </template>
        <attachment-files v-else-if="nameComponent === 'files'" :messages="fileAttachmentMessages" />
        <attachment-images v-else :messages="imageAttachmentMessages" />
      </div>
    </div>
  </b-modal>
</template>
<script>
import { mapState } from 'vuex'
import { USER_ROLE } from '@/config/constant'
import { REGEX_VALID_FILE_ATTACHMENT_CHAT, REGEX_VALID_URL_IMAGE } from '@/constants'

export default {
  components: {
    BaseButton: () => import('~/components/common/base-button/index.vue'),
    InfoUser: () => import('~/components/mobile/admin/customers-care/detail/info-user.vue'),
    AttachmentFiles: () => import('~/components/mobile/admin/customers-care/attachment/files/index.vue'),
    AttachmentImages: () => import('~/components/mobile/admin/customers-care/attachment/images/index.vue')
  },
  props: {
    userName: {
      type: String,
      default: ''
    },
    totalOrder: {
      type: Number,
      default: 0
    },
    rate: {
      type: String,
      required: true
    },
    refId: {
      type: String,
      default: ''
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    resolved: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      modalInformationId: 'modalDetailInformationSupportRequest',
      nameComponent: 'info'
    }
  },
  computed: {
    ...mapState('chat-support-request', ['messages']),
    ...mapState('user', ['user']),
    title () {
      if (this.nameComponent === 'files') {
        return this.$t('customer_care.attachment_file')
      }
      if (this.nameComponent === 'images') {
        return this.$t('customer_care.attachment_image')
      }
      return this.$t('customer_care.information')
    },
    isAdminSupporter () {
      return this.user?.type === USER_ROLE.ADMIN_SUPPORTER
    },
    fileAttachmentMessages () {
      return this.messages.filter((message) => {
        return this.isValidFileAttachment(message)
      })?.reverse() || []
    },
    imageAttachmentMessages () {
      return this.messages.filter((message) => {
        return this.isValidMessageHasLinkImage(message)
      })?.reverse() || []
    }
  },
  methods: {
    onBackToSection () {
      if (this.nameComponent === 'info') {
        this.$bvModal.hide(this.modalInformationId)
        return
      }
      this.nameComponent = 'info'
    },
    onOpenAttachment (name) {
      this.nameComponent = name
    },
    onResolveSupportRequestDetail () {
      this.$emit('on-resolved')
    },
    isValidMessageHasLinkImage (message) {
      return message?.fileUpload?.completedUrl?.match(REGEX_VALID_URL_IMAGE)
    },
    isValidFileAttachment (message) {
      return message?.fileUpload?.completedUrl?.match(REGEX_VALID_FILE_ATTACHMENT_CHAT)
    }
  }
}
</script>
<style lang="scss" scoped>
:deep(.modal) {
  background-color: $white;
  @media (max-width: 768px) {
    background-color: white;
  }
  .modal-dialog {
    margin: 0;
    height: 100%;
    width: 100%;
    max-width: 100%;
  }

  .modal-content {
    border: 0;
    border-radius: 0;
    width: 100vw;
    height: 100%;
    padding: 0;
  }

  .modal-body {
    padding: 0;
    height: 100%;
    max-width: 100%;
  }
}
.information {
  box-sizing: border-box;
  margin: 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
  &__head {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 14px 1rem;
    border-bottom: 1px solid $grey-100;
  }
  &__head {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2px 1rem;
    position: relative;
  }
  &__head-left, &__head-right {
    font-size: 24px;
    &:before {
      color: $neutrals-600;
    }
  }
  &__head-left {
    position: absolute;
    left: 1rem;
    top: 0;
    bottom: 0;
  }
  &__head-center {
    @include font-t14b;
    color: #000;
  }
  &__body {
    overflow: auto;
    flex: 1 1 0;
    position: relative;
    padding: 8px;
    background-color: #F5F6F8;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  &__inner {
    padding: 8px;
    border-radius: 8px;
    background-color: #fff;
  }
}
.attachment {
  display: flex;
  flex-direction: column;
  gap: 8px;
  &__inner {
    padding: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  &__left {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  &__icon {
    width: 1.5rem;
    height: 1.5rem;
  }
  &__text {
    @include font-t12m;
    color: #000;
  }
  &__right {
    @include font-t14m;
    color: #000;
  }
}
</style>
