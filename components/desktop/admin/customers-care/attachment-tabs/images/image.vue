<template>
  <div class="image-message h-100 w-100">
    <div class="image-message__container h-100 w-100" @click="onViewImage">
      <img ref="image" :src="urlImage" alt="image" loading="lazy">
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import 'viewerjs/dist/viewer.css'
import VueViewer from 'v-viewer'
import Vue from 'vue'
Vue.use(VueViewer)

export default {
  props: {
    message: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters('chat-support-request', ['signedCookieQueryParam']),
    urlImage () {
      return `${this.message.fileUpload?.completedUrl}?${this.signedCookieQueryParam}`
    }
  },
  methods: {
    onViewImage () {
      this.$viewerApi({
        options: {
          inline: false,
          button: false,
          navbar: false,
          title: false,
          toolbar: false,
          tooltip: false,
          movable: false,
          zoomable: true,
          rotatable: false,
          scalable: true,
          transition: true,
          fullscreen: true,
          keyboard: false
        },
        images: [this.urlImage]
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.image-message {
  &__container {
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
}
</style>
