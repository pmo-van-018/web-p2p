<template>
  <div class="attachment-image h-100">
    <div class="attachment-image__inner h-100" :class="{'attachment-image__inner--empty' : !messages.length}">
      <div v-if="messages.length" class="attachment-image__list">
        <div v-for="message in messages" :key="`file_${message._id}`" class="attachment-image__item">
          <item :message="message" />
        </div>
      </div>
      <empty-attachment v-else>{{ $t('common.no_attachment_image') }}</empty-attachment>
    </div>
  </div>
</template>
<script>
export default {
  components: {
    Item: () => import('~/components/desktop/admin/customers-care/attachment-tabs/images/image.vue'),
    EmptyAttachment: () => import('~/components/desktop/admin/customers-care/attachment-tabs/empty-attachment.vue')
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
.attachment-image {
  &__list {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 8px;
  }
  &__item {
    height: 91px;
  }
  &__inner {
    &--empty {
      display: grid;
      place-content: center;
    }
  }
}
</style>
