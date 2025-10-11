<template>
  <div>
    <authentication-operation />
    <modal-response />
  </div>
</template>

<script>
export default {
  middleware: 'authenticate-operations',
  components: {
    AuthenticationOperation: () => import('~/components/desktop/admin/authentication/index.vue'),
    ModalResponse: () => import('~/components/common/modal/modal-response.vue')
  }
};
</script>
