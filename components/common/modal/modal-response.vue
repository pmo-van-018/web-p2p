<template>
  <b-modal
    :id="id"
    centered
    hide-header
    hide-footer
    :no-close-on-backdrop="noCloseOnBackdrop"
    :no-close-on-esc="hideBackdrop"
    @hidden="onHiddenModal"
    @show="$emit('show')"
    @shown="$emit('shown')"
  >
    <div class="modal-response">
      <div class="modal-response__container">
        <div class="modal-response__head">
          <div><div v-if="title" class="modal-response__title">{{ title }}</div></div>
          <div v-if="visibleClose" class="modal-response__close" @click="onCloseModal">
            <span class="icon-cancel" />
          </div>
        </div>

        <div class="modal-response__body d-flex align-items-center justify-content-center">
          <img
            class="modal-response__thumb"
            :class="thumbClass"
            :src="thumbImage"
            alt="icon thumb"
          >
        </div>

        <div class="modal-response__content">
          <h1 v-if="content" class="modal-response__text" :class="textClass">{{ content }}</h1>
          <p v-if="description" class="modal-response__desc" v-html="description"></p>
        </div>
        <div v-if="confirmAction && confirmActionType" class="modal-response__action">
          <base-button variants="contained" color="primary" full-width @click="onConfirm">
            {{ confirmAction }}
          </base-button>
        </div>
      </div>
    </div>
  </b-modal>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import { MODAL } from '@/resources/modal'
import { CONFIRM_TYPE, RESPONSE_ICON } from '@/resources/message'
import modalMixin from '~/mixins/modal'
import authMixin from '~/mixins/auth';

export default {
  components: {
    BaseButton: () => import('~/components/common/base-button/index.vue')
  },
  mixins: [modalMixin, authMixin],
  data () {
    return {
      id: MODAL.RESPONSE_MESSAGE,
      noCloseOnBackdrop: false,
      hideBackdrop: false
    }
  },
  computed: {
    ...mapState('modal-response', [
      'title',
      'content',
      'description',
      'show',
      'icon',
      'type',
      'confirmAction',
      'confirmActionType',
      'visibleClose',
      'preventClose',
      'forceReload',
      'thumbClass'
    ]),
    thumbImage () {
      return this.icon || RESPONSE_ICON.RESPONSE_FAILED
    },
    textClass () {
      return this.type ? 'modal-response__text--' + this.type : null
    }
  },
  watch: {
    show (value) {
      if (value) {
        this.$_modalMixin_closeExceptModal(MODAL.CHAT_FRAME)
        setTimeout(() => {
          this.$bvModal.show(this.id)
        }, 200)
        if (this.preventClose) {
          this.noCloseOnBackdrop = true
          this.hideBackdrop = true
        }
      }
    }
  },
  created () {
    this.resetResponseModal()
  },
  methods: {
    ...mapActions('modal-response', ['resetResponseModal']),
    onHiddenModal () {
      if (this.forceReload) {
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      }
      this.$emit('hidden')
      this.resetResponseModal()
    },
    onCloseModal () {
      if (!this.preventClose) {
        this.$bvModal.hide(this.id)
      }
    },
    async onConfirm () {
      if (this.confirmAction && this.confirmActionType) {
        switch (this.confirmActionType) {
          case CONFIRM_TYPE.LOGOUT: {
            await this.$_authMixin_logout()
            break
          }
          case CONFIRM_TYPE.LOGOUT_USERNAME_PASSWORD: {
            await this.$_authMixin_logoutUserNamePassword()
            break
          }
          case CONFIRM_TYPE.REDIRECT_APPEAL_LIST_SUPPORTER: {
            this.$bvModal.hide(this.id)
            this.$router.push({ name: 'admin-supporter-list-appeals' })
            break
          }
          case CONFIRM_TYPE.REDIRECT_APPEAL_LIST: {
            this.$bvModal.hide(this.id)
            this.$router.push({ name: 'appeals' })
            break
          }
          case CONFIRM_TYPE.REDIRECT_SUPPORT_REQUEST_LIST: {
            this.$bvModal.hide(this.id)
            this.$router.push('/admin-supporter/support-requests?status=processed')
            break
          }
          default: {
            this.$bvModal.hide(this.id)
            break
          }
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/common/modal/modal-response.scss">
</style>
