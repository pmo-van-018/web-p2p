<template>
  <div class="setting-item grey-400 font-t14r">
    <div class="setting-item__content">
      <div class="setting-item__left">
        <div class="setting-item__icon" :class="icon" />
        <p class="setting-item__title mb-1 grey-900 font-t14m">{{ title }}</p>
        <p class="setting-item__description">{{ description }}</p>
      </div>
      <div
        class="setting-item__right d-flex justify-content-between align-items-center"
      >
        <div class="setting-item__text d-flex align-items-center grey-900">
          <slot />
        </div>
        <span
          v-show="!isDisableButton"
          class="setting-item__button font-t14m"
          role="button"
          @click="showModal(modal)"
        >{{ $t('merchant.settings.button') }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { MODAL } from '@/resources/modal.js';
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    },
    isDisableButton: {
      type: Boolean,
      default: false
    },
    modal: {
      type: String,
      default: ''
    }
  },
  methods: {
    showModal (modal) {
      this.$bvModal.show(MODAL[modal]);
    }
  }
};
</script>

<style
  lang="scss"
  scoped
  src="static/assets/scss/components/common/settings/item.scss"
/>
