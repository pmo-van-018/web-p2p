<template>
  <div class="select-filter">
    <div class="select-filter__container">
      <div v-for="(item, index) in list" :key="index" class="select-filter__item" @click="select(item)">
        <img :src="`/assets/images/common/${selected && item.value === selected.value ? 'radio-active' : 'radio'}.svg`">
        {{ item.title }}
      </div>
    </div>
    <div v-if="!hideAction" class="select-filter__action">
      <button class="button select-filter__action-btn outline" @click="selected = null">Đặt lại</button>
      <button class="button select-filter__action-btn primary" @click="$emit('input', selected)">Xác nhận</button>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => []
    },
    value: {
      type: Object,
      default: () => {}
    },
    hideAction: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      selected: null
    }
  },
  watch: {
    value: {
      handler (value) {
        if (value) {
          this.selected = value
        }
      },
      deep: true
    }
  },
  mounted () {
    this.selected = this.value
  },
  methods: {
    select (item) {
      this.selected = item
      if (this.hideAction) {
        this.$emit('input', item)
      }
    }
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/mobile/user-orders/select-filter.scss" />
