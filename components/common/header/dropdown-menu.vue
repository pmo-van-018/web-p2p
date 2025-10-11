<template>
  <b-dropdown ref="dropdown" class="dropdown-nav" right>
    <template #button-content>{{ $t(menu.name) }}</template>
    <div class="dropdown-nav__wrapper">
      <div v-for="(item, index) in menu.list" :key="index" @click="onCloseDropdown">
        <nuxt-link :to="user.type===USER_ROLE.MERCHANT_OPERATOR ? item.url : item.urlEndUser" class="nav-item">
          <BaseIcon v-if="item.useImage" :link="`common/header/${item.icon}.svg`" />
          <span v-else :class="item.icon" /> {{ $t(item.title) }}
        </nuxt-link>
      </div>
    </div>
  </b-dropdown>
</template>
<script>
import auth from '@/mixins/auth'
import { mapState } from 'vuex';
import { USER_ROLE } from '@/config/constant.js';
import BaseIcon from '~/components/common/base-icon/index.vue'
export default {
  components: {
    BaseIcon
  },
  mixins: [auth],
  props: {
    menu: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      USER_ROLE
    }
  },
  computed: {
    ...mapState('user', ['user'])
  },
  methods: {
    onCloseDropdown () {
      this.$refs.dropdown.hide(true)
    }
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/common/header/dropdown-menu.scss" />
