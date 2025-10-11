<template>
  <span class="svg-icon" role="img" :aria-label="`icon-${icon}`" @click="$emit('click')">
    <img :src="require(`~iconRoot/${icon}.svg?data`)" :alt="icon">
  </span>
</template>
<!--ALL icon in folder: static/assets/icons/** -->
<script>
export default {
  props: {
    icon: {
      type: String,
      require: true
    }
  }
};
</script>
<style lang="scss" scoped>
.svg-icon {
  color: inherit;
  font-style: normal;
  line-height: 0;
  text-align: center;
  text-transform: none;
  vertical-align: -0.125em;
  text-rendering: optimizelegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: flex;
  align-items: center;
  svg {
    display: inline-block;
  }
  img {
    width: inherit;
    height: inherit;
  }
}
</style>
