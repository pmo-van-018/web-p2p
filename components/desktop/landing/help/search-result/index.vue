<template>
  <section class="result-search">
    <div class="result-search__container">
      <div class="result-search__wrapper">
        <div class="row">
          <div class="col-12" :class="isVisibleSuggestion ? 'col-md-8' : null">
            <template v-if="items.length">
              <div class="result-search__text">
                Hiển thị <strong>{{ items.length }} kết quả</strong> (0.05 giây)
              </div>
              <div class="result-search__list">
                <div v-for="(item, index) in items" :key="index" class="result-search__item">
                  <card-result :item="item" />
                </div>
              </div>
            </template>
            <template v-else>
              <div class="no-data">
                <img class="no-data__img" src="/assets/images/components/desktop/landing/no-data-search.svg" alt="No search data" />
                <h4 class="no-data__text">Chưa có kết quả tìm kiếm</h4>
                <p class="no-data__content">Tìm kiếm của bạn "{{ textNoData }}" không khớp với bất kỳ kết quả nào của chúng tôi</p>
              </div>
            </template>
          </div>
          <div v-if="isVisibleSuggestion" class="result-search__suggest col-md-4">
            <h2 class="result-search__suggest-keyword">Gợi ý từ khóa</h2>
            <section class="suggest-keyword">
              <div class="suggest-keyword__inner">
                <div class="suggest-keyword__list">
                  <div
                    v-for="(keyword, index) in keywords"
                    :key="index"
                    class="suggest-keyword__item"
                    @click="onChoiceSuggestion(keyword)"
                  >
                    {{ keyword }}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  components: {
    CardResult: () => import('~/components/desktop/landing/help/search-result/card.vue')
  },
  props: {
    items: {
      type: Array,
      default: () => []
    },
    textNoData: {
      type: String,
      default: ''
    },
    isVisibleSuggestion: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      keywords: [
        'Tài khoản',
        'Khiếu nại',
        'Quảng cáo',
        'Thương gia',
        'Tiền mã hoá',
        'Giao dịch'
      ]
    }
  },
  methods: {
    onChoiceSuggestion (keyword) {
      this.$emit('on-search', keyword)
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/landing/help/search-result/index.scss">
</style>
