<template>
  <div class="breadcrumb-wrapper">
    <div
      v-for="(item, index) in items"
      :key="index"
      class="item"
      :class="{ active: item.isActived }"
      @click="$router.push(item.url)"
    >
      {{ item.title }} <span v-if="index+1<items.length" class="icon-chevron-right" />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    items: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {};
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/common/breadcrumd.scss" />
