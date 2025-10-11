<template>
  <b-modal
    v-if="!this.$device.isMobileOrTablet"
    :id="modalName"
    :ref="modalName"
    class="modal-cf-turnstile"
    centered
    no-close-on-backdrop
    hide-header
    hide-footer
  >
    <cf-turnstile :verify="verify" @challenge="onChallengeCfTurnstile" />
  </b-modal>
</template>
<script>
import { MODAL } from '@/resources/modal'
export default {
  components: {
    CfTurnstile: () => import('~/components/common/cf-turnstile/index.vue')
  },
  props: {
    verify: {
      type: Boolean,
      default: false
    },
    modalName: {
      type: String,
      default: MODAL.CF_TURNSTILE
    }
  },
  data () {
    return {
      MODAL
    }
  },
  methods: {
    onChallengeCfTurnstile (token) {
      this.$emit('challenge', token)
      this.$bvModal.hide(this.modalName)
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/common/modal/modal-cf-turnstile.scss">
</style>
