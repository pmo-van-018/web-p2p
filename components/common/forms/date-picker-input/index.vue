<template>
  <div class="date-picker-custom">
    <date-range-picker
      ref="picker"
      v-model="date"
      single-date-picker="single"
      :opens="opens"
      auto-apply
      show-dropdowns
      :ranges="false"
      :locale-data="localeData"
    >
      <template v-slot:input="picker">
        <div
          :class="['date-picker-custom__date', {
            'date-picker-custom__date--grey': !picker.startDate
          }]"
        >
          <div class="picker-group">
            <input
              class="picker-group__input"
              type="text"
              name="picker"
              :value="picker.startDate ? formatDate(picker.startDate) : ''"
              :placeholder="placeholder"
              @input="handleTypingDateStr"
              @keyup.enter="handleChangeDateStr"
            >
            <span :class="icon" />
          </div>
        </div>
      </template>
    </date-range-picker>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { DATE_TIME_FORMAT } from '@/config/constant';
import DateRangePicker from 'vue2-daterange-picker'

dayjs.extend(utc);

export default {
  components: {
    DateRangePicker
  },
  props: {
    defaultDate: {
      type: Date,
      default: null
    },
    placeholder: {
      type: String,
      default: () => this.$t('placeholder.date_picker.enter_date')
    },
    opens: {
      type: String,
      default: 'center'
    },
    icon: {
      type: String,
      default: 'icon-calendar-days'
    }
  },
  data () {
    const date = dayjs(this.defaultDate, true).isValid() ? dayjs(this.defaultDate, true).toDate() : null;
    return {
      date: {
        startDate: date,
        endDate: null
      },
      localeData: {
        format: DATE_TIME_FORMAT.DATE_VIEW
      }
    }
  },
  watch: {
    date (newDate) {
      this.$emit('input', newDate?.startDate);
    }
  },
  methods: {
    formatDate (date) {
      return dayjs(date).format(DATE_TIME_FORMAT.DATE_VIEW);
    },
    handleTypingDateStr (e) {
      this.$refs.picker.togglePicker(false);
      if (e?.target?.value?.length === 10) {
        setTimeout(() => {
          this.handleChangeDateStr(e);
        }, 500);
      }
    },
    handleChangeDateStr (e) {
      const value = e?.target?.value;

      const [day, month, year] = value?.split('/');

      let newDate = dayjs([year, month, day]);

      if (!dayjs(newDate, true).isValid()) {
        newDate = dayjs();
      }
      if (dayjs(newDate, true).isValid()) {
        this.date = {
          startDate: newDate,
          endDate: newDate
        };
        this.$refs.picker.togglePicker(true);
      }
    }
  }
}
</script>
<style lang="scss">
@import 'vue2-daterange-picker/dist/vue2-daterange-picker.css';
</style>
<style lang="scss" scoped src="static/assets/scss/components/common/forms/date-picker-input/index.scss" />
