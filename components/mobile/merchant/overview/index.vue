<template>
  <div class="overview grey-400 w-100">
    <p class="overview__title font-t16m grey-900 mb-0">{{ $t('merchant.overview.title') }}</p>
    <div class="overview__content">
      <div class="overview__item">
        <p class="c-title-border mb-0 grey-800 font-t14b">{{ $t('merchant.overview.command_number') }}</p>
        <div class="d-flex overview-item__border">
          <div class="overview-item flex-grow-1 w-50">
            <p class="overview-item__text font-t20m mb-2">{{ $t('merchant.overview.transaction_pendding') }}</p>
            <span class="overview-item__number grey-900">10</span>
          </div>
          <!-- /item -->
          <div class="overview-item flex-grow-1 w-50">
            <p class="overview-item__text font-t20m mb-2">{{ $t('merchant.overview.transaction_all') }}</p>
            <span class="overview-item__number grey-900">99</span>
          </div>
          <!-- /item -->
        </div>
      </div>
      <!-- /card -->
      <div class="overview__item">
        <p class="c-title-border mb-0 grey-800 font-t14b">{{ $t('merchant.overview.post_all') }}</p>
        <div class="d-flex overview-item__border">
          <div class="overview-item flex-grow-1 w-50">
            <p class="overview-item__text font-t20m mb-2">{{ $t('merchant.overview.post_show') }}</p>
            <span class="overview-item__number grey-900">10</span>
          </div>
          <!-- /item -->
          <div class="overview-item flex-grow-1 w-50">
            <p class="overview-item__text font-t20m mb-2">{{ $t('merchant.overview.post_hide') }}</p>
            <span class="overview-item__number grey-900">99</span>
          </div>
          <!-- /item -->
        </div>
      </div>
      <!-- /card -->
    </div>
  </div>
</template>
<style lang="scss" scoped src="static/assets/scss/components/mobile/merchant/overview/index.scss" />
