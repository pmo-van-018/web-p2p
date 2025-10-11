<template>
  <ModalCommon
    :id="MODAL.SIGN_NONCE"
    :ref="MODAL.SIGN_NONCE"
    no-close-on-esc
    no-close-on-backdrop
    :title="$t('label.sign_nonce.title')"
    @on-close="$emit('on-close')"
  >
    <div class="modal-sign-nonce mt-2">
      <div class="text-center">
        <animation-icon-sign-nonce />
      </div>
      <p class="modal-sign-nonce__txt font-t16r mb-0 text-center" v-html="description" />
    </div>
  </ModalCommon>
</template>
<script>
import ModalCommon from '@/components/desktop/modal/modal-common.vue';
import { MODAL } from '@/resources/modal'

export default {
  components: {
    ModalCommon,
    AnimationIconSignNonce: () => import('~/components/common/animations/icon-sign-nonce.vue')
  },
  props: {
    modalClass: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      MODAL
    }
  },
  computed: {
    description () {
      const userRedirect = this.$config.STATIC_DOMAIN || ''
      return this.$t('label.sign_nonce.description', {
        // TODO update href link to correct page
        policy: `<a target="_blank" rel="noopener noreferrer" href='${userRedirect}/privacy-principles'>${this.$t('label.sign_nonce.policy')}</a>`,
        term: `<a target="_blank" rel="noopener noreferrer" href='${userRedirect}/terms'>${this.$t('label.sign_nonce.term')}</a>`
      })
    }
  },
  methods: {
    show () {
      this.$refs[MODAL.SIGN_NONCE].show();
    },
    close () {
      this.$refs[MODAL.SIGN_NONCE].close();
    }
  }
}
</script>
<style scoped lang="scss" src="static/assets/scss/components/common/modal/modal-sign-nonce.scss"></style>
