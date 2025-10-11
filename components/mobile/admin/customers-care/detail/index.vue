<template>
  <section class="detail-support">
    <loading v-if="isDetailLoading" />
    <div v-else-if="!isDetailLoading && supportRequestDetail" class="detail-support__container">
      <modal-chat
        :room-id="roomId"
        :ref-id="refId"
        :pending-request="isPendingSupportRequest"
        :user-name="userName"
        :visible-first-content="false"
        @on-open-information="$bvModal.show(modalInformationId)"
      />
      <modal-information
        :ref-id="refId"
        :user-name="userName"
        :total-order="totalOrder"
        :rate="rate"
        :is-loading="isResolveSupportRequestLoading"
        :resolved="!isPendingSupportRequest"
        @on-resolved="$_detailSupportRequestMixin_resolveSupportRequestDetail"
      />
    </div>
    <section404 v-else :is-visible-home="false" />
  </section>
</template>
<script>
import detailSupportRequestMixin from '~/mixins/admin-supporter/customers-care/detail.js'

export default {
  components: {
    Section404: () => import('~/components/common/404/index.vue'),
    ModalChat: () => import('~/components/mobile/admin/customers-care/detail/chat.vue'),
    ModalInformation: () => import('~/components/mobile/admin/customers-care/detail/information.vue')
  },
  mixins: [detailSupportRequestMixin],
  data () {
    return {
      modalInformationId: 'modalDetailInformationSupportRequest'
    }
  },
  async created () {
    await this.$_detailSupportRequestMixin_getDetailSupportRequest()
    await this.$_detailSupportRequestMixin_getDataDashboard()
    setTimeout(() => {
      this.$bvModal.show('modalSupportRequestChat')
    }, 200)
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/mobile/admin/customer-care/detail/index.scss">
</style>
