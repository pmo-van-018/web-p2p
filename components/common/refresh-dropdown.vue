<template>
  <div class="refresh-dropdown">
    <div v-if="isPause" class="refresh-button" @click="$emit('play')">
      <span class="refresh-dropdown-icon icon-pause"><span class="path1" /><span class="path2" /></span>
      <span class="refresh-dropdown__placeholder">{{ $t('common.pause') }}</span>
    </div>
    <div v-else class="refresh-dropdown__group">
      <b-dropdown class="refresh-dropdown__container">
        <template #button-content>
          <span class="refresh-dropdown-icon icon-reload" :class="{'loading': isLoading}"><span class="path1" /><span class="path2" /></span>
          <span class="refresh-dropdown__placeholder">{{ placeholder }}</span>
        </template>
        <div class="dropdown__list">
          <b-dropdown-item
            v-for="(item, refreshKey) in list"
            :key="refreshKey"
            class="dropdown__item"
            @click="$emit('input', item)"
          >
            <div class="dropdown__item-title">{{ item.title }}</div>
          </b-dropdown-item>
        </div>
      </b-dropdown>
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
    placeholder: {
      type: String,
      default: '-'
    },
    isPause: {
      type: Boolean,
      default: false
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/common/refresh-dropdown.scss" />
