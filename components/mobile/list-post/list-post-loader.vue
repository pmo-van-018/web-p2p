<template>
  <section class="post-loader-list">
    <section v-for="loader in loaders" :key="loader" class="post-loader mb-4">
      <div class="post-loader__container">
        <div class="d-flex align-items-center justify-content-between">
          <b-skeleton animation="fade" width="30%" height="20px"></b-skeleton>
          <b-skeleton animation="fade" width="30%" height="20px"></b-skeleton>
        </div>
        <b-skeleton animation="fade" class="my-2" width="10%" height="20px"></b-skeleton>
        <b-skeleton animation="fade" class="my-2" width="30%" height="20px"></b-skeleton>
        <div class="d-flex align-items-center justify-content-between py-2">
          <div class="d-flex flex-column w-50">
            <div class="d-flex align-items-center">
              <b-skeleton animation="fade" width="100%" height="20px"></b-skeleton>
              <b-skeleton class="ml-2" animation="fade" width="100%" height="20px"></b-skeleton>
            </div>
            <div class="d-flex align-items-center">
              <b-skeleton animation="fade" width="100%" height="20px"></b-skeleton>
              <b-skeleton class="ml-2" animation="fade" width="80%" height="20px"></b-skeleton>
            </div>
          </div>
          <b-skeleton type="button" animation="fade" width="30%" height="32px"></b-skeleton>
        </div>
      </div>
    </section>
  </section>
</template>
<script>
export default {
  data () {
    return {
      loaders: 5
    }
  }
}
</script>
