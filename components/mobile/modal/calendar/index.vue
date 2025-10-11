<template>
  <b-modal
    id="modalCalendar"
    ref="modalCalendar"
    modal-class="modal-custom modal-calendar"
    hide-header
    hide-footer
    @show="onShowModal"
    @hide="onHideModal"
  >
    <div class="modal-calendar__header">
      <div class="modal-calendar__header-item" @click="cancelDate()">Hủy</div>
      <div class="modal-calendar__header-item">Chọn ngày</div>
      <div class="modal-calendar__header-item" @click="submitDate">Xác nhận</div>
    </div>
    <SelectFilter v-model="typeSelected" :list="listType" hide-action class="calendar-custom" />
    <template v-if="typeSelected.value === 1">
      <div class="modal-calendar__note">Hệ thống hỗ trợ hiển thị lịch sử trong vòng 3 tháng</div>
      <div class="modal-calendar__time">
        <div class="modal-calendar__time-item" :class="{'modal-calendar__time-item--active': selectDate === 0}" @click="changeDate(0)">{{ startDateTmp }}</div>
        <div class="modal-calendar__time-space">đến</div>
        <div class="modal-calendar__time-item" :class="{'modal-calendar__time-item--active': selectDate === 1}" @click="changeDate(1)">{{ endDateTmp }}</div>
      </div>
    </template>
    <template v-else-if="typeSelected.value === 2">
      <div class="modal-calendar__time">
        <div class="modal-calendar__time-item modal-calendar__time-item--active">{{ monthDateTmp }}</div>
      </div>
    </template>
    <template v-else-if="typeSelected.value === 3">
      <div class="modal-calendar__time-item modal-calendar__time-item--active">{{ quarterTmp }}</div>
    </template>
    <div class="modal-calendar__container">
      <div class="modal-calendar__highlight" />
      <ItemScroll v-if="typeSelected.value === 1" key="day" v-model="day" :list="listDay" />
      <ItemScroll v-if="typeSelected.value !== 3" key="month" v-model="month" :list="listMonth" />
      <ItemScroll v-if="typeSelected.value === 3" key="quarter" v-model="quarter" :list="listQuarter" />
      <ItemScroll v-model="year" :list="listYear" />
    </div>
  </b-modal>
</template>
<script>
import ItemScroll from '@/components/mobile/modal/calendar/item-scroll.vue';
import SelectFilter from '@/components/mobile/user-orders/select-filter.vue';
import { MONTHS, QUARTERS } from '@/resources/calendar.js';
export default {
  components: { ItemScroll, SelectFilter },
  props: {
    value: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      listMonth: MONTHS,
      listQuarter: QUARTERS,
      day: null,
      month: null,
      year: null,
      quarter: null,
      listDay: [],
      listYear: [],
      startDate: '',
      endDate: '',
      typeSelected: {
        value: 1,
        title: 'Tuỳ chỉnh'
      },
      listType: [
        {
          value: 1,
          title: 'Tuỳ chỉnh'
        },
        {
          value: 2,
          title: 'Tháng'
        },
        {
          value: 3,
          title: 'Quý'
        }
      ],
      startDateTmp: '',
      endDateTmp: '',
      selectDate: 0,
      monthDateTmp: '',
      quarterTmp: ''
    }
  },
  computed: {
    swiper () {
      return this.$refs.calendar.$swiper;
    }
  },
  watch: {
    typeSelected: {
      handler (value) {
        if (value) {
          if (value.value === 1) {
            this.selectDate = 0
          }
          setTimeout(() => {
            this.setDateInit()
          }, 100)
        }
      },
      deep: true
    },
    day: {
      handler (value) {
        if (value) {
          if (this.selectDate === 0) {
            this.startDateTmp = this.getDateSelect()
          } else {
            this.endDateTmp = this.getDateSelect()
          }
        }
      },
      deep: true
    },
    month: {
      handler (value) {
        if (value) {
          if (this.typeSelected.value === 1) {
            this.initListDay();
            if (this.selectDate === 0) {
              this.startDateTmp = this.getDateSelect()
            } else {
              this.endDateTmp = this.getDateSelect()
            }
          } else if (this.typeSelected.value === 2) {
            this.monthDateTmp = this.getDateSelect('month')
          }
        }
      },
      deep: true
    },
    quarter: {
      handler (value) {
        if (value) {
          this.quarterTmp = this.getDateSelect('quarter')
        }
      },
      deep: true
    },
    year: {
      handler (value) {
        if (value) {
          if (this.typeSelected.value === 1) {
            if (this.month.value === '02') {
              this.initListDay()
            }
            if (this.selectDate === 0) {
              this.startDateTmp = this.getDateSelect()
            } else {
              this.endDateTmp = this.getDateSelect()
            }
          } else if (this.typeSelected.value === 2) {
            this.monthDateTmp = this.getDateSelect('month')
          } else {
            this.quarterTmp = this.getDateSelect('quarter')
          }
        }
      },
      deep: true
    }
  },
  mounted () {
    this.initListData(true);
  },
  methods: {
    showPopup () {
      this.$refs.modalCalendar.show();
    },
    closePopup () {
      this.$refs.modalCalendar.hide();
    },
    initListData () {
      const today = new Date();
      const day = String(today.getDate()).padStart(2, '0');
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const year = today.getFullYear();
      const listYear = []
      const listDay = []
      for (let i = 2010; i <= year; i++) {
        listYear.push({
          value: i.toString(),
          title: i.toString()
        })
      }
      const numDay = this.getDayInMonth(month, year);
      for (let i = 1; i <= numDay; i++) {
        listDay.push({
          value: i.toString().padStart(2, '0'),
          title: i.toString().padStart(2, '0')
        })
      }
      this.startDate = `${month}-${day}-${year}`
      this.endDate = `${month}-${day}-${year}`
      this.listDay = listDay
      this.listYear = listYear
    },
    initListDay () {
      const listDay = [];
      const numDay = this.getDayInMonth(this.month.value, this.year.value);
      for (let i = 1; i <= numDay; i++) {
        listDay.push({
          value: i.toString().padStart(2, '0'),
          title: i.toString().padStart(2, '0')
        })
      }
      this.listDay = listDay
    },
    setDateInit (openModal = false) {
      this.selectDate = 0
      if (this.value && this.value.type) {
        this.month = this.listMonth.find(item => item.value === this.value.startDate.substring(0, 2))
        this.day = this.listDay.find(item => item.value === this.value.startDate.substring(3, 5))
        this.year = this.listYear.find(item => item.value === this.value.startDate.substring(6, 10))
        this.quarter = this.listQuarter.find(item => item.months.includes(this.month.value))
        this.startDateTmp = this.getDateSelect()
        this.endDateTmp = this.value.endDate
        this.monthDateTmp = this.getDateSelect('month')
        this.quarterTmp = this.getDateSelect('quarter')
        if (openModal) {
          this.typeSelected = this.listType[this.value.type - 1]
        }
      } else {
        this.month = this.listMonth.find(item => item.value === this.startDate.substring(0, 2))
        this.day = this.listDay.find(item => item.value === this.startDate.substring(3, 5))
        this.year = this.listYear.find(item => item.value === this.startDate.substring(6, 10))
        this.quarter = this.listQuarter.find(item => item.months.includes(this.month.value))
        this.startDateTmp = this.getDateSelect()
        this.endDateTmp = this.getDateSelect()
        this.monthDateTmp = this.getDateSelect('month')
        this.quarterTmp = this.getDateSelect('quarter')
      }
    },
    getDateSelect (type = '') {
      if (type === '') {
        return `${this.month.value}-${this.day.value}-${this.year.value}`
      } else if (type === 'month') {
        return `${this.month.title}-${this.year.value}`
      } else {
        return `${this.quarter.title}-${this.year.value}`
      }
    },
    changeDate (typeDate) {
      this.selectDate = typeDate;
      const dateTmp = typeDate === 0 ? this.startDateTmp : this.endDateTmp
      this.month = this.listMonth.find(item => item.value === dateTmp.substring(0, 2))
      this.day = this.listDay.find(item => item.value === dateTmp.substring(3, 5))
      this.year = this.listYear.find(item => item.value === dateTmp.substring(6, 10))
    },
    onShowModal () {
      setTimeout(() => {
        this.setDateInit(true)
      }, 100)
    },
    onHideModal () {
      this.month = null
      this.day = null
      this.quarter = null
      this.year = null
    },
    getDayInMonth (month, year) {
      let numDay = 30;
      if (['01', '03', '05', '07', '08', '10', '12'].includes(month)) {
        numDay = 31;
      } else if (month === '02') {
        numDay = year % 4 === 0 ? 29 : 28;
      }
      return numDay
    },
    submitDate () {
      const date = {
        startDate: '',
        endDate: '',
        type: 1
      }
      if (this.typeSelected.value === 1) {
        date.startDate = `${this.startDateTmp.substring(3, 5)}-${this.startDateTmp.substring(0, 2)}-${this.startDateTmp.substring(6, 10)}`
        date.endDate = `${this.endDateTmp.substring(3, 5)}-${this.endDateTmp.substring(0, 2)}-${this.endDateTmp.substring(6, 10)}`
      } else if (this.typeSelected.value === 2) {
        date.startDate = `${this.month.value}-01-${this.year.value}`
        date.endDate = `${this.month.value}-${this.getDayInMonth(this.month.value, this.year.value)}-${this.year.value}`
        date.type = 2
      } else if (this.typeSelected.value === 3) {
        date.startDate = `${this.quarter.months[0]}-01-${this.year.value}`
        date.endDate = `${this.quarter.months[2]}-${this.getDayInMonth(this.quarter.months[2].toString(), this.year.value)}-${this.year.value}`
        date.type = 3
      }
      this.$emit('input', date)
      this.closePopup();
    },
    cancelDate () {
      this.closePopup();
    }
  }
}
</script>
<style scoped lang="scss" src="static/assets/scss/components/mobile/modal/calendar/index.scss"></style>
