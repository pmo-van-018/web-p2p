<template>
  <van-dropdown-menu
    ref="dropdownFilter"
    v-bind="$attrs"
    class="filter-menu"
    v-on="$listeners"
  >
    <slot />
  </van-dropdown-menu>
</template>
<script>
import VanDropdownMenu from 'vant/lib/dropdown-menu'
import 'vant/lib/dropdown-menu/style'

export default {
  components: {
    VanDropdownMenu
  },
  data () {
    return {
      activeDropdownItem: false
    }
  },
  watch: {
    activeDropdownItem: {
      handler () {
        const childrenBarEl = this.$refs.dropdownFilter.$children
        const listChildrenFilter = childrenBarEl.map((item, index) => {
          return {
            index,
            active: item.active
          }
        })

        const refBarEl = this.$refs?.dropdownFilter?.$refs?.bar?.children || []
        const arrayBarEl = [...refBarEl]
        arrayBarEl.forEach((item, index) => {
          if (listChildrenFilter.some(children => children.index === index && children.active)) {
            item.classList.add('active')
          } else {
            item.classList.remove('active')
          }
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/mobile/commons/libs/filter-menu/index.scss">
</style>
