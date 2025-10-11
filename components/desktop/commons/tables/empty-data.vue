<template>
  <div class="empty-data">
    <div class="empty-data__container">
      <svg>
        <use xlink:href="#no-data" />
      </svg>
      <div class="empty-data__text">{{ $t('table.no_data') }}</div>
    </div>
  </div>
</template>
<style lang="scss" scoped src="static/assets/scss/components/desktop/commons/table/empty-data.scss">
</style>
