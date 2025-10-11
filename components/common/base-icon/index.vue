<template>
  <div v-html="src" />
</template>
<script>
export default {
  props: {
    link: {
      type: String,
      default: ''
    }
  },

  computed: {
    src () {
      if (this.link) {
        try {
          const src = require(`~imageRoot/${this.link}?draw`)
          return src
        } catch (error) {
          console.error(error)
          return ''
        }
      }
      return ''
    }
  }
};
</script>
