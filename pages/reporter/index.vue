<template>
  <div>
    <authentication-operation />
    <client-only>
      <modal-response />
    </client-only>
  </div>
</template>

<script>
export default {
  middleware ({ store, redirect }) {
    const user = store.state?.reporter?.user || null
    if (user) {
      redirect('/dashboard')
    }
  },
  components: {
    AuthenticationOperation: () => import('~/components/desktop/reporter/authentication.vue'),
    ModalResponse: () => import('~/components/common/modal/modal-response.vue')
  }
};
</script>
