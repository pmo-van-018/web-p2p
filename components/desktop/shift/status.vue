<template>
  <div class="shift-status" :class="classShiftStatus">
    <div class="shift-status__content">
      <span class="shift-status__icon" :class="iconShiftStatus" />
      <span class="shift-status__text">{{ textShiftStatus }}</span>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState('user', ['isShiftProcessing']),
    textShiftStatus () {
      return this.isShiftProcessing ? this.$t('shift_management.in_shift') : this.$t('shift_management.yet_shift')
    },
    classShiftStatus () {
      return this.isShiftProcessing ? 'success' : 'warning'
    },
    iconShiftStatus () {
      return this.isShiftProcessing ? 'icon-checkout' : 'icon-warning-rhombus'
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/shift/status.scss">
</style>
