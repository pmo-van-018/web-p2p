<template>
  <b-modal
    id="suggestionModal"
    modal-class="modal-custom"
    hide-header
    hide-footer
  >
    <section class="suggestion">
      <div class="suggestion__container">
        <div class="suggestion__head">
          <div class="search-question">
            <input
              ref="searchFaq"
              v-model="searchValue"
              type="text"
              class="search-question__input"
              autocomplete="off"
              placeholder="Đặt câu hỏi.."
              @keyup.enter="$_helpSearchMixin_onEnterSearchFaq"
            >
            <span class="search-question__icon-search icon-search" />
          </div>
          <div class="suggestion__cancelled" @click="onCloseSuggestion">Hủy</div>
        </div>
        <div
          v-if="isVisibleSearchResult"
          class="suggestion__search-result"
          :class="searchResults.length ? 'suggestion__search-result--fill' : 'suggestion__search-result--empty'"
        >
          <search-result
            :items="searchResults"
            :text-no-data="textNoData"
            :is-visible-suggestion="false"
          />
        </div>
        <div v-else class="suggestion__body">
          <div class="suggestion__inner">
            <div class="suggestion__wrapper">
              <div class="suggestion__title">Đề xuất cho bạn</div>
            </div>
            <div class="suggestion__context">
              <div class="suggestion-content">
                <div class="suggestion-content__list">
                  <div
                    v-for="(keyword, index) in keywords"
                    :key="`suggestion_${index}`"
                    class="suggestion-content__item"
                    @click="onSelectKeywordSearch(keyword)"
                  >
                    {{ keyword }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="historiesList.length" class="suggestion__inner">
            <div class="suggestion__wrapper">
              <div class="suggestion__title">Tìm kiếm gần đây</div>
              <div class="suggestion__title suggestion__title--blue" @click="onRemoveAllHistories">Xóa</div>
            </div>
            <div class="histories-search">
              <div class="histories-search__list">
                <div v-for="(history, index) in historiesList" :key="`history_${index}`" class="histories-search__item">
                  <div class="histories-search__text" @click="onSelectKeywordSearch(history)">{{ history }}</div>
                  <img
                    class="histories-search__remove"
                    src="assets/images/components/desktop/landing/backspace-icon.svg"
                    alt="Remove"
                    @click="onDeleteHistory(history)"
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </b-modal>
</template>
<script>
import helpSearchMixin from '@/mixins/landing/help/search.js'
export default {
  components: {
    SearchResult: () => import('~/components/desktop/landing/help/search-result/index.vue')
  },
  mixins: [helpSearchMixin],
  mounted () {
    this.histories = localStorage.getItem('storedSearches') === null
      ? []
      : [...JSON.parse(localStorage.getItem('storedSearches'))];
  },
  methods: {
    onSelectKeywordSearch (keyword) {
      this.searchValue = keyword
      this.$_helpSearchMixin_onEnterSearchFaq()
    },
    onCloseSuggestion () {
      this.onSelectKeywordSearch('')
      this.$bvModal.hide('suggestionModal')
    },
    onDeleteHistory (history) {
      const histories = this.historiesList.filter(item => item !== history)
      this.histories = histories
      localStorage.setItem('storedSearches', JSON.stringify(histories))
    },
    onRemoveAllHistories () {
      this.histories = []
      localStorage.setItem('storedSearches', JSON.stringify([]))
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/landing/help/suggestion-modal/index.scss">
</style>
