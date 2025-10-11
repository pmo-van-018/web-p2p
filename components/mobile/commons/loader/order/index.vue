<template>
  <div class="order-card-loader">
    <div class="order-card-loader__container">
      <div class="order-card-loader__head">
        <b-skeleton animation="fade" height="20" width="50%"></b-skeleton>
        <b-skeleton animation="fade" height="20" width="12%"></b-skeleton>
      </div>
      <div class="order-card-loader__content">
        <b-skeleton animation="fade" height="16" width="80%"></b-skeleton>
        <b-skeleton animation="fade" height="16" width="50%"></b-skeleton>
        <b-skeleton animation="fade" height="16" width="60%"></b-skeleton>
      </div>
      <div class="order-card-loader__footer">
        <b-skeleton animation="fade" height="16" width="40%"></b-skeleton>
        <b-skeleton animation="fade" height="16" width="20%"></b-skeleton>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped src="static/assets/scss/components/mobile/commons/loader/order/index.scss">
</style>
