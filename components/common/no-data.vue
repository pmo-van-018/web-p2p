<template>
  <section class="no-data">
    <img v-if="thumb" :src="thumb" :alt="title || $t('merchant.no_data')">
    <svg v-else>
      <use xlink:href="#no-data" />
    </svg>
    <span>{{ title || $t('merchant.no_data') }}</span>
  </section>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    thumb: {
      type: String,
      default: ''
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/common/no-data.scss" />
