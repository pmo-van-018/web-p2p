<template>
  <div>
    <div @click="visible = !visible">
      <span
        :class="[
          'time-line-step',
          timelineNumber ? timelineNumber : '',
          { visible: visible }
        ]"
      />
      <h5 class="home-join__timeline--title">{{ title }}</h5>
    </div>
    <b-collapse v-model="visible" accordion="collapse" role="tabpanel">
      <slot />
    </b-collapse>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    timelineNumber: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      visible: false
    }
  }
}
</script>

<style lang="scss" scoped src="static/assets/scss/components/desktop/landing/components/collapse-timeline/index.scss" />
