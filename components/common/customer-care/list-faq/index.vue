<template>
  <section class="list-faq">
    <div class="list-faq__title">{{ $t('customer_care.title_faq') }}</div>
    <div class="list-faq__grid">
      <div
        v-for="(item, index) in faqs"
        :key="`faq_${index}`"
        class="list-faq__item"
      >
        <item-faq
          :item="item"
          @on-selected="$emit('on-selected', item)"
        />
      </div>
    </div>
  </section>
</template>
<script>
export default {
  components: {
    ItemFaq: () => import('~/components/common/customer-care/list-faq/items.vue')
  },
  props: {
    faqs: {
      type: Array,
      default: () => []
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/common/customer-care/list-faq/index.scss">
</style>
