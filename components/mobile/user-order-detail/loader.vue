<template>
  <div class="skeleton-loader">
    <div class="skeleton-loader__container">
      <div class="skeleton-loader__head">
        <b-skeleton animation="fade" width="85%" height="32px"></b-skeleton>
        <b-skeleton animation="fade" width="55%"></b-skeleton>
        <b-skeleton animation="fade" width="70%"></b-skeleton>
        <b-skeleton animation="fade" width="20%"></b-skeleton>
        <b-skeleton animation="fade" width="40%"></b-skeleton>
      </div>
      <div class="skeleton-loader__info">
        <b-skeleton animation="fade" width="120px" height="24px"></b-skeleton>
        <div class="skeleton-loader__context">
          <div class="d-flex flex-column">
            <b-skeleton animation="fade" width="70px" height="16px"></b-skeleton>
            <b-skeleton animation="fade" width="120px" height="28px"></b-skeleton>
          </div>
          <div class="d-flex flex-column">
            <b-skeleton animation="fade" width="70px" height="16px"></b-skeleton>
            <b-skeleton animation="fade" width="120px" height="28px"></b-skeleton>
          </div>
          <div class="d-flex flex-column">
            <b-skeleton animation="fade" width="70px" height="16px"></b-skeleton>
            <b-skeleton animation="fade" width="120px" height="28px"></b-skeleton>
          </div>
        </div>
        <div class="skeleton-loader__inner">
          <b-skeleton class="mb-2" animation="fade" width="90px" height="24px"></b-skeleton>
          <div class="d-flex justify-content-between mb-2">
            <b-skeleton animation="fade" width="20%" height="20px"></b-skeleton>
            <b-skeleton animation="fade" width="40%" height="20px"></b-skeleton>
          </div>
          <div class="d-flex justify-content-between mb-2">
            <b-skeleton animation="fade" width="35%" height="20px"></b-skeleton>
            <b-skeleton animation="fade" width="50%" height="20px"></b-skeleton>
          </div>
          <div class="d-flex justify-content-between mb-2">
            <b-skeleton animation="fade" width="10%" height="20px"></b-skeleton>
            <b-skeleton animation="fade" width="70%" height="20px"></b-skeleton>
          </div>
          <div class="d-flex justify-content-between mb-2">
            <b-skeleton animation="fade" width="50%" height="20px"></b-skeleton>
            <b-skeleton animation="fade" width="20%" height="20px"></b-skeleton>
          </div>
          <div class="d-flex justify-content-between mb-2">
            <b-skeleton animation="fade" width="30%" height="20px"></b-skeleton>
            <b-skeleton animation="fade" width="30%" height="20px"></b-skeleton>
          </div>
        </div>
        <b-skeleton-img no-aspect height="150px" />
        <div class="skeleton-loader__action">
          <b-skeleton height="40px" width="50%" type="button" animation="fade" />
          <b-skeleton height="40px" width="60%" type="button" animation="fade" />
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped src="static/assets/scss/components/mobile/user-order-detail/loader.scss">
</style>
