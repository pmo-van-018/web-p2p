<template>
  <b-modal
    :id="id"
    centered
    hide-header
    hide-footer
  >
    <div class="modal-cancel-supporter">
      <div class="modal-cancel-supporter__container">
        <div class="modal-cancel-supporter__head">
          <div><div class="modal-cancel-supporter__title">{{ $t('appeal.supporter.confirm_cancel') }}</div></div>
          <div class="modal-cancel-supporter__close" @click="$bvModal.hide(id)">
            <span class="icon-cancel" />
          </div>
        </div>

        <div class="modal-cancel-supporter__body d-flex align-items-center justify-content-center">
          <img
            class="modal-cancel-supporter__thumb"
            :src="require('~imageRoot/common/orders/cancel-support.svg')"
            alt="cancel support"
          >
        </div>

        <div class="modal-cancel-supporter__content">
          {{ $t('appeal.supporter.content') }}
        </div>

        <div class="modal-cancel-supporter__info">
          <div class="modal-cancel-supporter__info-inner">
            <div class="modal-cancel-supporter__info-label">{{ $t('appeal.supporter.admin_supporting') }}</div>
            <div class="modal-cancel-supporter__info-name">{{ appeal?.nickNameAdminSupporter || '' }}</div>
          </div>
        </div>
        <div class="modal-cancel-supporter__action">
          <base-button variants="contained" color="info" full-width @click="$bvModal.hide(id)">
            {{ $t('action.aborted') }}
          </base-button>
          <base-button variants="contained" color="primary" full-width @click="onConfirm">
            {{ $t('action.confirm') }}
          </base-button>
        </div>
      </div>
    </div>
  </b-modal>
</template>
<script>
import { MODAL } from '@/resources/modal'
import { ADMIN_API } from '@/api/admin'
import { mapActions } from 'vuex'
import { RESPONSE_ICON } from '@/resources/message'

export default {
  components: {
    BaseButton: () => import('~/components/common/base-button/index.vue')
  },
  props: {
    appeal: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      id: MODAL.CANCEL_SUPPORTER
    }
  },
  methods: {
    ...mapActions('modal-response', ['showResponseModal']),
    async onConfirm () {
      try {
        const { errors } = await this.$axios.$post(`${ADMIN_API.CANCEL_APPEAL_SESSION}/${this.appeal?.id}`)
        if (errors?.length) {
          const errorKey = errors[0].key || 'error_system';
          this.handleError(errorKey)
          return;
        }
        this.$bvModal.hide(this.id)
        this.$emit('on-confirm-success')
      } catch (error) {
        const errorKey = error?.response?.data?.errors?.[0]?.key || 'error_system';
        this.handleError(errorKey)
      }
    },
    handleError (errorKey) {
      let forceReload = false
      let responseIcon = RESPONSE_ICON.RESPONSE_FAILED
      if (errorKey === 'ORDER_STATUS_IS_INVALID') {
        errorKey = 'ORDER_STATUS_IS_INVALID_FORCE_RELOAD'
        responseIcon = RESPONSE_ICON.SWITCH_STATUS_FAILED
        forceReload = true
      }
      this.showResponseModal({
        title: '',
        content: this.$t('modal.message.system_failed'),
        description: this.$t(`modal.message.${errorKey}`),
        icon: responseIcon,
        show: true,
        forceReload
      })
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/modal/modal-cancel-supporter.scss">
</style>
