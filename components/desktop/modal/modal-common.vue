<template>
  <b-modal
    :id="id"
    ref="modalCommon"
    :modal-class="`modal-custom modal-common ${modalClass}`"
    centered
    hide-header
    hide-footer
    :no-close-on-esc="noCloseOnEsc"
    :no-close-on-backdrop="noCloseOnBackdrop"
    @hidden="$emit('hide-modal')"
    @hide="$emit('before-hide-modal')"
    @show="$emit('show-modal')"
    @shown="$emit('shown-modal')"
  >
    <div class="modal-common__content">
      <div class="modal-common__header">
        <div class="modal-common__title">
          {{ title }}
          <slot name="countdown" />
        </div>
        <div v-if="!hideCancelIcon" class="modal-common__close" @click="close()">
          <span class="icon-cancel" />
        </div>
      </div>
      <slot />
    </div>
  </b-modal>
</template>
<script>
export default {
  props: {
    id: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    modalClass: {
      type: String,
      default: ''
    },
    noCloseOnEsc: {
      type: Boolean,
      default: false
    },
    noCloseOnBackdrop: {
      type: Boolean,
      default: false
    },
    hideBackdrop: {
      type: Boolean,
      default: false
    },
    hideCancelIcon: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
    };
  },
  computed: {
  },
  mounted () {
  },
  methods: {
    show () {
      this.$refs.modalCommon.show();
    },
    close () {
      this.$refs.modalCommon.hide();
      this.$emit('on-close');
    }
  }
};
</script>
<style scoped lang='scss' src='static/assets/scss/components/desktop/modal/modal-common.scss'></style>
