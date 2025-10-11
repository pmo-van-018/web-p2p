<template>
  <div class="row">
    <div class="col">
      <b-skeleton-img class="skeleton-loader" no-aspect></b-skeleton-img>
    </div>
    <div class="col">
      <b-skeleton-img no-aspect class="skeleton-loader"></b-skeleton-img>
    </div>
    <div class="col">
      <b-skeleton-img no-aspect class="skeleton-loader"></b-skeleton-img>
    </div>
    <div class="col-12 mt-3">
      <div class="row">
        <div class="col">
          <b-skeleton-img class="skeleton-loader" no-aspect></b-skeleton-img>
        </div>
        <div class="col">
          <b-skeleton-img no-aspect class="skeleton-loader"></b-skeleton-img>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.skeleton-loader {
  height: 200px;
  border-radius: 8px;
}
</style>
