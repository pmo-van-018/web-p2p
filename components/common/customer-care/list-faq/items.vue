<template>
  <div class="faq-item" @click="$emit('on-selected', item)">
    <div class="faq-item__container">
      <div class="faq-item__top">
        <div class="faq-item__inner">
          <div class="faq-item__icon">
            <img :src="item.icon" :alt="item.title" loading="lazy">
          </div>
          <div class="faq-item__title">{{ item.title }}</div>
        </div>
      </div>
      <div class="faq-item__content">
        <p>{{ item.content }}</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/common/customer-care/list-faq/items.scss">
</style>
