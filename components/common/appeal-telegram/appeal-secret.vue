<template>
  <div class="appeal-secret">
    <div class="appeal-secret_title">
      <span class="appeal-secret__title-content">Mã tra cứu khiếu nại</span>
      <span id="appeal-secret-label-id" v-b-tooltip.focus tabindex="0" class="icon-info" />
      <b-tooltip target="appeal-secret-label-id" :triggers="tooltipTrigger">
        Người dùng có thể sao chép mã và tra cứu tình trạng khiếu nại của giao dịch thông qua Telegram bot
      </b-tooltip>
    </div>
    <div class="appeal-secret__content">
      <img src="/assets/icons/telegram.svg" alt="Telegram Icon">
      <span class="appeal-secret__text"> {{ secret }} </span>
      <CopyButton :value="secret" />
    </div>
  </div>
</template>
<script>

import CopyButton from '@/components/common/copy-button.vue';

export default {
  components: {
    CopyButton
  },
  props: {
    secret: {
      type: String,
      default: ''
    }
  },
  computed: {
    tooltipTrigger () {
      return this.$device.isMobileOrTablet ? 'focus' : 'hover';
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/common/appeal-telegram/appeal-secret.scss" />
