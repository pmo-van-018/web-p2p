<template>
  <div class="support-action">
    <span class="icon-question support-action__icon" />
    <div class="support-action__text">{{ title }}</div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/common/transfer-to-seller/support-action.scss" />
