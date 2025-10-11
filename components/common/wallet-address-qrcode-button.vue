<template>
  <div class="wallet-address-qrcode-button">
    <span
      :id="id"
      v-b-tooltip.focus
      tabindex="0"
      class="wallet-address-qrcode-button__icon icon-qrcode"
      @click="show()"
    />
    <b-tooltip v-if="tooltipText" :target="id" :triggers="tooltipTrigger" :placement="tooltipPlacement">
      {{ tooltipText }}
    </b-tooltip>
    <ModalCommon
      :id="MODAL.WALLET_ADDRESS_QRCODE"
      :ref="MODAL.WALLET_ADDRESS_QRCODE"
      :title="title"
      modal-class="modal-wallet-address-qrcode"
      @hide-modal="close()"
    >
      <div class="wallet-address-qrcode-button__body">
        <div class="text-center">
          <qrcode-vue :value="value" :size="size" level="H" />
        </div>
      </div>
    </ModalCommon>
  </div>
</template>

<script>
import ModalCommon from '@/components/desktop/modal/modal-common.vue';
import { MODAL } from '@/resources/modal';

export default {
  components: {
    ModalCommon,
    QrcodeVue: () => import('qrcode.vue')
  },
  props: {
    id: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    },
    tooltipText: {
      type: String,
      default: ''
    },
    tooltipPlacement: {
      type: String,
      default: 'top'
    }
  },
  data () {
    return {
      MODAL
    }
  },
  computed: {
    size () {
      if (this.$device.isMobileOrTablet) {
        return 300;
      }
      return 320;
    },
    tooltipTrigger () {
      return this.$device.isMobileOrTablet ? 'focus' : 'hover';
    }
  },
  methods: {
    show () {
      this.$refs[MODAL.WALLET_ADDRESS_QRCODE].show();
    },
    close () {
      this.$refs[MODAL.WALLET_ADDRESS_QRCODE].close();
      this.$emit('on-close')
      setTimeout(() => {
        this.$root.$emit('bv::hide::tooltip', this.id)
      }, 1000)
    }
  }
}
</script>
<style scoped lang="scss" src="static/assets/scss/components/common/wallet-address-qrcode-button.scss"></style>
