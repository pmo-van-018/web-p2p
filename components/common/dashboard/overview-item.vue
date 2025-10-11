<template>
  <div class="overview-item">
    <div class="overview-item__ttl">
      <p class="overview-item__text grey-500 m-0">{{ data.title }} <br v-if="data.times" class="d-none d-md-block"> {{ data.times }} </p>
      <span :id="`dashboard-${data.id}`" @click="showTooltip()" class="overview-item__icon icon-info-circle ml-1" tabindex="0" />
      <b-tooltip :target="`dashboard-${data?.id}`" :triggers="$device.isMobileOrTablet ? 'focus' : 'hover'">
        <span v-html="data.note"></span>
      </b-tooltip>
    </div>
    <div class="overview-item__content">
      <span class="mb-1 overview__item-number grey-900 font-t20r d-flex align-items-center justify-content-end justify-content-md-center">
        <span class="font-t20r">{{ data.content }}</span>
        <span v-if="data.isSlot" class="font-t16r ml-1">{{ data.unit }}</span></span>
      <p v-if="data.totalTransactionBuy || data.totalTransactionSell" class="d-flex justify-content-center font-t12r mb-0">
        <span class="buy-color">{{ $t('common.buy') }} {{ data.totalTransactionBuy || 0 }}</span>
        <span class="mx-1">|</span>
        <span class="sell-color">{{ $t('common.sell') }} {{ data.totalTransactionSell || 0 }}</span>
      </p>
      <p v-if="data.isInactive" class="text-center mb-0 font-t12r">{{ $t('overview.block') }}<span class="grey-900 mx-1">{{ data.numMerchantInactive }}</span>{{ $t('overview.person') }}</p>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    showTooltip () {
      this.$root.$emit('bv::hide::tooltip')
      this.$root.$emit('bv::show::tooltip', `dashboard-${this.data?.id}`)
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/common/dashboard/item.scss" />
