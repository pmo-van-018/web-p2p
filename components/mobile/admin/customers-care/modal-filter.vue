<template>
  <b-modal
    :id="modalId"
    modal-class="modal-custom"
    centered
    hide-header
    hide-footer
    @hide="$emit('hide')"
  >
    <div class="modal-support-request">
      <div class="modal-support-request__container">
        <div class="modal-support-request__head">
          <span class="modal-support-request__back icon-arrow-left" @click="$bvModal.hide(modalId)" />
          <span class="font-t14m">{{ $t('order_filter.filter') }}</span>
        </div>
        <div class="modal-support-request__body">
          <div class="modal-support-request__wrapper">
            <div class="modal-support-request__item">
              <div class="form-control-request">
                <div class="form-control-request__title">{{ $t('placeholder.search') }}</div>
                <div class="form-control-request__content">
                  <b-form-radio-group v-model="searchField" name="searchCustom" class="search-multiple-group">
                    <radio-button value="REF_ID">{{ $t('order_filter.key_request') }}</radio-button>
                    <radio-button value="NICK_NAME">{{ $t('order_filter.nickname') }}</radio-button>
                    <template v-if="isSuperAdmin">
                      <radio-button value="ADMIN_NICK_NAME">{{ $t('order_filter.admin_support_name') }}</radio-button>
                    </template>
                  </b-form-radio-group>
                  <search-input
                    ref="searchInput"
                    v-model="searchValue"
                    class="mt-3"
                    :placeholder="$t('placeholder.search')"
                  />
                </div>
              </div>
            </div>

            <div class="modal-support-request__item">
              <div class="form-control-request">
                <div class="form-control-request__title">{{ $t('customer_care.list_request.label.created_at') }}</div>
                <div class="form-control-request__content">
                  <div class="calendar-picker" @click="onModalDatePicker">
                    <div class="calendar-picker__inner">
                      <div class="calendar-picker__text">{{ datePickerRangeText }}</div>
                      <div class="calendar-picker__icon d-flex">
                        <span class="icon-calendar"></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="modal-support-request__item">
              <div class="form-control-request">
                <div class="form-control-request__title">{{ $t('customer_care.state') }}</div>
                <div class="form-control-request__content">
                  <b-form-radio-group v-model="customerRequestStateSelected" name="searchState" class="search-multiple-group flex-row">
                    <radio-button
                      v-for="(option, index) in customerRequestStates"
                      :key="`state-${index}`"
                      :value="option"
                      @input="onFilterRequestState"
                    >
                      {{ option.name }}
                    </radio-button>
                  </b-form-radio-group>
                </div>
              </div>
            </div>

            <div v-if="isSuperAdmin" class="modal-support-request__item">
              <div class="form-control-request">
                <div class="form-control-request__title">Nhân viên CSKH</div>
                <div class="form-control-request__content">
                  <b-form-radio-group v-model="customerRequestStepsSelected" name="searchCSKH" class="search-multiple-group flex-row">
                    <radio-button
                      v-for="(option, index) in customerRequestSteps"
                      :key="`customer-${index}`"
                      :value="option"
                    >
                      {{ option.name }}
                    </radio-button>
                  </b-form-radio-group>
                </div>
              </div>
            </div>

            <div class="modal-support-request__item">
              <div class="form-control-request">
                <div class="form-control-request__title">{{ $t('customer_care.table.topic') }}</div>
                <div class="form-control-request__content">
                  <div class="report-type">
                    <div class="report-type__container">
                      <div class="report-type__list">
                        <div
                          v-for="(type, index) in customerRequestType"
                          :key="`type-${index}`"
                          class="report-type__item"
                          :class="{ active: customerRequestTypeSelected?.value === type.value }"
                          @click="onSelectRequestType(type)"
                        >
                          <div class="report-type__icon">
                            <img :src="type.imageUrl" :alt="type.name">
                          </div>
                          <div class="report-type__text">
                            {{ type.name }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-support-request__action">
          <base-button
            variants="outlined"
            full-width
            @click="onResetFilter"
          >
            {{ $t('common.reset') }}
          </base-button>
          <base-button
            variants="contained"
            color="primary"
            @click="onFilterModal"
          >
            {{ $t('action.confirm') }}
          </base-button>
        </div>
      </div>
    </div>
    <client-only>
      <date-picker-calendar-modal
        :id="calendarElementId"
        :date-range="dateRange"
        :label="labelDateRange"
        :is-show-note="false"
        @on-confirm="handleConfirmFilterDate"
      />
    </client-only>
  </b-modal>
</template>
<script>
import { MODAL } from '@/resources/modal.js';
import { CUSTOMER_SUPPORT_STATE, CUSTOMER_SUPPORT_STEP, CUSTOMER_SUPPORT_TYPE } from '@/constants/customer-support'
import dayjs from 'dayjs'
import { DATE_FORMAT, USER_ROLE } from '@/config/constant'
import { mapState } from 'vuex'
export default {
  components: {
    BaseButton: () => import('~/components/common/base-button/index.vue'),
    RadioButton: () => import('~/components/common/forms/radio-button/index.vue'),
    SearchInput: () => import('~/components/common/forms/search-input/index.vue'),
    DatePickerCalendarModal: () => import('~/components/mobile/modal/date-picker/index.vue')
  },
  data () {
    return {
      modalId: MODAL.FILTER_SEARCH_SUPPORT_REQUEST,
      calendarElementId: 'filterModalDatePicker',
      labelDateRange: {
        selectDate: this.$t('customer_care.list_request.label.created_at')
      },
      searchField: 'REF_ID',
      searchValue: '',
      dateRange: {
        startDate: null,
        endDate: null
      },
      stateTime: {
        startDate: null,
        endDate: null
      },
      customerRequestTypeSelected: {},
      customerRequestStepsSelected: {},
      customerRequestStateSelected: {},
      customerRequestStates: [
        {
          name: this.$t('common.new'),
          value: CUSTOMER_SUPPORT_STATE.NEW
        },
        {
          name: this.$t('common.old'),
          value: CUSTOMER_SUPPORT_STATE.OLD
        }
      ],
      customerRequestSteps: [
        {
          name: this.$t('customer_care.received'),
          value: CUSTOMER_SUPPORT_STEP.RECEIVED
        },
        {
          name: this.$t('customer_care.pending'),
          value: CUSTOMER_SUPPORT_STEP.PENDING
        }
      ],
      customerRequestType: [
        {
          name: this.$t('customer_care.types.order'),
          value: CUSTOMER_SUPPORT_TYPE.ORDER,
          imageUrl: '/assets/images/common/customer-request/transfer.svg'
        },
        {
          name: this.$t('customer_care.types.transaction'),
          value: CUSTOMER_SUPPORT_TYPE.TRANSACTION,
          imageUrl: '/assets/images/common/customer-request/transaction.svg'
        },
        {
          name: this.$t('customer_care.types.appeal'),
          value: CUSTOMER_SUPPORT_TYPE.APPEAL,
          imageUrl: '/assets/images/common/customer-request/appeal.svg'
        },
        {
          name: this.$t('customer_care.types.system'),
          value: CUSTOMER_SUPPORT_TYPE.SYSTEM,
          imageUrl: '/assets/images/common/customer-request/system.svg'
        },
        {
          name: this.$t('customer_care.types.manager'),
          value: CUSTOMER_SUPPORT_TYPE.REGISTRATION_MANAGER,
          imageUrl: '/assets/images/common/customer-care/manager-registration.svg'
        },
        {
          name: this.$t('customer_care.types.other'),
          value: CUSTOMER_SUPPORT_TYPE.OTHER,
          imageUrl: '/assets/images/common/customer-request/other.svg'
        }
      ]
    }
  },
  computed: {
    ...mapState('user', ['user']),
    isSuperAdmin () {
      return this.user?.type === USER_ROLE.SUPER_ADMIN
    },
    requestType () {
      return Object.keys(this.customerRequestTypeSelected).length ? this.customerRequestTypeSelected.value : ''
    },
    requestStep () {
      return Object.keys(this.customerRequestStepsSelected).length ? this.customerRequestStepsSelected.value : ''
    },
    requestState () {
      return Object.keys(this.customerRequestStateSelected).length ? this.customerRequestStateSelected.value : ''
    },
    startDate () {
      if (!this.dateRange.startDate) {
        return ''
      }
      return dayjs(this.dateRange.startDate).startOf('days').format()
    },
    endDate () {
      if (!this.dateRange.endDate) {
        return ''
      }
      return dayjs(this.dateRange.endDate).endOf('days').format()
    },
    datePickerRangeText () {
      if (!this.startDate && !this.endDate) {
        return ''
      }
      return `${dayjs(this.dateRange.startDate).format(DATE_FORMAT)} - ${dayjs(this.dateRange.endDate).format(DATE_FORMAT)}`
    },
    filterOptions () {
      return {
        ...((this.searchField && this.searchValue) && { searchField: this.searchField }),
        ...(this.searchValue && { searchValue: this.searchValue }),
        ...(this.requestType && { type: this.requestType }),
        ...(this.requestStep && { step: this.requestStep }),
        startDate: this.stateTime.startDate ? this.stateTime.startDate : this.startDate,
        endDate: this.stateTime.endDate ? this.stateTime.endDate : this.endDate
      }
    }
  },
  methods: {
    onSelectRequestType (type) {
      this.customerRequestTypeSelected = type
    },
    handleConfirmFilterDate ({ startDate, endDate }) {
      this.dateRange = { startDate, endDate }
    },
    onModalDatePicker () {
      this.$bvModal.show(this.calendarElementId)
    },
    onFilterModal () {
      this.$emit('on-filter', this.filterOptions)
      this.$bvModal.hide(this.modalId)
    },
    onFilterRequestState (state) {
      this.customerRequestStateSelected = state
      this.stateTime.startDate = null;
      this.stateTime.endDate = null;
      if (state?.value === CUSTOMER_SUPPORT_STATE.NEW) {
        this.stateTime.startDate = dayjs().subtract(12, 'hours').format()
      }
      if (state?.value === CUSTOMER_SUPPORT_STATE.OLD) {
        this.stateTime.endDate = dayjs().subtract(12, 'hours').format()
      }
    },
    onResetFilter () {
      this.customerRequestTypeSelected = {}
      this.searchField = ''
      this.searchValue = ''
      this.dateRange.startDate = null
      this.dateRange.endDate = null
      this.customerRequestStepsSelected = {}
      this.customerRequestStateSelected = {}
      this.stateTime.startDate = null
      this.stateTime.endDate = null
    }
  }
};
</script>
<style scoped lang="scss" src="static/assets/scss/components/mobile/admin/customer-care/modal-filter.scss">
</style>
