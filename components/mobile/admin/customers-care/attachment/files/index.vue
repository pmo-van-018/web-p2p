<template>
  <div class="attachment-file h-100">
    <div class="attachment-file__inner h-100" :class="{'attachment-file__inner--empty' : !messages.length}">
      <div v-if="messages.length" class="attachment-file__list">
        <item
          v-for="message in messages"
          :key="`file_${message._id}`"
          :message="message"
          :sign-cookie-query="signedCookieQueryParam"
          class="attachment-file__item"
        />
      </div>
      <empty-attachment v-else>{{ $t('common.no_attachment_file') }}</empty-attachment>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  components: {
    Item: () => import('~/components/mobile/admin/customers-care/attachment/files/item.vue'),
    EmptyAttachment: () => import('~/components/desktop/admin/customers-care/attachment-tabs/empty-attachment.vue')
  },
  props: {
    messages: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    ...mapGetters('chat-support-request', ['signedCookieQueryParam'])
  }
}
</script>
<style lang="scss" scoped>
.attachment-file {
  &__list {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 8px;
  }
  &__item {
    min-width: 113px;
  }
  &__inner {
    &--empty {
      display: grid;
      place-content: center;
    }
  }
}
</style>
