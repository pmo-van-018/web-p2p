<template>
  <div class="stepper-order">
    <div class="stepper-order__header">
      <div class="steps-progress mb-1">
        <div
          v-for="(step, index) in steps"
          :key="index"
          class="steps-progress-item"
          :class="{
            'steps-progress-item--active':
              checkActive(step) || index < indexStepActive,
          }"
        >
          <span v-if="step.isCancel" class="icon-cancel" />
          <span v-else-if="step.isDone || indexStepActive > index" class="icon-check" />
          <span v-else> {{ index + 1 }} </span>
        </div>
      </div>
      <div class="steps-label">
        <div
          v-for="(step, index) in steps"
          :key="index"
          class="steps-label-item"
          :class="{
            'steps-label-item--active': checkActive(step) || index < indexStepActive,
            'steps-label-item--progressing': checkActive(step)
          }"
        >
          {{ step.label }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StepByStepOrder',
  props: {
    steps: {
      type: Array,
      default: () => []
    },
    currentStep: {
      type: String,
      default: ''
    }
  },
  computed: {
    indexStepActive () {
      return this.steps.findIndex(step => this.checkActive(step));
    },
    activeStep () {
      return this.steps.find(step => this.checkActive(step));
    }
  },
  methods: {
    checkActive (step) {
      return step.stepName.includes(this.currentStep);
    }
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/common/stepper-order.scss" />
