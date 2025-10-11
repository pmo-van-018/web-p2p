<template>
  <div class="suggestion-message" @mouseleave="$emit('mouseleave')">
    <div class="suggestion-message__container">
      <div class="suggestion-message__list">
        <div
          v-for="(suggestion, index) in suggestions"
          :key="`suggestion_${index}`"
          class="suggestion-message__item"
          @click="$emit('on-input', suggestion)"
        >
          {{ suggestion }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    suggestions: {
      type: Array,
      default: () => []
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/chat/suggestion-message.scss">
</style>
