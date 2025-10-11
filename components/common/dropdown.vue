<template>
  <div class="dropdown">
    <b-dropdown class="dropdown__container" :disabled="disabled">
      <template #button-content>
        <div v-if="!value" class="dropdown__placeholder">{{ placeholder }}</div>
        <div v-else class="dropdown__value">
          {{ value.title }}
        </div>
      </template>
      <div class="dropdown__list">
        <b-dropdown-item
          v-for="(item, key) in list"
          :key="key"
          class="dropdown__item"
          :class="{ 'dropdown__item--active': value && value.value === item.value }"
          @click="$emit('input', item)"
        >
          <div class="dropdown__item-title">{{ item.title }}</div>
        </b-dropdown-item>
      </div>
    </b-dropdown>
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
    placeholder: {
      type: String,
      default: '-'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/common/dropdown.scss" />
