<template>
  <wrapper-message
    :message="message"
    :received="received"
    :role-text="roleText"
    :role-operation-text="roleOperationText"
    :name-text-color="nameTextColor"
  >
    <div class="image-message">
      <div class="image-message__wrapper" @click="onViewImage">
        <div class="image-message__container">
          <img ref="image" :src="urlImage" alt="image" loading="lazy">
        </div>
      </div>
    </div>
  </wrapper-message>
</template>
<script>
import 'viewerjs/dist/viewer.css'
import VueViewer from 'v-viewer'
import Vue from 'vue'
Vue.use(VueViewer)

export default {
  components: {
    WrapperMessage: () => import('~/components/desktop/chat/message/wrapper-message.vue')
  },
  props: {
    message: {
      type: Object,
      required: true
    },
    received: {
      type: Boolean,
      default: false
    },
    nameTextColor: {
      type: String,
      default: ''
    },
    date: {
      type: String,
      default: ''
    },
    roleText: {
      type: String,
      default: ''
    },
    roleOperationText: {
      type: String,
      default: ''
    },
    signCookieQuery: {
      type: String,
      default: ''
    }
  },
  computed: {
    urlImage () {
      return `${this.message.fileUpload?.completedUrl}?${this.signCookieQuery}`
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
<style lang="scss" scoped src="static/assets/scss/components/desktop/chat/message/image-message.scss">
</style>
