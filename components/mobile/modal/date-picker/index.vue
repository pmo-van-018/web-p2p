<template>
  <b-modal
    :id="id"
    :ref="id"
    modal-class="modal-custom modal-calendar"
    hide-header
    hide-footer
    @show="onShowModalDatePicker"
  >
    <calendar-custom
      :is-open-date-picker="isOpenDatePicker"
      :is-show-note="isShowNote"
      :date-range="dateRange"
      :label="label"
      :is-single-date-time-picker="isSingleDateTimePicker"
      @on-confirm="onConfirmDatePicker"
      @on-close="onCloseDatePicker"
    />
  </b-modal>
</template>
<script>
import { MODAL } from '@/resources/modal.js';

export default {
  components: {
    CalendarCustom: () => import('~/components/mobile/modal/date-picker/calendar-custom.vue')
  },
  props: {
    id: {
      type: String,
      default: () => MODAL.DATE_PICKER
    },
    dateRange: {
      type: Object,
      default: () => ({
        startDate: null,
        endDate: null
      })
    },
    label: {
      type: Object,
      default: () => ({
        selectDate: ''
      })
    },
    isShowNote: {
      type: Boolean,
      default: true
    },
    isSingleDateTimePicker: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isOpenDatePicker: false,
      MODAL
    }
  },
  methods: {
    onShowModalDatePicker () {
      this.isOpenDatePicker = true
    },
    onConfirmDatePicker (options) {
      this.isOpenDatePicker = false
      this.$emit('on-confirm', options)
      this.$bvModal.hide(this.id)
    },
    onCloseDatePicker () {
      this.$bvModal.hide(this.id)
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/mobile/modal/date-picker/index.scss">
</style>
