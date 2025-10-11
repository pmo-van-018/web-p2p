<template>
  <b-modal
    :id="MODAL.SUMMARY_REPORT"
    modal-class="modal-custom"
    centered
    hide-header
    hide-footer
    @show="onOpenModalReport"
  >
    <div class="summary-report">
      <div class="summary-report__container">
        <div class="summary-report__wrapper">
          <div class="summary-report__head">
            <h1 class="summary-report__title">{{ $t('report.title') }}</h1>
            <div class="summary-report__close" @click="$bvModal.hide(MODAL.SUMMARY_REPORT)">
              <span class="icon-cancel" />
            </div>
          </div>
          <div class="summary-report__body">
            <div class="summary-report__context">
              <div class="summary-report__context-head">
                <div class="summary-report__context-box">1</div>
                <div class="summary-report__context-title">{{ $t('report.select_report_type') }}</div>
              </div>
              <div class="summary-report__context-body">
                <report-wrapper>
                  <div class="summary-report__content">
                    <report-action
                      v-for="(report, index) in typeReports"
                      :key="index"
                      :item="report"
                      :active="selectedTypeReport?.key === report.key"
                      @click="onSelectedTypeReport"
                    />
                  </div>
                </report-wrapper>
              </div>
            </div>

            <div class="summary-report__context">
              <div class="summary-report__context-head">
                <div class="summary-report__context-box">2</div>
                <div class="summary-report__context-title">{{ getCustomTitle }}</div>
              </div>
              <div class="summary-report__context-body">
                <report-wrapper v-if="visibleOrderType" :title="titleOrderTypeAndPostType">
                  <div class="summary-report__content">
                    <report-multiple-check :options="orderTypeReports" @change="selectedOrderType = $event" />
                  </div>
                </report-wrapper>
                <report-wrapper v-if="visibleStaffType" :title="titleStaffType">
                  <div class="summary-report__content">
                    <report-action
                      v-for="(type, index) in staffTypeReports"
                      :key="index"
                      class="flex-grow-1"
                      :item="type"
                      :active="selectedStaffType?.key === type.key"
                      @click="onSelectedStaffType(type)"
                    />
                  </div>
                </report-wrapper>
                <report-wrapper v-if="visibleAssetType" :title="$t('report.asset_type')">
                  <dropdown-assets :assets="formatterAssetNetwork" @change="selectedAssetNetwork = $event" />
                </report-wrapper>

                <report-wrapper v-if="isVisibleManagerListForRole" :title="$t('report.merchant')">
                  <report-list-merchant
                    :merchants="merchantManagers"
                    :is-reset="isResetSelectedMerchantManager"
                    @on-selected="merchantManagersSelected = $event; isResetSelectedMerchantManager = false"
                    @intersect="onInfiniteLoadingMerchantManager"
                    @on-search="onSearchMerchantManager"
                  />
                </report-wrapper>

                <report-wrapper v-if="isVisibleUserListForRole" :title="$t('report.user_title')">
                  <report-list-user
                    :users="users"
                    :visible="isVisible"
                    @on-selected="selectedUser = $event"
                    @on-search="onSearchUser"
                    @on-remove="onRemove"
                  />
                </report-wrapper>

                <report-wrapper v-if="visibleDatepicker" :title="$t('report.choice_date_export')">
                  <div class="summary-report__content">
                    <report-action
                      v-for="(time, index) in rangeDates"
                      :key="index"
                      class="flex-grow-1"
                      :item="time"
                      :active="selectRangeDate?.key === time.key"
                      @click="onSelectRangeDate(time)"
                    />
                    <report-select-quarter
                      class="flex-grow-1"
                      min-date="2020-01-01"
                      :max-date="new Date()"
                      :default-value="new Date()"
                      :active="selectRangeDate?.key === RANGE_DATE_TYPE.QUARTER"
                      @click="onSelectRangeDate({
                        title: $t('date_picker.quarter'),
                        key: RANGE_DATE_TYPE.QUARTER
                      })"
                      @on-done="handleSelectDateRange"
                    />
                  </div>
                </report-wrapper>

                <div v-if="visibleDatepicker" class="summary-report__datepicker">
                  <client-only>
                    <report-date-picker-custom
                      v-model="dateRange"
                      class="w-100"
                      :class="{ active: selectRangeDate?.key === RANGE_DATE_TYPE.CUSTOM }"
                      @input="handleSelectDateRange"
                      @open="onSelectRangeDate({
                        title: 'Custom',
                        key: RANGE_DATE_TYPE.CUSTOM
                      })"
                    />
                  </client-only>
                  <div class="summary-report__datepicker-note">{{ $t('report.datepicker_ranger_month') }}</div>
                </div>
                <report-wrapper :title="$t('report.file_format')">
                  <div class="summary-report__content">
                    <report-action
                      v-for="(type, index) in formatFileReports"
                      :key="index"
                      :item="type"
                      :active="selectedFileFormat?.key === type.key"
                      @click="onSelectedFileFormat(type)"
                    />
                  </div>
                </report-wrapper>
              </div>
            </div>
          </div>
          <div class="summary-report__footer">
            <base-button
              variants="contained"
              :disabled="isLoadingExportReport || disableExport"
              :loading="isLoadingExportReport"
              color="primary"
              full-width
              @click="onSubmitExportReport"
            >
              {{ $t('action.button_export') }}
            </base-button>
          </div>
        </div>
      </div>
    </div>
  </b-modal>
</template>
<script>
import { ASSET_COIN_IMAGES } from '@/resources/wallet'
import { ICON_COIN_DEFAULT, USER_ROLE } from '@/config/constant'
import { mapActions, mapState } from 'vuex'
import { ADMIN_MERCHANT_MANAGER, ADMIN_USER_WALLET_ADDRESS } from '@/api/merchant-manager'
import isEmpty from 'lodash/isEmpty'
import { getTotalPage, mergeByProp, trimMultipleSpaceStartEndString } from '@/helper'
import { REPORT_NAMING_FILE, REPORT_TYPE, STAFF_TYPE, FILE_FORMAT_TYPE } from '@/constants/report'
import { ORDER_TYPE } from '@/resources/order-type'
import { RANGE_DATE_TYPE } from '@/constants/datetime'
import dayjs from 'dayjs'
import weekday from 'dayjs/plugin/weekday'
import quarterOfYear from 'dayjs/plugin/quarterOfYear'
import isoWeek from 'dayjs/plugin/isoWeek'
import { DASHBOARD_API } from '@/api/dashboard'
import USER_API from '@/api/user'
import { CONFIRM_TYPE, ERROR_TYPE, RESPONSE_ICON } from '@/resources/message'
import { MODAL } from '@/resources/modal.js'
import REPORTER_API from '@/api/reporter';

dayjs.extend(weekday)
dayjs.extend(quarterOfYear)
dayjs.extend(isoWeek)

export default {
  components: {
    ReportWrapper: () => import('~/components/desktop/reports/report-wrapper.vue'),
    ReportAction: () => import('~/components/desktop/reports/report-action.vue'),
    ReportSelectQuarter: () => import('~/components/desktop/reports/report-select-quarter.vue'),
    ReportListMerchant: () => import('~/components/desktop/reports/report-merchants.vue'),
    ReportListUser: () => import('~/components/desktop/reports/report-user.vue'),
    ReportDatePickerCustom: () => import('~/components/desktop/reports/report-datepicker.vue'),
    BaseButton: () => import('~/components/common/base-button/index.vue'),
    ReportMultipleCheck: () => import('~/components/desktop/reports/report-multiple-check.vue'),
    DropdownAssets: () => import('~/components/common/dropdown-assets/index.vue')
  },
  data () {
    return {
      selectedTypeReport: null,
      selectedOrderType: null,
      selectedStaffType: null,
      selectedUser: null,
      selectedFileFormat: { title: this.$t('report.csv_format'), key: FILE_FORMAT_TYPE.CSV },
      orderTypeReports: [
        { title: this.$t('common.buy'), key: ORDER_TYPE.BUY },
        { title: this.$t('common.sell'), key: ORDER_TYPE.SELL }
      ],
      staffTypeReports: [
        { title: this.$t('report.operator'), key: STAFF_TYPE.OPERATOR },
        { title: this.$t('report.supporter'), key: STAFF_TYPE.SUPPORTER }
      ],
      assetNetworkAll: { title: this.$t('report.asset_all'), key: '' },
      selectedAssetNetwork: null,
      selectRangeDate: null,
      rangeDates: [
        { title: this.$t('date_picker.this_week'), key: RANGE_DATE_TYPE.THIS_WEEK },
        { title: this.$t('date_picker.this_month'), key: RANGE_DATE_TYPE.THIS_MONTH },
        { title: this.$t('date_picker.last_month'), key: RANGE_DATE_TYPE.LAST_MONTH }
      ],
      formatFileReports: [
        { title: this.$t('report.csv_format'), key: FILE_FORMAT_TYPE.CSV },
        { title: this.$t('report.excel_format'), key: FILE_FORMAT_TYPE.XLSX }
      ],
      RANGE_DATE_TYPE,
      dateRange: [],
      merchantManagers: [],
      merchantManagersSelected: [],
      users: [],
      isVisible: false,
      queryParams: {
        page: 1,
        limit: 10,
        totalPages: 0
      },
      isLoadingMerchantManager: false,
      isLoadingExportReport: false,
      isResetSelectedMerchantManager: false,
      MODAL,
      REPORT_TYPE,
      STAFF_TYPE,
      timeoutId: null,
      searchValue: null
    }
  },
  computed: {
    ...mapState('resources', ['assets', 'fiats']),
    ...mapState('user', ['user']),
    ...mapState({
      reporterInfo: state => state.reporter.user
    }),
    disableExport () {
      return this.selectedTypeReport?.key === REPORT_TYPE.USER_STATISTIC && !this.selectedUser?.id
    },
    isRoleAdmin () {
      return this.user?.type === USER_ROLE.SUPER_ADMIN
    },
    visibleManagerList () {
      return ![REPORT_TYPE.ASSET, REPORT_TYPE.USER_STATISTIC].includes(this.selectedTypeReport?.key)
    },
    isVisibleUserListForRole () {
      return (this.isRoleAdmin || this.reporterInfo) && this.visibleUserList
    },
    isVisibleManagerListForRole () {
      return (this.isRoleAdmin || this.reporterInfo) && this.visibleManagerList
    },
    visibleUserList () {
      return [REPORT_TYPE.USER_STATISTIC].includes(this.selectedTypeReport?.key)
    },
    visibleOrderType () {
      return [REPORT_TYPE.ORDER_HISTORIES, REPORT_TYPE.POST_HISTORIES, REPORT_TYPE.REVENUE, REPORT_TYPE.TRADE_TYPE_DIFFERENCE].includes(this.selectedTypeReport?.key)
    },
    visibleStaffType () {
      return [REPORT_TYPE.STAFF_STATISTIC].includes(this.selectedTypeReport?.key)
    },
    getCustomTitle () {
      if ([REPORT_TYPE.STAFF_STATISTIC, REPORT_TYPE.USER_STATISTIC].includes(this.selectedTypeReport?.key)) {
        return this.$t('report.custom')
      }
      return this.$t('report.custom_and_select_time')
    },
    visibleAssetType () {
      return [REPORT_TYPE.ORDER_HISTORIES, REPORT_TYPE.POST_HISTORIES, REPORT_TYPE.REVENUE].includes(this.selectedTypeReport?.key)
    },
    visibleDatepicker () {
      return [REPORT_TYPE.MANAGER_STATISTIC, REPORT_TYPE.TRADE_TYPE_DIFFERENCE, REPORT_TYPE.ASSET, REPORT_TYPE.ORDER_HISTORIES, REPORT_TYPE.POST_HISTORIES, REPORT_TYPE.REVENUE].includes(this.selectedTypeReport?.key)
    },
    titleOrderTypeAndPostType () {
      if ([REPORT_TYPE.ORDER_HISTORIES, REPORT_TYPE.REVENUE, REPORT_TYPE.TRADE_TYPE_DIFFERENCE].includes(this.selectedTypeReport?.key)) {
        return this.$t('report.order_type')
      }
      if (this.selectedTypeReport?.key === REPORT_TYPE.POST_HISTORIES) {
        return this.$t('report.ads_type')
      }
      return ''
    },
    titleStaffType () {
      if ([REPORT_TYPE.STAFF_STATISTIC].includes(this.selectedTypeReport?.key)) {
        return this.$t('report.staff_type')
      }
      return ''
    },
    formatterAssetNetwork () {
      return this.assets.map((asset) => {
        const assetName = `${asset.name}_${asset.network}`;
        return {
          key: (`${asset.symbol}-${asset.network}`).toLowerCase(),
          title: asset.name,
          id: asset.id,
          subTitle: asset.network,
          icon: ASSET_COIN_IMAGES[assetName.toUpperCase()] ?? ICON_COIN_DEFAULT
        }
      })
    },
    filteredTypeReportsRoleReporter () {
      return [
        {
          title: this.$t('report.histories_order'),
          key: REPORT_TYPE.ORDER_HISTORIES
        },
        {
          title: this.$t('report.histories_ads'),
          key: REPORT_TYPE.POST_HISTORIES
        },
        {
          title: this.$t('report.revenue_merchant'),
          key: REPORT_TYPE.REVENUE
        },
        {
          title: this.$t('report.statistic_asset'),
          key: REPORT_TYPE.ASSET
        },
        {
          title: this.$t('report.manager_statistic'),
          key: REPORT_TYPE.MANAGER_STATISTIC
        },
        {
          title: this.$t('report.user_statistic'),
          key: REPORT_TYPE.USER_STATISTIC
        }
      ]
    },
    filteredTypeReports () {
      const typeReports = [
        {
          title: this.$t('report.histories_order'),
          key: REPORT_TYPE.ORDER_HISTORIES,
          roles: []
        },
        {
          title: this.$t('report.histories_ads'),
          key: REPORT_TYPE.POST_HISTORIES,
          roles: [USER_ROLE.MERCHANT_MANAGER, USER_ROLE.MERCHANT_OPERATOR, USER_ROLE.SUPER_ADMIN]
        },
        {
          title: this.$t('report.revenue_merchant'),
          key: REPORT_TYPE.REVENUE,
          roles: [USER_ROLE.SUPER_ADMIN]
        },
        {
          title: this.$t('report.statistic_asset'),
          key: REPORT_TYPE.ASSET,
          roles: []
        },
        {
          title: this.$t('report.manager_statistic'),
          key: REPORT_TYPE.MANAGER_STATISTIC,
          roles: [USER_ROLE.SUPER_ADMIN]
        },
        {
          title: this.$t('report.trade_type_difference'),
          key: REPORT_TYPE.TRADE_TYPE_DIFFERENCE,
          roles: [USER_ROLE.MERCHANT_MANAGER, USER_ROLE.MERCHANT_OPERATOR, USER_ROLE.USER]
        },
        {
          title: this.$t('report.staff_statistic'),
          key: REPORT_TYPE.STAFF_STATISTIC,
          roles: [USER_ROLE.MERCHANT_MANAGER]
        },
        {
          title: this.$t('report.user_statistic'),
          key: REPORT_TYPE.USER_STATISTIC,
          roles: [USER_ROLE.SUPER_ADMIN]
        }
      ]
      const userType = this.user?.type || ''
      return typeReports.filter((report) => {
        if (report.roles.length === 0) {
          return true
        }
        return report.roles.includes(userType) && report.roles.length
      })
    },
    typeReports () {
      if (this.reporterInfo) {
        return this.filteredTypeReportsRoleReporter
      }
      return this.filteredTypeReports
    },
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
  async mounted () {
    if (this.isRoleAdmin || this.reporterInfo) {
      await this.getMerchantManagers(false)
    }
    await this.getResources()
  },
  methods: {
    ...mapActions('modal-message', ['initModal']),
    ...mapActions('resources', ['getResources']),
    ...mapActions('modal-response', ['showResponseModal']),
    onSetDefaultReport () {
      this.selectedTypeReport = { title: this.$t('report.histories_order'), key: REPORT_TYPE.ORDER_HISTORIES }
      this.selectedOrderType = { title: this.$t('common.all'), key: '' }
      this.selectedAssetNetwork = { title: this.$t('report.asset_all'), key: '' }
      this.selectRangeDate = { title: this.$t('date_picker.this_week'), key: RANGE_DATE_TYPE.THIS_WEEK }
      this.selectedStaffType = this.staffTypeReports.find(e => e.key === STAFF_TYPE.OPERATOR)
      this.merchantManagersSelected = []
      this.selectedFileFormat = { title: this.$t('report.csv_format'), key: FILE_FORMAT_TYPE.CSV }
    },
    onSelectedTypeReport (typeReport) {
      this.selectedTypeReport = typeReport
      if ([REPORT_TYPE.REVENUE, REPORT_TYPE.ASSET].includes(typeReport?.key)) {
        this.selectedOrderType = { title: this.$t('common.all'), key: '' }
        this.selectedAssetNetwork = { title: this.$t('report.asset_all'), key: '' }
      }
      if ([REPORT_TYPE.POST_HISTORIES, REPORT_TYPE.ASSET].includes(typeReport?.key)) {
        this.merchantManagersSelected = []
      }
    },
    onSelectedStaffType (staffType) {
      this.selectedStaffType = staffType
    },
    onSelectedFileFormat (format) {
      this.selectedFileFormat = format
    },
    onOpenModalReport () {
      this.isResetSelectedMerchantManager = false
      this.onSetDefaultReport()
    },
    onSelectRangeDate (date) {
      this.selectRangeDate = date
    },
    handleSelectDateRange (range) {
      this.dateRange = range;
    },
    async onSubmitExportReport () {
      if (this.disableExport) {
        return
      }
      try {
        this.isLoadingExportReport = true
        const queryParams = {
          startDate: dayjs(this.dateRange[0]).startOf('date').format(),
          endDate: dayjs(this.dateRange[1]).endOf('date').format(),
          reportType: this.selectedTypeReport.key,
          ...((this.merchantManagersSelected?.length &&
              this.selectedTypeReport.key !== REPORT_TYPE.ASSET) && { managerIds: this.merchantManagersSelected.map(e => e.id) }),
          ...(this.selectedOrderType?.length === 1 && { tradeType: this.selectedOrderType[0]?.key }),
          ...(this.selectedStaffType?.key && { staffType: this.selectedStaffType?.key }),
          ...(this.selectedAssetNetwork?.length && { assetIds: this.selectedAssetNetwork.map(item => item.id) }),
          ...(this.selectedTypeReport.key === REPORT_TYPE.USER_STATISTIC && { userId: this.selectedUser?.id }),
          ...(this.selectedFileFormat?.key && { fileFormat: this.selectedFileFormat?.key })
        }
        if (queryParams.reportType !== REPORT_TYPE.POST_HISTORIES) {
          const roles = [USER_ROLE.MERCHANT_MANAGER, USER_ROLE.MERCHANT_OPERATOR]
          if (roles.includes(this.user?.type)) {
            if (queryParams.tradeType === ORDER_TYPE.BUY) {
              queryParams.tradeType = ORDER_TYPE.SELL
            } else if (queryParams.tradeType === ORDER_TYPE.SELL) {
              queryParams.tradeType = ORDER_TYPE.BUY
            }
          }
        }
        let urlApi = ''
        if (this.user?.type === USER_ROLE.USER) {
          urlApi = USER_API.EXPORT_REPORT
        }
        if ([USER_ROLE.MERCHANT_OPERATOR, USER_ROLE.MERCHANT_MANAGER].includes(this.user?.type)) {
          urlApi = DASHBOARD_API.MERCHANT_EXPORT_REPORT
        }
        if (this.user?.type === USER_ROLE.SUPER_ADMIN) {
          urlApi = DASHBOARD_API.ADMIN_EXPORT_REPORT
        }
        if (this.reporterInfo) {
          urlApi = REPORTER_API.EXPORT_REPORT
        }
        let options = {}
        const dataBufferReports = [REPORT_TYPE.USER_STATISTIC]
        const isBufferReport = dataBufferReports.includes(this.selectedTypeReport.key) && this.selectedFileFormat?.key === FILE_FORMAT_TYPE.CSV
        if (!isBufferReport) {
          options = {
            responseType: 'blob'
          }
        }
        const response = await this.$axios.$post(urlApi, queryParams, options)
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
        const fileNameNotRangeTime = [REPORT_TYPE.STAFF_STATISTIC, REPORT_TYPE.USER_STATISTIC]
        let fileName = `${REPORT_NAMING_FILE[this.selectedTypeReport.key]}_${this.rangeTimeTypeReport}_[${dayjs().format('DDMMYYYY.HHmmss')}]`
        if (fileNameNotRangeTime.includes(this.selectedTypeReport.key)) {
          fileName = `${REPORT_NAMING_FILE[this.selectedTypeReport.key]}_[${dayjs().format('DDMMYYYY.HHmmss')}]`
        }
        if ((isBufferReport && isEmpty(response?.data)) || (!isBufferReport && !response?.size)) {
          this.initModal({
            type: ERROR_TYPE.MANUAL,
            message: [{ key: 'REPORT_EMPTY' }],
            api: '',
            isShow: false
          })
          this.$bvModal.show(MODAL.NO_DATA)
          return
        }
        if (isBufferReport) {
          const buffer = response?.data?.file?.data
          this.handleFileBuffer(fileName, buffer, this.selectedFileFormat?.key)
        } else {
          this.handleFileStreaming(fileName, response, this.selectedFileFormat?.key)
        }
        this.$bvModal.hide(MODAL.SUMMARY_REPORT)
      } catch (err) {
        const errorStatus = err.response?.status || null
        if (errorStatus === 401 && this.reporterInfo) {
          this.showResponseModal({
            show: true,
            title: '',
            content: this.$t('modal.message.session_expire'),
            description: this.$t('modal.message.unauthenticated_password'),
            icon: RESPONSE_ICON.CONNECT_EXPIRED_WALLET,
            confirmAction: this.$t('action.confirm'),
            confirmActionType: CONFIRM_TYPE.LOGOUT_USERNAME_PASSWORD,
            visibleClose: false,
            preventClose: true
          })
        }
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
    handleFileBuffer (fileName, buffer, fileFormat) {
      const payload = Buffer.from(buffer, 'utf8')?.toString()
      const extension = fileFormat === FILE_FORMAT_TYPE.XLSX ? 'xlsx' : 'csv'
      const nameFile = `${fileName}.${extension}`
      const link = window.document.createElement('a');
      link.setAttribute('href', 'data:text/csv;charset=utf-8,%EF%BB%BF' + encodeURI(payload));
      link.setAttribute('download', nameFile);
      link.click();
    },
    async getMerchantManagers (isMergeOldData = false, params = null) {
      try {
        if (!params) {
          params = {
            limit: 10
          }
        }
        this.isLoadingMerchantManager = true
        let url = null
        if (this.reporterInfo) {
          url = REPORTER_API.LIST_MANAGER
        } else {
          url = ADMIN_MERCHANT_MANAGER
        }
        const res = await this.$axios.$get(url, { params }
        );
        if (!isEmpty(res?.data)) {
          if (isMergeOldData) {
            const mergeData = mergeByProp(this.merchantManagers, res.data?.items, 'id')
            this.merchantManagers = mergeData
          } else {
            this.merchantManagers = res.data?.items || []
          }
          this.queryParams.totalPages = getTotalPage(res.data.total, this.queryParams.limit);
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e)
      } finally {
        this.isLoadingMerchantManager = false
      }
    },
    async searchUserByWalletAddress (walletAddress) {
      try {
        const params = {
          walletAddress
        }
        let url = null
        if (this.reporterInfo) {
          url = REPORTER_API.SEARCH_USER_BY_ADDRESS
        } else {
          url = ADMIN_USER_WALLET_ADDRESS
        }
        const { data } = await this.$axios.$get(url, { params })
        if (isEmpty(data)) {
          this.users = []
        } else {
          this.users = [data];
        }
        this.isVisible = true;
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e)
      }
    },
    onSearchMerchantManager (value) {
      const trimValue = trimMultipleSpaceStartEndString(value)
      if (this.searchValue === trimValue) {
        return
      };
      this.searchValue = trimValue
      clearTimeout(this.timeoutId)
      const params = {
        search: this.searchValue
      }
      this.timeoutId = setTimeout(() => {
        this.getMerchantManagers(false, params)
      }, 1000)
    },
    onSearchUser (value) {
      const trimValue = trimMultipleSpaceStartEndString(value)
      clearTimeout(this.timeoutId)
      this.timeoutId = setTimeout(() => {
        this.searchUserByWalletAddress(trimValue)
      }, 1000)
    },
    onRemove () {
      this.users = [];
      this.isVisible = false;
    },
    async onInfiniteLoadingMerchantManager () {
      if (!this.isLoadingMerchantManager && this.queryParams.page < this.queryParams.totalPages) {
        this.queryParams.page = this.queryParams.page + 1
        await this.getMerchantManagers(true)
      }
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/modal/modal-summary-report.scss">
</style>
