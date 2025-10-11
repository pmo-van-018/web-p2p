<template>
  <b-modal
    :id="modalId"
    modal-class="modal-custom"
    centered
    hide-header
    hide-footer
    hide-backdrop
    hide-header-close
    no-close-on-backdrop
    no-close-on-esc
    no-fade
    @hide="$emit('hide')"
  >
    <div class="modal-support-request">
      <div class="modal-support-request__head">
        <span class="modal-support-request__head-left icon-arrow-left-long" @click="$router.go(-1)" />
        <div class="modal-support-request__head-center">{{ title }}</div>
        <span class="modal-support-request__head-right icon-menu" @click="$emit('on-open-information')" />
      </div>
      <div class="modal-support-request__body">
        <customer-chat
          :room-id="roomId"
          :ref-id="refId"
          :pending-request="pendingRequest"
          :user-name="userName"
          :visible-first-content="false"
        />
      </div>
    </div>
  </b-modal>
</template>
<script>
export default {
  components: {
    CustomerChat: () => import('~/components/common/customer-care/chat/index.vue')
  },
  props: {
    roomId: {
      type: String,
      default: ''
    },
    refId: {
      type: String,
      default: ''
    },
    requestTypeText: {
      type: String,
      default: ''
    },
    userName: {
      type: String,
      default: ''
    },
    visibleFirstContent: {
      type: Boolean,
      default: true
    },
    pendingRequest: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      modalId: 'modalSupportRequestChat'
    }
  },
  computed: {
    title () {
      return this.$t('customer_care.title')
    }
  },
  methods: {
    onBackToSection () {}
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/mobile/admin/customer-care/detail/chat.scss">
</style>
