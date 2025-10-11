<template>
  <div class="stepper-order-detail">
    <div v-for="(item, index) in steps" :key="index" class="step-item">
      <div v-if="displayNoteStep" class="step-item__icon">
        <div v-if="!item.isNote" class="icon-dot" />
        <span v-else class="icon-note" />
        <div class="icon-hr" />
      </div>
      <div class="step-item__content">
        <div
          class="step-item__title"
          :class="{ 'step-item__title--note': item.isNote }"
          @click="onClickLabel(item)"
        >
          <span v-if="item.isNote" class="icon-question" />
          <span class="step-item__text">{{ item.label }}</span>
        </div>
        <component :is="item.component" :class="item.class" :class-name="item.className" @action="action" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StepperOrderDetail',
  props: {
    steps: {
      type: Array,
      default: () => []
    },
    displayNoteStep: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onClickLabel (item) {
      if (item.click) {
        item.click()
      }
    },
    action (type) {
      this.$emit('action', type)
    }
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/common/stepper-order-detail.scss" />
