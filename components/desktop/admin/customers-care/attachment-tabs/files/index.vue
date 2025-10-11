<template>
  <div class="list-file">
    <div class="list-file__container">
      <div class="list-file__wrapper">
        <file-item
          v-for="message in messages"
          :key="`file_${message._id}`"
          :message="message"
          :sign-cookie-query="signedCookieQueryParam"
          class="list-file__item"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  components: {
    FileItem: () => import('~/components/desktop/admin/customers-care/attachment-tabs/files/file.vue')
  },
  props: {
    messages: {
      type: Array,
      default: () => []
    },
    images: {
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
.list-file {
  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  &__item {
    display: flex;
    gap: 8px;
  }
}
</style>
