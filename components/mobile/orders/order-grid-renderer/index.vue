<template>
  <section class="order-grid-renderer">
    <div class="order-grid-renderer__container">
      <div v-if="!!$slots.note" class="order-grid-renderer__note">
        <slot name="note" />
      </div>
      <div class="order-grid-renderer__head">
        <slot name="head" />
      </div>
      <div class="order-grid-renderer__body">
        <div class="order-grid-renderer__list">
          <slot name="body" />
        </div>
      </div>
    </div>
  </section>
</template>
<style lang="scss" scoped src="static/assets/scss/components/mobile/orders/order-grid-renderer/index.scss">
</style>
