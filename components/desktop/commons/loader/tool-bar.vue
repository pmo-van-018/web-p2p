<template>
  <div class="tool-bar-loader">
    <div class="container-xl">
      <div class="tool-bar-loader__wrapper">
        <div class="tool-bar-loader__inner">
          <div class="tool-bar-loader__type">
            <b-skeleton class="tool-bar-loader__skeleton" height="40px" width="100%" animation="fade"></b-skeleton>
            <b-skeleton class="tool-bar-loader__skeleton" height="40px" width="100%" animation="fade"></b-skeleton>
          </div>
          <div class="tool-bar-loader__filter">
            <b-skeleton class="tool-bar-loader__skeleton" height="40px" width="20%" animation="fade"></b-skeleton>
            <b-skeleton class="tool-bar-loader__skeleton" height="40px" width="25%" animation="fade"></b-skeleton>
            <b-skeleton class="tool-bar-loader__skeleton" height="40px" width="22%" animation="fade"></b-skeleton>
          </div>
        </div>
        <div class="tool-bar-loader__action">
          <b-skeleton animation="fade" height="40" width="50%" type="button"></b-skeleton>
          <b-skeleton animation="fade" height="40" width="20%" type="button"></b-skeleton>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped src="static/assets/scss/components/desktop/commons/loader/tool-bar.scss">
</style>
