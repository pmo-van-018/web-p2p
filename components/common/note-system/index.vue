<template>
  <div class="note-system">
    <div class="note-system__container">
      <div class="note-system__head">
        <span class="note-system__icon icon-question" />
        <div class="note-system__title">{{ title || $t('home.note') }}</div>
      </div>
      <div class="note-system__body">
        <ul class="note-system__note" :class="styleListType">
          <li v-for="(note, index) in notes" :key="index" class="note-system__item">
            {{ note }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    listStyleType: {
      type: String,
      default: 'decimal'
    },
    title: {
      type: String,
      default: ''
    },
    notes: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    styleListType () {
      return this.listStyleType === 'none' || this.notes.length === 1 ? 'single' : null
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/common/note-system/index.scss">
</style>
