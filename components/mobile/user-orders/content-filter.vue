<template>
  <div class="content-filter">
    <div class="content-filter__container">
      <input
        v-model="content"
        class="content-filter__input"
        :class="{'content-filter__input--highlight': amount && content}"
        :placeholder="placeholder"
        @keypress="restrictChars($event)"
      >
      <template v-if="amount">
        <div class="content-filter__unit">VND</div>
        <div class="content-filter__amount-suggest">
          <div
            v-for="(item, index) in listAmountSuggest"
            :key="index"
            class="content-filter__amount-item"
            :class="{'content-filter__amount-item--active': amountActive && item.value === amountActive.value}"
            @click="selectAmount(item)"
          >
            {{ item.title }}
          </div>
        </div>
      </template>
    </div>
    <div class="content-filter__action">
      <button class="button content-filter__action-btn outline" @click="reset">
        Đặt lại
      </button>
      <button class="button content-filter__action-btn primary" @click="$emit('input', content)">
        Xác nhận
      </button>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    amount: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      content: '',
      listAmountSuggest: [
        {
          value: 1000000,
          title: '1M'
        },
        {
          value: 5000000,
          title: '5M'
        },
        {
          value: 10000000,
          title: '10M'
        },
        {
          value: 100000000,
          title: '100M'
        },
        {
          value: 1000000000,
          title: '1B'
        }
      ],
      amountActive: null
    };
  },
  computed: {
    placeholder () {
      return this.amount ? this.$t('order_filter.placeholder_amount') : this.$t('order_filter.placeholder_transcode')
    }
  },
  watch: {
    value: {
      handler (value) {
        if (value) {
          this.content = value;
        }
      }
    },
    content: {
      handler (value) {
        if (value && this.amount) {
          this.content = this.$options.filters.formatMoney(value);
        }
      }
    }
  },
  mounted () {
    this.content = this.value;
  },
  methods: {
    selectAmount (item) {
      this.amountActive = item
      this.content = this.$options.filters.formatMoney(item.value);
    },
    reset () {
      this.amountActive = null
      this.content = ''
    },
    restrictChars ($event) {
      if (this.amount) {
        if ($event.charCode === 0 || /\d/.test(String.fromCharCode($event.charCode))) {
          this.amountActive = null
          return true
        } else {
          $event.preventDefault();
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/mobile/user-orders/content-filter.scss" />
