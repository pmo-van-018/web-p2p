<template>
  <div class="progress-line">
    <div :class="['progress-line__outer', { 'progress-line__full-width': !showInfo }]">
      <div class="progress-line__inner">
        <div class="progress-line__bg" :style="{ width: `${validProgress}%`}" />
      </div>
    </div>
    <span v-if="showInfo" class="progress-line__text">{{ validProgress }}%</span>
  </div>
</template>
<script>
export default {
  props: {
    percent: {
      type: [Number, String],
      default: 0,
      validator (value) {
        return value >= 0 && value <= 100
      }
    },
    showInfo: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    validProgress () {
      const percent = Number(this.percent)
      if (!percent || percent < 0) {
        return 0;
      }
      if (percent > 100) {
        return 100;
      }
      return percent;
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/common/progress-line/index.scss">
</style>
