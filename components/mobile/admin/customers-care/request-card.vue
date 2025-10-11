<template>
  <article class="request-card">
    <div class="request-card__container">
      <div class="request-card__body">
        <div class="card-content">
          <div class="card-content__row">
            <div class="card-content__text nickname">{{ item.userName || '' }}</div>
            <div :class="['card-content__status', formatUserStatusClass]">
              <div class="status-dot" />
              <span>{{ formatUserStatus }}</span>
            </div>
          </div>
          <div class="card-content__row">
            <div class="card-content__text">{{ $t('customer_care.list_request.label.id') }}</div>
            <div class="card-content__value">
              <span>{{ item?.refId || '' }}</span>
            </div>
          </div>
          <div class="card-content__row">
            <div class="card-content__text">{{ $t('customer_care.list_request.label.created_at') }}</div>
            <div class="card-content__value">
              {{ item?.createdAt | diffForHumans }}
            </div>
          </div>
          <div class="card-content__row">
            <div class="request-card__footer">
              <div class="request-card__inner">
                <status-text :item="item" />
                <type-support-request class="request-card-support" :item="item" />
              </div>
            </div>
            <div class="request-card__action">
              <slot name="action" :item="item" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>
<script>
export default {
  components: {
    TypeSupportRequest: () => import('~/components/common/customer-care/type-support.vue'),
    StatusText: () => import('~/components/common/customer-care/status-text.vue')
  },
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    formatUserStatus () {
      return this.item?.userStatus ? this.$t('customer_care.online') : this.$t('customer_care.offline')
    },
    formatUserStatusClass () {
      return this.item?.userStatus ? 'online' : 'offline'
    }
  }
}
</script>
<style lang="scss" src="static/assets/scss/components/mobile/admin/customer-care/request-card.scss">
</style>
