<template>
  <section class="skeleton-loader">
    <b-skeleton animation="fade" width="25%" height="34px"></b-skeleton>
    <div class="skeleton-loader__content">
      <b-skeleton animation="fade" width="20%" height="30px"></b-skeleton>
      <div>
        <b-skeleton animation="fade" width="100%" height="20px"></b-skeleton>
        <b-skeleton animation="fade" width="100%" height="20px"></b-skeleton>
      </div>
      <div>
        <b-skeleton animation="fade" height="20px"></b-skeleton>
        <b-skeleton animation="fade" height="20px"></b-skeleton>
      </div>
      <div>
        <b-skeleton animation="fade" height="20px"></b-skeleton>
        <b-skeleton animation="fade" height="20px"></b-skeleton>
      </div>
    </div>
  </section>
</template>
<style lang="scss" scoped src="static/assets/scss/components/desktop/role-management/orders/info/skeleton.scss">
</style>
