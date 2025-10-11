<template>
  <ModalCommon
    :id="modalId"
    :ref="modalId"
    :modal-class="`modal-message ${className}`"
    :no-close-on-backdrop="noCloseOnBackdrop"
    :no-close-on-esc="hideBackdrop"
    :hide-cancel-icon="hideCancelIcon"
    :title="title"
    @hide-modal="hideModal"
  >
    <div :class="['modal-message', { 'mt-32': !!title }]">
      <div class="modal-message__thumb">
        <img :src="require(`~imageRoot/common/${icon}.svg`)" alt="icon fail">
      </div>
      <div class="modal-message__title">
        {{ $t(`modal.message.${name}`) }}
      </div>
      <div v-if="messageContent" class="modal-message__desc">
        {{ messageContent }}
      </div>
      <div v-else-if="isShowDefault" class="modal-message__desc">
        {{ $t(`modal.message.error_system`) }}
      </div>
      <template v-else>
        <div v-for="(message, index) in messages" :key="index" class="modal-message__desc">
          <span v-html="$t(`modal.message.${message.key}`)" />
        </div>
      </template>
      <button v-if="showConnectWallet" class="modal-message__action primary" @click="$_authMixin_logout">
        {{ $t('action.confirm') }}
      </button>
    </div>
  </ModalCommon>
</template>
<script>
import ModalCommon from '@/components/desktop/modal/modal-common.vue';
import { mapState, mapActions } from 'vuex';
import { ERROR_TYPE, ERROR_NAME, ERROR_TITLE, ERROR_MESSAGE_ICON } from '@/resources/message.js';
import auth from '@/mixins/auth';
import { MODAL } from '@/resources/modal';
import modalMixin from '~/mixins/modal'

export default {
  components: {
    ModalCommon
  },
  mixins: [auth, modalMixin],
  props: {
    className: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      errorType: ERROR_TYPE,
      modalId: MODAL.MESSAGE,
      noCloseOnBackdrop: false,
      hideBackdrop: false,
      hideCancelIcon: false
    }
  },
  computed: {
    ...mapState('modal-message', ['type', 'messages', 'api', 'isShow', 'showConnectWallet', 'messageContent', 'forceReload', 'isPreventClose']),
    title () {
      const errorKey = this.messages && this.messages[0]?.key ? ERROR_TITLE[this.messages[0]?.key] : null
      return errorKey ? this.$t(`modal.message.${errorKey}`) : null
    },
    name () {
      return ERROR_NAME[this.api] || 'system_failed'
    },
    icon () {
      const defaultIcon = 'response-fail'
      return this.messages && this.messages[0]?.key ? ERROR_MESSAGE_ICON[this.messages[0]?.key] || defaultIcon : defaultIcon
    },
    isShowDefault () {
      return this.type === this.errorType.SYSTEM || !this.messages?.[0]?.key;
    }
  },
  watch: {
    isShow (value) {
      if (value) {
        this.$_modalMixin_closeAllModal()
        setTimeout(() => {
          this.show()
        }, 200)
      }
      if (this.isPreventClose) {
        this.noCloseOnBackdrop = true
        this.hideBackdrop = true
        this.hideCancelIcon = true
      }
    }
  },
  methods: {
    ...mapActions('modal-message', ['initModal']),
    show () {
      this.$_modalMixin_openModal(this.modalId);
    },
    close () {
      this.$_modalMixin_closeModal(this.modalId);
    },
    hideModal () {
      if (this.forceReload) {
        window.location.reload()
      }
      this.initModal({
        type: ERROR_TYPE.MANUAL,
        message: [],
        api: '',
        isShow: false,
        forceReload: false,
        messageContent: '',
        showConnectWallet: false
      })
    }
  }
};
</script>
<style scoped lang="scss" src="static/assets/scss/components/common/modal/modal-message.scss"></style>
