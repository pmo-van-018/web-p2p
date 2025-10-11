<template>
  <div class="bank-note">
    <div class="d-flex align-items-center justify-content-between" @click="expand = !expand">
      <div class="bank-note__head">
        <span class="bank-note__icon icon-person-star" />
        <div class="bank-note__title">{{ $t('home.note_operation') }}</div>
      </div>
      <div v-if="displayExpand" class=" bank-note__expand" :class="{'narrow': !expand}">
        <span class="icon-arrow-up" />
      </div>
    </div>
    <ul v-if="expand" class="bank-note__list">
      <li v-for="(item, index) in notes" :key="index">{{ item }}</li>
    </ul>
  </div>
</template>
<script>

export default {
  props: {
    displayExpand: {
      type: Boolean,
      default: false
    },
    note: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      expand: !this.displayExpand
    }
  },
  computed: {
    notes () {
      return this.note?.split(/\r?\n/)?.filter(item => item !== '')
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/common/transfer-to-seller/transfer-info/bank-note.scss" />
