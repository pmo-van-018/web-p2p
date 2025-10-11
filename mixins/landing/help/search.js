import includes from 'lodash/includes'
import toLower from 'lodash/toLower'
import { toNonAccentVietnamese, trimMultipleSpaceStartEndString } from '@/helper'
import filter from 'lodash/filter'
import some from 'lodash/some'
import omit from 'lodash/omit'
import take from 'lodash/take'
import { accountFaq, adsFaq, appealFaq, definitionsFaq, transactionsFaq, otherQuestion } from 'p2p-common/topics.json'

export default {
  data () {
    return {
      keywords: [
        'Tài khoản',
        'Khiếu nại',
        'Quảng cáo',
        'Thương gia',
        'Tiền mã hoá',
        'Giao dịch'
      ],
      isVisibleSearchResult: false,
      textNoData: '',
      searchResults: [],
      histories: [],
      searchValue: ''
    }
  },
  computed: {
    historiesList () {
      return take(this.histories, 5)
    },
    listFaq () {
      return [...definitionsFaq, ...transactionsFaq, ...adsFaq, ...appealFaq, ...otherQuestion]
    },
    questions () {
      return [...accountFaq, ...this.listFaq].map(({ questions }) => questions)?.flat() || []
    }
  },
  methods: {
    $_helpSearchMixin_onEnterSearchFaq () {
      const search = trimMultipleSpaceStartEndString(this.searchValue)
      if (search !== '' && !this.histories.includes(search)) {
        const storedSearches = this.histories;
        storedSearches.unshift(search);
        localStorage.setItem('storedSearches', JSON.stringify(storedSearches.slice(0, 5)));
        this.visible = false;
        this.selectedIndex = -1;
        this.$refs?.searchFaq?.blur()
        this.$emit('on-search', search)
      }
      this.$_helpSearchMixin_onSearchFaq(search)
    },
    $_helpSearchMixin_onSearchFaq (search) {
      this.isVisibleSearchResult = search !== ''
      this.textNoData = search
      this.searchResults = this.searchBooksSpecificProperties(this.questions, search)
    },
    findNested (items, text) {
      const found = items.find(node => includes(toLower(node.text), text))
      return found || items.some((item) => {
        return item?.children?.length ? this.findNested(item.children, text) : false
      })
    },
    searchBooksSpecificProperties (collection, text, exclude) {
      text = toNonAccentVietnamese(toLower(text));
      return filter(collection, (object) => {
        const result = some(omit(object, exclude), (content) => {
          return includes(toNonAccentVietnamese(toLower(content)), text)
        });
        return result || this.findNested(object.answers, text)
      });
    }
  }
}
