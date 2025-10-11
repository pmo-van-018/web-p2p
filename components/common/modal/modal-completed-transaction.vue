<template>
  <b-modal
    :id="MODAL.COMPLETED_TRANSACTION"
    :ref="MODAL.COMPLETED_TRANSACTION"
    centered
    hide-header
    no-close-on-esc
    no-close-on-backdrop
    hide-footer
  >
    <section class="completed-transaction">
      <div class="completed-transaction__body">
        <div class="completed-transaction__img">
          <img src="/assets/images/common/orders/system-notifications.svg" alt="Icon" />
        </div>
        <h2 class="completed-transaction__title">{{ $t('notification.title') }}</h2>
        <p class="completed-transaction__content">
          {{ $t('modal.completed_order') }}
        </p>
        <base-button variants="contained" color="primary" full-width @click="close">
          {{ $t('action.understood') }}
        </base-button>
      </div>
    </section>
  </b-modal>
</template>
<script>
import { MODAL } from '@/resources/modal'
export default {
  components: {
    BaseButton: () => import('~/components/common/base-button/index.vue')
  },
  data () {
    return {
      isLoaded: false,
      MODAL
    }
  },
  methods: {
    close () {
      this.$bvModal.hide(MODAL.COMPLETED_TRANSACTION)
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/common/modal/modal-completed-transaction.scss">
</style>
