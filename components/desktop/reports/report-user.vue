<template>
  <div class="report-user">
    <div v-click-outside="onFocusout" class="report-user__container">
      <div class="report-user__dropdown">
        <div class="input-search">
          <span class="input-search__icon icon-person-star" />
          <input
            ref="searchUser"
            v-model="searchValue"
            :disabled="selectedUser?.nickName"
            type="text"
            autocomplete="off"
            :placeholder="selectedUser?.nickName || $t('report.search_user')"
            @input="$emit('on-search', searchValue)"
            @focusin="onFocusInInput"
          >
          <span class="input-search__arrow icon-trash" @click="onFocusInInput" />
        </div>
        <div class="report-user__wrapper" :class="{ visible }">
          <div class="users">
            <div class="users__list">
              <template v-if="userList.length">
                <b-form-group
                  v-slot="{ ariaDescribedby }"
                  class="m-0"
                >
                  <b-form-checkbox
                    v-for="user in userList"
                    :key="user.id"
                    v-model="selectedUser"
                    :value="user"
                    :aria-describedby="ariaDescribedby"
                    :checked="user"
                    name="user"
                    class="users__checkbox"
                    @change="onFocusout"
                  >
                    <div
                      class="user__item active d-flex flex-column"
                    >
                      <span class="font-t14m grey-900">{{ user.nickName }}</span>
                      <span class="font-t12r grey-500">{{ user.walletAddress }}</span>
                    </div>
                  </b-form-checkbox>
                </b-form-group>
              </template>
              <no-data v-else />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  components: {
    NoData: () => import('~/components/common/no-data.vue')
  },
  props: {
    users: {
      type: Array,
      default: () => []
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      searchValue: '',
      selectedUser: {}
    }
  },
  computed: {
    userList () {
      return this.users;
    }
  },
  watch: {
    selectedUser (newValue, oldValue) {
      this.$emit('on-selected', newValue)
    }
  },
  methods: {
    onFocusInInput () {
      this.$nextTick(() => {
        this.selectedUser = {}
        this.searchValue = ''
        this.$emit('on-remove')
      })
    },
    onFocusout () {
      this.$nextTick(() => {
        this.searchValue = ''
        this.$emit('on-remove')
      })
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/reports/report-users.scss">
</style>
