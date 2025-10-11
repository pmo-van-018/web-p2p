<template>
  <div
    ref="copyButton"
    class="copy-button"
    :class="{'copy-button--disabled': showCopied}"
    @click.stop="handleCopyText"
  >
    <b-tooltip v-if="showTextCopied" :show.sync="showCopied" :target="id" triggers="click" :placement="placement">
      {{ $t('label.copied') }}
    </b-tooltip>
    <b-tooltip v-if="showTextGuide" :target="id" :triggers="tooltipTextGuideTrigger" :placement="placement">
      {{ textGuide }}
    </b-tooltip>
    <span
      :id="id"
      v-b-tooltip.focus
      tabindex="0"
      class="copy-button__icon"
      :class="{'icon-copy': !showCopied, 'icon-check copy-button__icon--active': showCopied}"
    />
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      default: ''
    },
    value: {
      type: [String, Number],
      default: ''
    },
    showTextCopied: {
      type: Boolean,
      default: true
    },
    textGuide: {
      type: String,
      default: null
    },
    placement: {
      type: String,
      default: 'top'
    }
  },
  data () {
    return {
      showCopied: false
    }
  },
  computed: {
    showTextGuide () {
      return this.textGuide && !this.showCopied;
    },
    tooltipTextGuideTrigger () {
      return this.$device.isMobileOrTablet ? 'focus' : 'hover';
    }
  },
  methods: {
    handleCopyText (event) {
      this.$emit('on-copied', event)
      this.$copyText(String(this.value), this.$refs.copyButton).then(() => {
        this.showCopied = true
        setTimeout(() => {
          this.showCopied = false
          this.$root.$emit('bv::hide::tooltip', this.id)
        }, 3000)
      })
    }
  }
}
</script>

<style lang="scss" scoped src="static/assets/scss/components/common/copy-button.scss"></style>
