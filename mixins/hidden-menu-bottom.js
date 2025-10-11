export default {
  created () {
    this.$store.commit('mutate', {
      property: 'isHideMenuBottom',
      with: true
    })
  },
  beforeDestroy () {
    this.$store.commit('mutate', {
      property: 'isHideMenuBottom',
      with: false
    })
  }
};
