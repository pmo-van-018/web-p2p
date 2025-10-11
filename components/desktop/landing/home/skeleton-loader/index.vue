<template>
  <div class="skeleton-loader">
    <div class="container">
      <div class="skeleton-loader__list">
        <b-skeleton-img no-aspect height="100px"></b-skeleton-img>
        <b-skeleton-img no-aspect height="100px"></b-skeleton-img>
      </div>
      <b-skeleton-img no-aspect height="100px" class="mt-3"></b-skeleton-img>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.skeleton-loader {
  &__list {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 1rem;
  }
}
</style>
