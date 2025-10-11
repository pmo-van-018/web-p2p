<template>
  <component :is="component" />
</template>

<script>

import Base from '~/components/common/base.vue';

export default {
  components: {
    Desktop: () => import('~/components/common/503/index.vue')
  },
  extends: Base,
  mixins: []
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/common/page-503.scss" />
