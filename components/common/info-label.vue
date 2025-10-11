<template>
  <div class="info-label" :class="className">
    <div class="info-label__title" :class="{'flex-center' : labelNote}">
      {{ title }} <span v-if="labelNote" v-b-tooltip.hover class="icon-info info-label__icon" :title="labelNote" />
    </div>
    <div v-if="value" class="info-label__value" :class="valueClass">
      {{ value }} <CopyButton v-if="canCopy" :id="value" :value="valueCopy ? valueCopy : value" :placement="className === 'mobile' ? 'right' : 'left'" />
      <p v-if="assetFormat" class="info-label__network" :class="valueClass" v-html="assetFormat" />
    </div>
  </div>
</template>

<script>
import CopyButton from '@/components/common/copy-button.vue';
export default {
  components: {
    CopyButton
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    },
    valueCopy: {
      type: String,
      default: ''
    },
    valueClass: {
      type: String,
      default: ''
    },
    canCopy: {
      type: Boolean,
      default: false
    },
    labelNote: {
      type: String,
      default: ''
    },
    className: {
      type: String,
      default: ''
    },
    assetFormat: {
      type: String,
      default: ''
    }
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/common/info-label.scss" />
