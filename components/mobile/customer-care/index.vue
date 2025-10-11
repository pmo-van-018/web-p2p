<template>
  <div class="customer-care-wrapper" :class="{ 'visible': isVisibleChat }">
    <div class="customer-care-wrapper__container">
      <div class="customer-care-wrapper__head">
        <div class="customer-care-wrapper__head-left" @click="onBackToSection">
          <span class="customer-care-wrapper__icon-back icon-arrow-left-long"></span>
        </div>
        <div class="customer-care-wrapper__head-center">{{ title }}</div>
        <div class="customer-care-wrapper__head-right" @click="setVisibleChat(false)">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect
              x="9.22266"
              y="15.4414"
              width="14.2222"
              height="1.77778"
              rx="0.888889"
              fill="white"
            />
          </svg>
        </div>
      </div>
      <div class="customer-care-wrapper__body" :class="{'p-0 customer-care-wrapper__body--height': !isVisibleActionSupportRequest}">
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
    ChatSupport: () => import('~/components/common/customer-care/chat/index.vue')
  },
  mixins: [homeCustomerCareMixin]
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/mobile/customer-care/index.scss">
</style>
