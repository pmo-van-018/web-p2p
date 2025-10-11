<template>
  <div class="pagination-custom">
    <b-pagination
      :value="currentPage"
      :total-rows="total"
      :per-page="perPage"
      @change="onChangePagination"
    >
      <template #first-text><span class="pagination-custom__icon icon-arrow-prev"></span></template>
      <template #prev-text><span class="pagination-custom__icon icon-arrow-left1" /></template>
      <template #next-text><span class="pagination-custom__icon icon-arrow-right1" /></template>
      <template #last-text><span class="pagination-custom__icon icon-arrow-next"></span></template>
    </b-pagination>
  </div>
</template>

<script>
import { scrollTo } from '@/helper/scroll-to'

export default {
  components: {},
  props: {
    model: {
      type: String,
      default: ''
    },
    currentPage: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      default: 0
    },
    perPage: {
      type: Number,
      default: 10
    },
    reset: {
      type: Boolean,
      default: false
    },
    paramInUrl: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      pages: []
    }
  },
  computed: {
    totalPage () {
      return Math.ceil(this.total / this.perPage)
    }
  },
  watch: {
    reset () {
      if (this.reset === true) {
        this.currentPage = 1
      }
    }
  },
  methods: {
    onChangePagination (page) {
      scrollTo(0, 800, () => {})
      this.$emit('handle-page', page)
      if (this.paramInUrl) {
        this.$router.push({ query: { page } })
      }
    }
  }
}
</script>

<style lang="scss" scoped src="static/assets/scss/components/common/pagination.scss" />
