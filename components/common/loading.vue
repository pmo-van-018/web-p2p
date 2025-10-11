<template>
  <div class="loading">
    <div class="loading__container">
      <loader />
    </div>
  </div>
</template>
<script>
export default {
  components: {
    Loader: () => import('~/components/common/loader.vue')
  },
  mounted () {
    const body = document.body
    body.classList.add('modal-show')
  },
  beforeDestroy () {
    const body = document.body
    body.classList.remove('modal-show')
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/common/loading.scss" />
