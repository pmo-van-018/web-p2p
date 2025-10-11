import { USER_ROLE, USER_ROLE_CODE } from '@/config/constant'
import { mapActions, mapState } from 'vuex'
import isEmpty from 'lodash/isEmpty'
import { mergeByProp, trimMultipleSpaceStartEndString } from '@/helper'
import { REPORT_NAMING_FILE, FILE_FORMAT_TYPE } from '@/constants/report'
import { RANGE_DATE_TYPE } from '@/constants/datetime'
import dayjs from 'dayjs'
import weekday from 'dayjs/plugin/weekday'
import quarterOfYear from 'dayjs/plugin/quarterOfYear'
import isoWeek from 'dayjs/plugin/isoWeek'
import { ERROR_TYPE } from '@/resources/message'
import { MODAL } from '@/resources/modal.js'
import { LIST_STAFFS } from '@/api/staff';
import { SHIFT_MANAGEMENT } from '@/api/shift-management';

dayjs.extend(weekday)
dayjs.extend(quarterOfYear)
dayjs.extend(isoWeek)

export default {
  components: {
    ReportWrapper: () => import('~/components/desktop/reports/report-wrapper.vue'),
    ReportAction: () => import('~/components/desktop/reports/report-action.vue'),
    ReportSelectQuarter: () => import('~/components/desktop/reports/report-select-quarter.vue'),
    ReportListMerchant: () => import('~/components/desktop/reports/report-merchants.vue'),
    ReportDatePickerCustom: () => import('~/components/desktop/reports/report-datepicker.vue'),
    BaseButton: () => import('~/components/common/base-button/index.vue')
  },
  data () {
    return {
      selectRangeDate: null,
      rangeDates: [
        { title: this.$t('date_picker.this_week'), key: RANGE_DATE_TYPE.THIS_WEEK },
        { title: this.$t('date_picker.this_month'), key: RANGE_DATE_TYPE.THIS_MONTH },
        { title: this.$t('date_picker.last_month'), key: RANGE_DATE_TYPE.LAST_MONTH }
      ],
      RANGE_DATE_TYPE,
      minDate: '2020-01-01',
      dateRange: [],
      merchantOperators: [],
      role: USER_ROLE.MERCHANT_OPERATOR,
      merchantOperatorSelected: [],
      queryParams: {
        page: 1,
        limit: 10,
        totalPages: 0
      },
      isLoadingMerchantOperator: false,
      isLoadingExportReport: false,
      isResetSelectedMerchantOperator: false,
      MODAL,
      timeoutId: null,
      searchValue: null,
      selectedFileFormat: { title: this.$t('report.csv_format'), key: FILE_FORMAT_TYPE.CSV },
      formatFileReports: [
        { title: this.$t('report.csv_format'), key: FILE_FORMAT_TYPE.CSV },
        { title: this.$t('report.excel_format'), key: FILE_FORMAT_TYPE.XLSX }
      ]
    }
  },
  computed: {
    ...mapState('resources', ['assets', 'fiats']),
    ...mapState('user', ['user']),
    startDate () {
      return dayjs(this.dateRange[0]).format('DD.MM.YYYY')
    },
    endDate () {
      return dayjs(this.dateRange[1]).format('DD.MM.YYYY')
    },
    rangeTimeTypeReport () {
      if (!dayjs(this.dateRange[0]).diff(dayjs(this.dateRange[1]))) {
        return `D${dayjs(this.dateRange[0]).format('DDMMYYYY')}`
      }
      const startDate = dayjs(this.dateRange[0]).format('DDMMYYYY')
      const endDate = dayjs(this.dateRange[1]).format('DDMMYYYY')
      const monthYearStartDate = dayjs(this.dateRange[0]).format('MMYYYY')
      const monthYearEndDate = dayjs(this.dateRange[1]).format('MMYYYY')
      switch (this.selectRangeDate?.key) {
        case RANGE_DATE_TYPE.THIS_WEEK: {
          return `W${startDate}_${endDate}`
        }
        case RANGE_DATE_TYPE.THIS_MONTH: {
          return `M${monthYearStartDate}`
        }
        case RANGE_DATE_TYPE.LAST_MONTH: {
          return `D${startDate}_${endDate}`
        }
        case RANGE_DATE_TYPE.QUARTER: {
          return `Q${monthYearStartDate}_${monthYearEndDate}`
        }
        default:
          return `D${startDate}_${endDate}`
      }
    }
  },
  watch: {
    selectRangeDate: {
      handler (value) {
        if (value?.key === RANGE_DATE_TYPE.THIS_WEEK) {
          this.dateRange = [
            dayjs().isoWeekday(1).toDate(),
            dayjs().toDate()
          ]
        } else if (value?.key === RANGE_DATE_TYPE.THIS_MONTH) {
          this.dateRange = [
            dayjs().startOf('month').toDate(),
            dayjs().toDate()
          ]
        } else if (value?.key === RANGE_DATE_TYPE.LAST_MONTH) {
          this.dateRange = [
            dayjs().subtract(30, 'day').toDate(),
            dayjs().toDate()
          ]
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions('modal-message', ['initModal']),
    onSetDefaultReport () {
      this.isResetSelectedMerchantOperator = true
      this.selectRangeDate = { title: this.$t('date_picker.this_week'), key: RANGE_DATE_TYPE.THIS_WEEK }
      this.merchantOperatorSelected = []
      this.searchValue = null
      this.selectedFileFormat = { title: this.$t('report.csv_format'), key: FILE_FORMAT_TYPE.CSV }
    },
    async onOpenModalReport () {
      this.isResetSelectedMerchantOperator = false
      this.onSetDefaultReport()
      await this.getMerchantOperators(false)
    },
    onSelectRangeDate (date) {
      this.selectRangeDate = date
    },
    handleSelectDateRange (range) {
      this.dateRange = range;
    },
    onSelectedFileFormat (format) {
      this.selectedFileFormat = format
    },
    async onSubmitExportReport () {
      try {
        this.isLoadingExportReport = true
        const queryParams = {
          startDate: dayjs(this.dateRange[0]).startOf('date').format(),
          endDate: dayjs(this.dateRange[1]).endOf('date').format(),
          ...(this.merchantOperatorSelected?.length && { operatorIds: this.merchantOperatorSelected.map(e => e.id) }),
          ...(this.selectedFileFormat?.key && { fileFormat: this.selectedFileFormat?.key })
        }
        let options = {}
        if (this.selectedFileFormat.key === FILE_FORMAT_TYPE.XLSX) {
          options = {
            responseType: 'blob'
          }
        }
        const response = await this.$axios.$post(SHIFT_MANAGEMENT.MANAGER_EXPORT_REPORT, queryParams, options)
        if (!response) {
          this.initModal({
            type: ERROR_TYPE.MANUAL,
            message: [{ key: 'REPORT_EMPTY' }],
            api: '',
            isShow: false
          })
          this.$bvModal.show(MODAL.NO_DATA)
          return
        }
        const fileName = `${REPORT_NAMING_FILE.SHIFT_LOGS}_${this.rangeTimeTypeReport}_[${dayjs().format('DDMMYYYY.HHmmss')}]`
        this.handleFileStreaming(fileName, response, this.selectedFileFormat?.key)
        this.$bvModal.hide(MODAL.SHIFT_SUMMARY_REPORT)
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e)
      } finally {
        this.isLoadingExportReport = false
      }
    },
    handleFileStreaming (fileName, response, fileFormat) {
      const url = window.URL.createObjectURL(new Blob([response]))
      const link = document.createElement('a')
      link.href = url
      const extension = fileFormat === FILE_FORMAT_TYPE.XLSX ? 'xlsx' : 'csv'
      link.setAttribute('download', `${fileName}.${extension}`)
      document.body.appendChild(link)
      link.click()

      // Clean up the URL object
      window.URL.revokeObjectURL(url)

      // Remove the link from the body
      document.body.removeChild(link)
    },
    async getMerchantOperators (isMergeOldData = false, params = null) {
      try {
        if (!params) {
          params = {
            type: USER_ROLE_CODE.MERCHANT_OPERATOR
          }
        }
        this.isLoadingMerchantOperator = true
        const res = await this.$axios.$get(LIST_STAFFS, { params }
        );
        if (!isEmpty(res?.data)) {
          if (isMergeOldData) {
            const mergeData = mergeByProp(this.merchantOperators, res.data?.items, 'id')
            this.merchantOperators = mergeData
          } else {
            this.merchantOperators = res.data?.items || []
          }
          this.queryParams.totalPages = res.data?.totalPages;
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e)
      } finally {
        this.isLoadingMerchantOperator = false
      }
    },
    onSearchMerchantOperator (value) {
      const trimValue = trimMultipleSpaceStartEndString(value)
      if (this.searchValue === trimValue) {
        return
      };
      this.searchValue = trimValue
      clearTimeout(this.timeoutId)
      const params = {
        search: this.searchValue,
        type: USER_ROLE_CODE.MERCHANT_OPERATOR
      }
      this.timeoutId = setTimeout(() => {
        this.getMerchantOperators(false, params)
      }, 1000)
    },
    async onInfiniteLoadingMerchantOperator () {
      if (!this.isLoadingMerchantOperator && this.queryParams.page < this.queryParams.totalPages) {
        this.queryParams.page = this.queryParams.page + 1
        await this.getMerchantOperators(true)
      }
    }
  }
}
