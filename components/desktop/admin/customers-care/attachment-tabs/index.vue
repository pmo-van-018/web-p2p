<template>
  <div class="attachment-section">
    <div class="attachment-section__container">
      <div class="attachment-tab">
        <b-tabs
          nav-class="attachment-tab__tab"
          active-tab-class="attachment-tab__active"
          fill
        >
          <b-tab title="Tệp đính kèm" active>
            <div class="attachment-section__item" :class="{'attachment-section__item--empty' : !messageFiles.length}">
              <list-file v-if="messageFiles.length" :messages="messageFiles" />
              <empty-attachment v-else>
                {{ $t('common.no_attachment_file') }}
              </empty-attachment>
            </div>
          </b-tab>
          <b-tab title="Hình ảnh">
            <div class="attachment-section__item" :class="{'attachment-section__item--empty' : !messageImages.length}">
              <list-image v-if="messageImages.length" :messages="messageImages" />
              <empty-attachment v-else>
                {{ $t('common.no_attachment_image') }}
              </empty-attachment>
            </div>
          </b-tab>
        </b-tabs>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {
    ListFile: () => import('~/components/desktop/admin/customers-care/attachment-tabs/files/index.vue'),
    ListImage: () => import('~/components/desktop/admin/customers-care/attachment-tabs/images/index.vue'),
    EmptyAttachment: () => import('~/components/desktop/admin/customers-care/attachment-tabs/empty-attachment.vue')
  },
  props: {
    messageFiles: {
      type: Array,
      default: () => []
    },
    messageImages: {
      type: Array,
      default: () => []
    }
  }
}
</script>
<style lang="scss" src="static/assets/scss/components/desktop/admin/customer-care/attachment-tabs/index.scss">
</style>
