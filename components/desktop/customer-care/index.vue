<template>
  <div class="customer-care-wrapper" :class="{ 'visible': isVisibleChat }">
    <div class="customer-care-wrapper__container">
      <div class="customer-care-wrapper__head">
        <div v-if="activatedComponent !== 'ListFaq'" class="customer-care-wrapper__head-left" @click="onClickBack">
          <span class="customer-care-wrapper__icon-back icon-arrow-left-long"></span>
        </div>
        <div class="customer-care-wrapper__head-center">{{ title }}</div>
        <div class="customer-care-wrapper__head-right" @click="setVisibleChat(false)">
          <div class="customer-care-wrapper__icon-mini">
            <span class="customer-care-wrapper__icon-mini-line" />
          </div>
        </div>
      </div>
      <div class="customer-care-wrapper__body">
        <component
          :is="activatedComponent"
          :faqs="faqCategories"
          :questions="questions"
          :room-id="roomId"
          :request-id="requestId"
          :request-type-text="requestTypeText"
          @on-selected="onSelectedFaq"
          @on-request-support="onRequestSupportToChat"
        />
      </div>
      <div v-if="isVisibleActionSupportRequest" class="customer-care-wrapper__action">
        <base-button
          variants="contained"
          color="primary"
          full-width
          :loading="isRequestSupportLoading"
          :disabled="isRequestSupportLoading"
          @click="onSelectedChatSupport"
        >
          {{ $t('action.request_supporter') }}
        </base-button>
      </div>
    </div>
  </div>
</template>
<script>
import homeCustomerCareMixin from '~/mixins/customer-care/home'

export default {
  components: {
    ListFaq: () => import('~/components/common/customer-care/list-faq/index.vue'),
    BaseButton: () => import('~/components/common/base-button/index.vue'),
    DetailFaq: () => import('~/components/common/customer-care/detail-faq/index.vue'),
    ChatSupport: () => import('~/components/common/customer-care/chat/index.vue'),
    SvgIcon: () => import('~/components/common/svg-icon/index.vue')
  },
  mixins: [homeCustomerCareMixin]
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/customer-care/index.scss">
</style>
