<template>
  <section class="help-header event">
    <div class="help-header__container">
      <div class="help-header__inner">
        <div class="help-header__text">
          <span>Câu hỏi thường gặp</span>
        </div>
        <h1 class="help-header__title">Bạn hỏi, chúng tôi trả lời</h1>
        <div class="help-header__search">
          <div class="input-search">
            <input
              ref="searchFaq"
              v-model="searchValue"
              type="text"
              autocomplete="off"
              placeholder="Chúng tôi có thể giúp được gì cho bạn..."
              @focusin="onFocusInInput"
              @focusout="onFocusout"
              @keydown.down="selectedIndex = selectedIndex < histories.length - 1 ? selectedIndex + 1 : selectedIndex;"
              @keydown.up="selectedIndex = selectedIndex > - 1 ? selectedIndex - 1 : selectedIndex;"
              @keydown.enter="onEnterClicked"
            >
            <span class="input-search__icon-search icon-search" />
            <button class="input-search__action" @click="onEnterSearchFaq">
              <span class="input-search__action-icon icon-search" />
            </button>

            <div class="input-search__suggestion" :class="{visible: visible}">
              <div class="list-suggestion">
                <div class="list-suggestion__container">
                  <div class="list-suggestion__content">
                    <div v-if="historiesList.length" class="list-suggestion__wrapper">
                      <div
                        v-for="(history, index) in historiesList"
                        :key="index"
                        :data-id="index"
                        :class="{ selected: selectedIndex === index }"
                        class="list-suggestion__item"
                        @click="onClickHandler(index)"
                      >
                        <div class="list-suggestion__icon">
                          <img src="/assets/images/components/desktop/landing/search-icon.svg" alt="icon search">
                        </div>
                        <p class="list-suggestion__text">{{ history }}</p>
                      </div>
                    </div>
                    <div v-show="searchValue" class="list-suggestion__item active" @click="onEnterSearchFaq">
                      <div class="list-suggestion__icon">
                        <img src="/assets/images/components/desktop/landing/search-icon-active.svg" alt="icon search active">
                      </div>
                      <p class="list-suggestion__text">
                        Tìm kiếm cho "{{ searchValue }}"..
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <suggestion-modal />
  </section>
</template>
<script>
import take from 'lodash/take'
import { trimMultipleSpaceStartEndString } from '~/helper'

export default {
  components: {
    SuggestionModal: () => import('~/components/desktop/landing/help/suggestion-modal/index.vue')
  },
  props: {
    search: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      searchValue: '',
      visible: false,
      selectedIndex: -1,
      histories: []
    }
  },
  computed: {
    historiesList () {
      return take(this.histories, 5)
    }
  },
  watch: {
    search: {
      handler (value) {
        this.searchValue = value
        this.onEnterSearchFaq()
      }
    }
  },
  mounted () {
    this.histories = localStorage.getItem('storedSearches') === null
      ? []
      : [...JSON.parse(localStorage.getItem('storedSearches'))];
  },
  methods: {
    onFocusInInput () {
      if (this.$device.isMobile || window.innerWidth < 1024) {
        this.$refs.searchFaq.blur()
        this.$bvModal.show('suggestionModal')
        return
      }
      this.visible = true
    },
    onFocusout () {
      setTimeout(() => {
        this.selectedIndex = -1;
        this.visible = false
      }, 300)
    },
    onClickHandler (selectedIndex) {
      this.searchValue = this.histories[selectedIndex]?.trim();
      this.onEnterSearchFaq()
    },
    onEnterClicked () {
      if (this.selectedIndex !== -1) {
        this.searchValue = this.histories[this.selectedIndex]?.trim();
      }
      this.onEnterSearchFaq()
    },
    onEnterSearchFaq () {
      const search = trimMultipleSpaceStartEndString(this.searchValue)
      if (search !== '') {
        const storedSearches = this.histories;
        storedSearches.unshift(search);
        localStorage.setItem('storedSearches', JSON.stringify(storedSearches.slice(0, 5)));
      }
      this.visible = false;
      this.selectedIndex = -1;
      this.$refs.searchFaq.blur()
      this.$emit('on-search', search)
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/landing/help/header/index.scss">
</style>
