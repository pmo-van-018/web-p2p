<template>
  <modal-common
    :id="MODAL.EXTRA_TIME_APPEAL"
    :title="title"
    @show-modal="onResetDataModal"
  >
    <div class="extra-appeal-time">
      <div class="extra-appeal-time__container">
        <div class="extra-appeal-time__icon">
          <img :src="require('~imageRoot/common/orders/add-time-appeal.svg')" alt="add time" width="200">
        </div>
        <div class="extra-appeal-time__content">
          <div class="extra-appeal-time__confirm">Bạn chắc chắn muốn gia hạn khiếu nại của giao dịch</div>
          <div class="extra-appeal-time__type"><span :class="orderTypeClass">{{ orderTypeText }}</span> <strong>#{{ orderId }}</strong> ?</div>
          <div class="extra-appeal-time__text">Gia hạn khiếu nại đến:</div>
        </div>

        <div class="extra-appeal-time__extra">
          <div class="extra-appeal-time__datetime">
            <dropdown-filter
              :list-filter="hours"
              :selected="selectedHour"
              title="00:00"
              @on-select="onSelectedHour"
            />
          </div>
          <div class="extra-appeal-time__datetime">
            <div class="date-picker-custom">
              <date-range-picker
                ref="picker"
                v-model="dateRange"
                single-date-picker="single"
                opens="left"
                auto-apply
                :date-format="dateFormat"
                :ranges="false"
              >
                <template v-slot:input="picker">
                  <div
                    :class="['date-picker-custom__date', {
                      'date-picker-custom__date--grey': !picker.startDate
                    }]"
                  >
                    {{ picker.startDate ? formatDate(picker.startDate) : 'DD/MM/YYYY' }}
                  </div>
                </template>
              </date-range-picker>
            </div>
          </div>
        </div>
        <div class="extra-appeal-time__actions">
          <base-button
            variants="contained"
            color="primary"
            :disabled="disabledConfirm"
            @click="onConfirmExtraTime"
          >
            {{ $t('action.confirm') }}
          </base-button>
          <base-button
            variants="outlined"
            color="info"
            @click="onCloseModal"
          >
            {{ $t('action.close') }}
          </base-button>
        </div>
      </div>
    </div>
  </modal-common>
</template>
<script>
import ModalCommon from '@/components/desktop/modal/modal-common.vue';
import { MODAL } from '@/resources/modal'
import dayjs from 'dayjs'
import { mapActions, mapState } from 'vuex'
import { DIFF_DATE_FORMAT, TRADE_TYPE } from '@/config/constant'
import utc from 'dayjs/plugin/utc'
import { RESPONSE_ICON } from '@/resources/message'
import DateRangePicker from 'vue2-daterange-picker'

dayjs.extend(utc)

export default {
  components: {
    ModalCommon,
    DateRangePicker,
    DropdownFilter: () => import('~/components/desktop/commons/dropdown-filter/index.vue'),
    BaseButton: () => import('~/components/common/base-button/index.vue')
  },
  data () {
    return {
      MODAL,
      hours: [],
      selectedHour: {},
      dateRange: {
        startDate: null,
        endDate: null
      }
    }
  },
  computed: {
    ...mapState('admin-appeal', ['extraModal']),
    title () {
      return this.extraModal.title
    },
    appealId () {
      return this.extraModal.appealId
    },
    orderId () {
      return this.extraModal.orderId
    },
    orderType () {
      return this.extraModal.orderType
    },
    orderTypeClass () {
      return this.orderType === TRADE_TYPE.BUY ? 'buy' : 'sell'
    },
    orderTypeText () {
      return this.orderType === TRADE_TYPE.BUY ? this.$t('common.buy') : this.$t('common.sell')
    },
    disabledConfirm () {
      return !(Object.keys(this.selectedHour).length !== 0 && !!this.dateRange.startDate)
    },
    hourMinute () {
      return Object.keys(this.selectedHour).length !== 0 ? this.selectedHour.value : ''
    }
  },
  mounted () {
    this.generateHourList()
  },
  methods: {
    ...mapActions('admin-appeal', ['onExtraTimeAppeal']),
    ...mapActions('modal-response', ['showResponseModal']),
    onResetDataModal () {
      this.selectedHour = {}
      this.dateRange = {
        startDate: null,
        endDate: null
      }
    },
    dateFormat (classes, date) {
      if (!classes.disabled) {
        classes.disabled = dayjs(date).local().toDate().getTime() < dayjs().local().startOf('day').toDate().getTime()
      }
      return classes
    },
    formatDate (date) {
      return dayjs(date).format('DD/MM/YYYY')
    },
    onSelectedHour (hour) {
      this.selectedHour = hour
    },
    async onConfirmExtraTime () {
      try {
        const date = dayjs(this.dateRange.endDate).format('YYYY-MM-DD')
        const evidentTimeoutAt = dayjs(`${date} ${this.hourMinute}`).utc().format()
        if (!dayjs().isBefore(dayjs(`${date} ${this.hourMinute}`).format(DIFF_DATE_FORMAT), 'second')) {
          this.showResponseModal({
            title: '',
            content: this.$t('modal.message.system_failed'),
            description: this.$t('modal.message.TIME_EXTRA_IS_IN_THE_PAST'),
            icon: RESPONSE_ICON.CHOOSE_TIME_FAILED,
            show: true
          })
          return
        }
        await this.onExtraTimeAppeal({
          appealId: this.appealId,
          evidentTimeoutAt: `${evidentTimeoutAt}`
        })
        this.onCloseModal()
      } catch (error) {
        let errorMessagePath = error?.response?.data?.errors?.[0]?.key || 'error_system';
        let forceReload = false
        let responseIcon = RESPONSE_ICON.CHOOSE_TIME_FAILED
        if (errorMessagePath === 'ORDER_STATUS_IS_INVALID') {
          errorMessagePath = 'ORDER_STATUS_IS_INVALID_FORCE_RELOAD'
          forceReload = true
          responseIcon = RESPONSE_ICON.SWITCH_STATUS_FAILED
        }
        this.showResponseModal({
          title: '',
          content: this.$t('modal.message.system_failed'),
          description: this.$t(`modal.message.${errorMessagePath}`),
          icon: responseIcon,
          show: true,
          forceReload
        })
      }
    },
    onCloseModal () {
      this.$bvModal.hide(MODAL.EXTRA_TIME_APPEAL)
    },
    generateHourList () {
      for (let i = 0; i < 24; i++) {
        const hour = (i < 10 ? '0' : '') + i + ':00'
        this.hours.push({
          name: hour,
          value: `${hour}:00`
        });
      }
    }
  }
}
</script>
<style lang="scss">
@import "vue2-daterange-picker/dist/vue2-daterange-picker.css";
</style>
<style lang="scss" scoped src="static/assets/scss/components/common/modal/appeal/confirm-winner/extract-appeal-time/index.scss">
</style>
