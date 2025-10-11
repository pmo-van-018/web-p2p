<template>
  <b-modal
    :id="modalId"
    :ref="modalId"
    centered
    hide-header
    hide-footer
    no-close-on-backdrop
    no-close-on-esc
  >
    <div class="modal-tx-guide">
      <div class="modal-tx-guide__container">
        <div class="modal-tx-guide__head">
          <span class="modal-tx-guide__icon-head icon-chevron-right1" @click="close()" />
          <div class="d-flex align-items-center">
            <div class="modal-tx-guide__text">{{ $t('modal.tx_guide.title') }}</div>
          </div>
        </div>
        <div class="modal-tx-guide__body">
          <div class="tx-guide">
            <div class="tx-guide__steps">
              <div v-for="index in 5" :key="index" class="step">
                <div class="step__title">{{ $t('modal.tx_guide.step') }} {{ index }}:</div>
                <div class="step__desc" v-html="$t(`modal.tx_guide.desc_${index}`)" />
                <div class="step__image">
                  <img :src="`/assets/images/common/orders/tx-guide/tx-guide-step-${index}.png`" alt="tx-guide-step">
                </div>
              </div>
            </div>
            <div class="tx-guide__action">
              <base-button
                variants="contained"
                color="primary"
                full-width
                @click="close()"
              >
                <div class="tx-guide__action-inner">
                  <span>{{ $t('modal.system_note.confirm') }}</span>
                </div>
              </base-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </b-modal>
</template>
<script>
import { MODAL } from '@/resources/modal';

export default {
  components: {
    BaseButton: () => import('~/components/common/base-button/index.vue')
  },
  data () {
    return {
      modalId: MODAL.TX_GUIDE
    }
  },
  methods: {
    show () {
      this.$refs.modalTxGuide.show();
    },
    close () {
      this.$refs.modalTxGuide.hide();
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/mobile/modal/tx-guide/index.scss">
</style>
