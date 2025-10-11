<template>
  <div class="title-header">
    <div class="title-header__title">
      {{ title }}
    </div>
    <div class="title-header__sub-title">
      {{ subTitle }}
      <span v-if="desc">{{ desc }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    subTitle: {
      type: String,
      default: ''
    },
    desc: {
      type: String,
      default: ''
    }
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/common/transfer-to-seller/title-header.scss" />
