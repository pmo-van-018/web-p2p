<template>
  <section class="filter-header">
    <div class="filter-header__inner">
      <div class="filter-header__text">{{ $t('customer_care.number_has_received') }}: 0/5</div>
      <div class="filter-header__icon" @click="$bvModal.show(modalId)">
        <svg>
          <use xlink:href="#icon-filter" />
        </svg>
      </div>
    </div>
  </section>
</template>
<script>
import { MODAL } from '@/resources/modal'

export default {
  data () {
    return {
      modalId: MODAL.FILTER_SEARCH_SUPPORT_REQUEST
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/mobile/admin/customer-care/filter-head.scss">
</style>
