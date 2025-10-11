<template>
  <div
    class="chat-icon-wrapper"
    :class="{
      'unread': unread ,
      'bordered': bordered ,
    }"
    @click="$emit('click')"
  >
    <div class="chat-icon-wrapper__inner">
      <svg-icon
        :icon="icon"
        class="chat-icon-wrapper__icon"
      />
    </div>
  </div>
</template>
<script>
export default {
  components: {
    SvgIcon: () => import('~/components/common/svg-icon/index.vue')
  },
  props: {
    unread: {
      type: Boolean,
      default: false
    },
    bordered: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      require: true
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/common/icons/icon-chat.scss">
</style>
