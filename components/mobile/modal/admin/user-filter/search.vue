<template>
  <b-modal
    :id="id"
    :ref="id"
    modal-class="modal-custom"
    hide-header
    hide-footer
  >
    <div class="modal-search-user">
      <div class="modal-search-user__head">
        <div class="modal-search-user__title">{{ $t('placeholder.search') }}</div>
        <div class="modal-search-user__close" @click="close">
          <span class="icon-cancel" />
        </div>
      </div>
      <div v-if="!selectedOption" class="modal-search-user__body">
        <div
          v-for="field in fieldOptions"
          :key="field.value"
          class="modal-search-user__option"
          @click="selectedOption = field"
        >
          {{ field.text }}
        </div>
      </div>
      <div v-else class="modal-search-user__content">
        <div class="modal-search-user__selected-option">
          <b-form-radio-group v-model="selectedOption">
            <radio-button :value="selectedOption">
              {{ selectedOption.text }}
            </radio-button>
          </b-form-radio-group>
          <div class="cancel-btn" @click="selectedOption = null">{{ $t('role_management.modal.cancel') }}</div>
        </div>
        <div class="modal-search-user__search">
          <input v-model="searchValue" class="modal-search-user__search--input" :placeholder="searchPlaceholder">
          <div class="modal-search-user__search--icon" @click="onSearch">
            <span class="icon icon-search-outline" />
          </div>
        </div>
      </div>
    </div>
  </b-modal>
</template>
<script>
import { MODAL } from '@/resources/modal.js';

export default {
  components: {
    RadioButton: () => import('~/components/common/forms/radio-button/index.vue')
  },
  props: {
    id: {
      type: String,
      default: () => MODAL.ADMIN_SEARCH_USER
    }
  },
  data () {
    return {
      MODAL,
      selectedOption: null,
      searchValue: '',
      fieldOptions: [
        { value: 'WALLET_ADDRESS', text: this.$t('staff.wallet_address') },
        { value: 'NICK_NAME', text: this.$t('staff.key.nickname') }
      ]
    }
  },
  computed: {
    searchPlaceholder () {
      return this.selectedOption ? `${this.$t('placeholder.search')} ${this.selectedOption.text.toLowerCase()}` : ''
    }
  },
  methods: {
    close () {
      this.$bvModal.hide(MODAL.ADMIN_SEARCH_USER);
    },
    onSearch () {
      this.$emit('on-search', {
        value: this.searchValue,
        field: this.selectedOption.value
      })
      this.close()
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/mobile/modal/admin/user-filter/search.scss">
</style>
