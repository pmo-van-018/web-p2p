<template>
  <div class="page-503 flex-grow-1 d-flex align-items-center justify-content-center flex-column">
    <div class="page-503__img">
      <img class="logo" src="/assets/images/common/503.svg" alt="503">
    </div>
    <div class="page-503__content text-center">
      <p class="page-503__txt grey-900">
        {{ $t('maintenance.title') }}
      </p>
      <p class="page-503__note mb-1 grey-400"> {{ $t('maintenance.note') }}</p>
      <p class="page-503__date mb-0">15:00 - 31/10/2022</p>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped src="static/assets/scss/components/common/page-503.scss" />
