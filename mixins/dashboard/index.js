import { mapState, mapActions } from 'vuex'
import { DASHBOARD_API } from '@/api/dashboard'
import BigNumber from 'bignumber.js'
import dayjs from 'dayjs';
import { isEmpty } from 'lodash';
import { ERROR_TYPE } from '@/resources/message'
import { MODAL } from '@/resources/modal.js'
import { USER_ROLE } from '@/config/constant';
import REPORTER_API from '@/api/reporter';

export default {
  data () {
    return {
      overviewData: {
        numRegistedDay: 0,
        rate: 0,
        totalTransaction30DayBuy: 0,
        totalTransaction30DaySell: 0,
        totalTransactionBuy: 0,
        totalTransactionSell: 0,
        amountTransaction: 0,
        amountTransaction30Day: 0,
        numPostsBuy: 0,
        numPostsSell: 0,
        totalFee: 0,
        totalPenaltyFee: 0,
        totalFee30Day: 0,
        totalPenaltyFee30Day: 0,
        numMerchantActive: 0,
        numMerchantInactive: 0,
        numStaffActive: 0,
        numStaffInactive: 0,
        numUserActive: 0,
        totalOrderProcessing: 0,
        totalSellOrderProcessing: 0,
        totalBuyOrderProcessing: 0,
        numUserInactive: 0
      },
      nickName: '',
      walletAddress: '',
      dataChart: [],
      isLoadingOverview: false,
      isLoadingRefreshData: false,
      isLoadingChartReport: false,
      isLoadingTradingPeriodItems: false,
      tradingPeriodItems: []
    }
  },
  computed: {
    ...mapState('user', ['user']),
    ...mapState({
      reporterInfo: state => state.reporter.user
    }),
    userRole () {
      return this.user?.type
    },
    isShowExportButton () {
      return this.$device.isDesktop
    },
    rateMonth () {
      if (this.overviewData?.rate === 0 || this.overviewData?.rate === 100) {
        return this.overviewData?.rate || 0
      }
      return Number(this.overviewData?.rate || 0).toFixed(2)
    }
  },
  methods: {
    ...mapActions('modal-message', ['initModal']),
    randomId () {
      return 'tooltip-' + Math.random()
    },
    getUrlChartReport () {
      if (this.reporterInfo) {
        return REPORTER_API.STATISTIC_REPORTER_CHART
      }
      if (this.userRole === USER_ROLE.SUPER_ADMIN) {
        return DASHBOARD_API.GET_DATA_CHART_REPORT_BY_ADMIN
      }
      return DASHBOARD_API.GET_DATA_CHART_REPORT
    },
    async getDataChartReport (type = 'day') {
      try {
        this.isLoadingChartReport = true
        const userId = this.reporterInfo ? this.reporterInfo?.id : (this.$route.params?.id || this.user?.id)
        const params = {
          userId,
          type
        }
        const url = this.getUrlChartReport()
        const { data } = await this.$axios.$get(url, {
          params
        })
        if (data) {
          this.dataChart = [
            {
              type: 'line',
              color: '#007EC5',
              label: this.$t('overview.total_trans.title'),
              datasets: this.formatDataChart(data, 'amount_transaction')
            },
            {
              type: 'bar',
              color: '#2FB8B8',
              label: this.$t('postings_history.fee'),
              datasets: this.formatDataChart(data, 'total_fee')
            },
            {
              type: 'bar',
              color: '#FB7F39',
              label: this.$t('postings_history.penalty_fee'),
              datasets: this.formatDataChart(data, 'total_penalty_fee')
            }
          ]
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error)
      } finally {
        this.isLoadingChartReport = false
      }
    },
    formatDataChart (list, property) {
      return list?.map((item) => {
        return {
          key: item.time,
          value: item[property]
        }
      })
    },
    async getDataDashboard (isUser = false) {
      try {
        this.isLoadingOverview = true
        let url = ''
        const isAdmin = this.user?.type === USER_ROLE.SUPER_ADMIN
        const isReporter = this.reporterInfo
        const staffId = this.$route.params?.id
        if (isUser) {
          url = DASHBOARD_API.GET_BY_USER
        } else if (isAdmin) {
          url = staffId ? DASHBOARD_API.GET_MANAGER_DASHBOARD(staffId) : DASHBOARD_API.GET_BY_ADMIN
        } else if (isReporter) {
          url = REPORTER_API.STATISTIC_REPORTER_OVERVIEW
        } else {
          url = staffId ? DASHBOARD_API.GET_STAFF_DASHBOARD(staffId) : DASHBOARD_API.GET_BY_OPERATION
        }

        const { data } = await this.$axios.$get(url)
        if (data) {
          this.overviewData = {
            numRegistedDay: dayjs().diff(dayjs(data?.createdAt || data?.userPublicInfo?.createdAt), 'days') || 0,
            rate: Number(data?.recentCompleteRate || 0).toFixed(2),
            totalTransaction30Day: data?.totalRecentOrder || 0,
            totalTransaction30DayBuy: data?.totalRecentBuyOrder || 0,
            totalTransaction30DaySell: data?.totalRecentSellOrder || 0,
            totalTransactionBuy: data?.totalBuyOrder || 0,
            totalTransactionSell: data?.totalSellOrder || 0,
            amountTransaction: data?.totalAmount || 0,
            amountTransaction30Day: data?.totalRecentAmount || 0,
            numPostsBuy: data?.totalBuyPost || 0,
            numPostsSell: data?.totalSellPost || 0,
            totalFee: data?.totalFee || 0,
            totalAppealedOrder: data?.totalAppealedOrder || 0,
            totalPenaltyFee: data?.totalPenaltyFee || 0,
            totalFee30Day: data?.totalRecentFee || 0,
            totalOrderProcessing: data?.totalOrderProcessing || 0,
            totalBuyOrderProcessing: data?.totalBuyOrderProcessing || 0,
            totalSellOrderProcessing: data?.totalSellOrderProcessing || 0,
            totalPenaltyFee30Day: data?.totalRecentPenaltyFee || 0,
            numMerchantActive: (data?.totalActiveManager || 0) + (data?.totalInactiveManager || 0),
            numMerchantInactive: data?.totalInactiveManager || 0,
            numStaffActive: (data?.totalActiveOperator || 0) + (data?.totalInactiveOperator || 0),
            numStaffInactive: data?.totalInactiveOperator || 0,
            numUserActive: data?.totalActiveUser || 0,
            numUserInactive: data?.totalInactiveUser || 0,
            type: data?.userPublicInfo?.type
          }
          if (this.visibleNickName) {
            this.nickName = data?.userPublicInfo?.nickName
            this.walletAddress = data?.userPublicInfo?.walletAddress
          }
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error)
      } finally {
        this.isLoadingOverview = false
      }
    },
    async onChangeDateTradingPeriod (userId, day) {
      await this.getTradingByPeriod(userId, day)
    },
    async getTradingByPeriod (userId, day) {
      try {
        this.isLoadingTradingPeriodItems = true
        const dateFormatted = dayjs(day).startOf('date').format()
        const url = this.reporterInfo ? REPORTER_API.TRADING_BY_PERIOD : DASHBOARD_API.TRADING_BY_PERIOD
        const result = await this.$axios.$get(url, {
          params: {
            day: dateFormatted
          }
        })
        this.tradingPeriodItems = result?.data?.items || []
      } catch (error) {
        console.error(error)
        this.tradingPeriodItems = []
      } finally {
        this.isLoadingTradingPeriodItems = false
      }
    },
    findNumberDate (date) {
      const todaysDate = dayjs();
      const dateTrans = dayjs(date);
      return todaysDate.diff(dateTrans, 'days')
    },
    calculateSum (list, property) {
      const total = list.reduce((accumulator, obj) => {
        return this.plusTwoNumber(accumulator, obj[property]);
      }, 0);
      return total;
    },
    findTransactionIn30Day (data) {
      return data?.filter(item => this.findNumberDate(item.dateTrans) <= 30)
    },
    getUrlExportChartData () {
      if (this.reporterInfo) {
        return REPORTER_API.EXPORT_DATA_CHART
      }
      return this.user?.type === USER_ROLE.SUPER_ADMIN ? DASHBOARD_API.ADMIN_EXPORT_DATA_CHART : DASHBOARD_API.MERCHANT_EXPORT_DATA_CHART
    },
    async getDataExport (prefixName, type) {
      const userId = this.reporterInfo ? this.reporterInfo?.id : this.user?.id
      const params = {
        userId,
        type
      }
      let urlAPI = '';
      if (prefixName === 'ChartData') {
        urlAPI = this.getUrlExportChartData();
      } else {
        urlAPI = DASHBOARD_API.EXPORT_DATA_ORDER_HISTORY
      }
      try {
        const data = await this.$axios.$get(urlAPI, { params: prefixName === 'ChartData' ? params : null })
        return data
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error)
        return []
      }
    },
    async handleExportFile (prefixName = '', type = 'day', reportType) {
      const response = await this.getDataExport(prefixName, type)
      if (reportType === 'CHART') {
        this.formatStringToCSV(prefixName, response, type)
      } else {
        this.handleFileStreaming(prefixName, response)
      }
    },
    handleFileStreaming (prefixName = '', response) {
      const url = window.URL.createObjectURL(new Blob([response]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${prefixName}-${this.formatDateTime(new Date(), 'YYYYMMDD.HHMMss')}.csv`)
      document.body.appendChild(link)
      link.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(link)
    },
    formatStringToCSV (prefixName = '', response, type) {
      const mesg = {}
      if (isEmpty(response?.data?.file?.data)) {
        this.initModal({
          type: ERROR_TYPE.MANUAL,
          message: [{ key: 'REPORT_EMPTY' }],
          api: '',
          isShow: false
        })
        this.$bvModal.show(MODAL.NO_DATA)
        return
      }
      mesg.payload = Buffer.from(response?.data?.file?.data, 'utf8')
      mesg.payload = mesg.payload?.toString()
      if (type === 'day') {
        type = 'dates'
      } else {
        type = type + 's'
      }
      const nameFile = `${prefixName}_${type}_[${this.formatDateTime(new Date(), 'YYYYMMDD.HHMMss')}].csv`
      const link = window.document.createElement('a');
      link.setAttribute('href', 'data:text/csv;charset=utf-8,%EF%BB%BF' + encodeURI(mesg.payload));
      link.setAttribute('download', nameFile);
      link.click();
    },
    formatDateTime (date, format) {
      return dayjs(date).format(format);
    },
    formatValue (a, b) {
      const total = !isNaN(b) ? this.plusTwoNumber(a, b) : (a || 0);
      return total ? this.$options.filters.formatMoney(total) : 0
    },
    plusTwoNumber (number1, number2) {
      return new BigNumber(number1).plus(number2).toNumber()
    },
    handleClickGoBack () {
      this.$router.go(-1)
    },
    async refreshStatisticData () {
      try {
        this.isLoadingRefreshData = true
        let url = ''
        let isUser = false
        switch (this.user?.type) {
          case USER_ROLE.SUPER_ADMIN:
            url = DASHBOARD_API.REFRESH_STATISTIC_ADMIN
            break;
          case USER_ROLE.MERCHANT_MANAGER:
          case USER_ROLE.MERCHANT_OPERATOR:
            url = DASHBOARD_API.REFRESH_STATISTIC_OPERATION
            break;
          default:
            url = DASHBOARD_API.REFRESH_STATISTIC_USER
            isUser = true
            break;
        }
        await this.$axios.$get(url)
        await this.getDataDashboard(isUser)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error)
      } finally {
        this.isLoadingRefreshData = false
      }
    }
  }
}
