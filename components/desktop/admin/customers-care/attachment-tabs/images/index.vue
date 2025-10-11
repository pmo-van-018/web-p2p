<template>
  <div class="list-image">
    <div class="list-image__container">
      <div class="list-image__wrapper">
        <image-item v-for="message in messages" :key="`file_${message._id}`" :message="message" class="list-image__item" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {
    ImageItem: () => import('~/components/desktop/admin/customers-care/attachment-tabs/images/image.vue')
  },
  props: {
    messages: {
      type: Array,
      default: () => []
    }
  }
}
</script>
<style lang="scss" scoped>
.list-image {
  &__wrapper {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 24px 8px;
  }
  &__item {
    min-height: 105px;
    background-color: #F4F4F5;
    display: flex;
    align-items: center;
  }
}
</style>
