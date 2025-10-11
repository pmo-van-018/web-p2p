<template>
  <div class="role-management">
    <div class="role-management__heading role-management__heading--grey">
      <p class="role-management__title">{{ $t('transaction.title') }}</p>
      <p class="role-management__description">{{ $t('transaction.description') }}</p>
    </div>
    <div class="role-management__content">
      <div class="role-management__body">
        <order-list />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {
    OrderList: () => import('@/components/desktop/admin/orders/list.vue')
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/role-management/index.scss" />
