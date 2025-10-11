<template>
  <ModalCommon
    :id="MODAL.TX_GUIDE"
    :ref="MODAL.TX_GUIDE"
    :title="$t('modal.tx_guide.title')"
    @hide-modal="close()"
  >
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
          @click="close"
        >
          <div class="tx-guide__action-inner">
            <span>{{ $t('modal.system_note.confirm') }}</span>
          </div>
        </base-button>
      </div>
    </div>
  </ModalCommon>
</template>
<script>
import ModalCommon from '@/components/desktop/modal/modal-common.vue';
import { MODAL } from '@/resources/modal';

export default {
  components: {
    ModalCommon,
    BaseButton: () => import('~/components/common/base-button/index.vue')
  },
  data () {
    return {
      MODAL
    }
  },
  methods: {
    show () {
      this.$refs.modalTxGuide.show();
    },
    close () {
      this.$refs.modalTxGuide.close();
      this.$emit('on-tx-confirm')
    }
  }
}
</script>
<style scoped lang="scss" src="static/assets/scss/components/desktop/modal/modal-tx-guide.scss"></style>
