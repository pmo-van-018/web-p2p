<template>
  <section class="help-center">
    <header-section
      :search="searchValue"
      @on-search="$_helpSearchMixin_onSearchFaq"
    />
    <div class="help-center__container container">
      <div v-if="isVisibleSearchResult" class="help-center__search-result">
        <search-result
          :items="searchResults"
          :text-no-data="textNoData"
          @on-search="onSearchWithSuggestion"
        />
      </div>

      <template v-else>
        <h2 class="help-center__title">{{ $t('help.title') }}</h2>
        <div class="help-center__wrapper mt-lg-4">
          <div class="row d-flex align-items-start mb-4">
            <div class="help-center__left col-md-3">
              <div class="serial-content">
                <div class="serial-content__inner">
                  <div class="serial-content__stt">1</div>
                  <div class="serial-content__wrapper">
                    <h2 class="serial-content__title">{{ $t('help.account.title') }}</h2>
                    <p class="serial-content__desc">{{ $t('help.account.description') }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-9 mt-lg-4">
              <collapse-card v-for="(account, index) in accountFaq" :key="index" :title="account.title">
                <question-collapse
                  v-for="(ques, idxQuestion) in account.questions"
                  :key="idxQuestion"
                  :title="ques.title"
                  @on-open-detail="onOpenDetailModal(ques)"
                >
                  <div class="help-center__content">
                    <help-content-detail :answers="ques.answers" />
                  </div>
                </question-collapse>
              </collapse-card>
            </div>
          </div>
        </div>

        <div class="help-center__wrapper">
          <div class="row">
            <div class="help-center__left col-md-3">
              <div class="serial-content">
                <div class="serial-content__inner">
                  <div class="serial-content__stt">2</div>
                  <div class="serial-content__wrapper">
                    <h2 class="serial-content__title">{{ $t('help.system.title') }}</h2>
                    <p class="serial-content__desc">{{ $t('help.system.description') }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-9">
              <collapse-card
                v-for="(faq, index) in listFaq"
                :key="index"
                :title="faq.title"
                :class="['serial-content__card', {'mb-md-3': index < listFaq.length - 1}]"
              >
                <question-collapse
                  v-for="(ques, idxQuestion) in faq.questions"
                  :key="idxQuestion"
                  :title="ques.title"
                  :class="{'mb-3': idxQuestion < faq.questions.length - 1}"
                  @on-open-detail="onOpenDetailModal(ques)"
                >
                  <div class="help-center__content">
                    <help-content-detail :answers="ques.answers" />
                  </div>
                </question-collapse>
              </collapse-card>
            </div>
          </div>
        </div>
      </template>
    </div>
    <help-detail-mobile-modal :question="question" />
  </section>
</template>
<script>
import helpSearchMixin from '@/mixins/landing/help/search.js'
import { accountFaq, definitionsFaq } from 'p2p-common/topics.json';

export default {
  components: {
    HeaderSection: () => import('~/components/desktop/landing/help/header/index.vue'),
    CollapseCard: () => import('~/components/desktop/landing/components/collapse-card/index.vue'),
    QuestionCollapse: () => import('~/components/desktop/landing/components/question-collapse/index.vue'),
    HelpDetailMobileModal: () => import('~/components/desktop/landing/help/detail-modal/index.vue'),
    HelpContentDetail: () => import('~/components/desktop/landing/help/content-detail/index.vue'),
    SearchResult: () => import('~/components/desktop/landing/help/search-result/index.vue')
  },
  mixins: [helpSearchMixin],
  data () {
    return {
      accountFaq,
      definitionsFaq,
      question: null
    }
  },
  methods: {
    onOpenDetailModal (question) {
      this.question = question
      this.$bvModal.show('detailHelpModal')
    },
    onSearchWithSuggestion (search) {
      if (this.searchValue !== search) {
        this.searchValue = search
        this.$_helpSearchMixin_onSearchFaq(search)
      }
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/landing/help.scss" />
