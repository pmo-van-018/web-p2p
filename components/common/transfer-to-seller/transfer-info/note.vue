<template>
  <div class="note">
    <div class="note__wrapper" :class="{'note__title--narrow': !expand}">
      <div class="note__head">
        <span class="icon-question note__icon" />
        <div class="note__title">{{ $t('home.note') }}</div>
      </div>
      <div class="note__title-content" @click="expand = !expand">
        <div class="d-flex align-items-center">
          <span class="icon-question note__icon" />
          <div class="note__title-text">
            {{ $t('home.note') }}
          </div>
        </div>
        <div class="note__expand" :class="{'narrow': !expand}">
          <span class="icon-arrow-up" />
        </div>
      </div>
    </div>
    <ul v-if="expand" class="note__list">
      <li v-for="(note, index) in notes" :key="index" class="note__item">
        {{ note }}
      </li>
    </ul>
  </div>
</template>

<script>

export default {
  props: {
    notes: {
      type: Array,
      default: () => []
    },
    displayExpand: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      expand: !this.displayExpand
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/common/transfer-to-seller/transfer-info/note.scss" />
