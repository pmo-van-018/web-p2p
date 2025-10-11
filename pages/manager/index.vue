<template>
  <component :is="component" />
</template>

<script>
export default {
  layout: 'management',
  middleware ({ redirect }) {
    return redirect('manager/dashboard')
  }
};
</script>
