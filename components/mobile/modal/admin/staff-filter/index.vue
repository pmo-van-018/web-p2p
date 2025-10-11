<template>
  <b-modal
    :id="MODAL.STAFFS_FILTER"
    modal-class="modal-custom"
    centered
    hide-header
    hide-footer
    @hide="$emit('hide')"
    @show="onShowFilterStaff"
  >
    <section class="modal-filter">
      <div class="modal-filter__container">
        <div class="modal-filter__head">
          <h2 class="modal-filter__title">{{ $t('order_filter.filter') }}</h2>
          <div class="modal-filter__close" @click="onCloseModal">
            <span class="icon-cancel" />
          </div>
        </div>
        <div class="modal-filter__body">
          <div class="content-wrapper">
            <div class="content-wrapper__title">{{ $t('staff.filters.merchant') }}</div>
            <div class="content-wrapper__context">
              <merchant-manager-search
                :selected="selected"
                :is-reset="isResetData"
                :merchant-manager-list="merchantManagersFormatter"
                @on-selected="onSelectedMerchant"
                @on-search="onSearchMerchantManager"
              />
            </div>
          </div>

          <div class="content-wrapper">
            <div class="content-wrapper__title">{{ $t('staff.wallet_address') }}</div>
            <div class="content-wrapper__context">
              <search-input
                v-model="searchAddressAndNicknameStaff"
                :is-show-icon="false"
                :placeholder="$t('staff.placeholder.wallet_and_nickname')"
              />
            </div>
          </div>

          <div class="content-wrapper">
            <div class="content-wrapper__title">{{ $t('staff.status') }}</div>
            <div class="content-wrapper__context">
              <div class="w-75">
                <b-form-radio-group v-model="statusSelected" name="status">
                  <radio-button
                    v-for="option in options"
                    :key="option.name"
                    :value="option.id"
                    class="status-custom"
                  >
                    {{ option.label }}
                  </radio-button>
                </b-form-radio-group>
              </div>
            </div>
          </div>

          <div class="content-wrapper">
            <div class="content-wrapper__title">{{ $t('staff.selected_time') }}</div>
            <div class="content-wrapper__context">
              <calendar-custom
                :is-visible-header="false"
                :is-open-date-picker="isOpenDatePicker"
                is-watch-change-current
                @on-change="onConfirmDatePicker"
              />
            </div>
          </div>
        </div>
        <div class="modal-filter__footer">
          <div class="modal-filter__footer-inner">
            <base-button
              variants="outlined"
              full-width
              :loading="false"
              :disabled="false"
              @click="onResetFilters"
            >
              {{ $t('common.reset') }}
            </base-button>
            <base-button
              variants="contained"
              color="primary"
              full-width
              :loading="false"
              :disabled="false"
              @click="onConfirmFilters"
            >
              {{ $t('common.apply') }}
            </base-button>
          </div>
        </div>
      </div>
    </section>
  </b-modal>
</template>
<script>
import { MODAL } from '@/resources/modal'
import { LIST_STATUS } from '@/resources/role-management';
import dayjs from 'dayjs';
import merchantManagerMixin from '@/mixins/admin/merchant-manager';
import debounce from 'lodash/debounce';
import { USER_STATUS } from '~/config/constant';

export default {
  components: {
    SearchInput: () => import('~/components/common/forms/search-input/index.vue'),
    RadioButton: () => import('~/components/common/forms/radio-button/index.vue'),
    CalendarCustom: () => import('~/components/mobile/modal/date-picker/calendar-custom.vue'),
    BaseButton: () => import('~/components/common/base-button/index.vue'),
    MerchantManagerSearch: () => import('~/components/mobile/modal/admin/staff-filter/merchant-manager-search.vue')
  },
  mixins: [merchantManagerMixin],
  props: {
    selected: {
      type: Array,
      default: () => []
    },
    walletAddressData: {
      type: String,
      default: ''
    }
  },
  data () {
    const startDate = new Date();
    const endDate = new Date();
    startDate.setDate(startDate.getDate() - 31)
    const statusOptions = Object.values(LIST_STATUS).map(item => ({
      ...item,
      label: this.$t(item?.label)
    })).filter(status => status.name !== USER_STATUS.DELETED)

    return {
      MODAL,
      isResetData: false,
      statusSelected: null,
      searchAddressAndNicknameStaff: '',
      datePicker: {
        startDate,
        endDate
      },
      options: statusOptions,
      isOpenDatePicker: true,
      merchantIds: [],
      callOnceMerchantManagerApi: 0
    }
  },
  computed: {
    merchantManagersFormatter () {
      return this.merchantManagers.map((item) => {
        return {
          text: item.nickName,
          value: item.id
        }
      })
    },
    isDisableResetButton () {
      return this.searchAddressAndNicknameStaff === '' &&
          this.merchantIds.length === 0 &&
          this.statusSelected === null
    },
    startDate () {
      if (!this.datePicker.startDate) {
        return ''
      }
      return dayjs(this.datePicker.startDate).format('YYYY-MM-DD')
    },
    endDate () {
      if (!this.datePicker.startDate) {
        return ''
      }
      return dayjs(this.datePicker.endDate).format('YYYY-MM-DD')
    },
    statusUser () {
      return this.statusSelected !== null ? Number(this.statusSelected) : ''
    },
    mapByMerchantsIds () {
      if (this.merchantIds.length) {
        return this.merchantIds.map((merchant) => {
          return merchant.value
        }).join(',')
      }
      return ''
    },
    dataTransferred () {
      return {
        startDate: this.startDate,
        endDate: this.endDate,
        status: this.statusUser,
        search: this.searchAddressAndNicknameStaff,
        merchantIds: this.mapByMerchantsIds,
        merchantManagerSelectedList: this.merchantIds
      }
    }
  },
  methods: {
    onShowFilterStaff () {
      if (this.callOnceMerchantManagerApi < 1) {
        this.callOnceMerchantManagerApi = this.callOnceMerchantManagerApi + 1
        this.$_merchantManagerMixin_onResetFilter()
      }
      this.searchAddressAndNicknameStaff = this.walletAddressData
    },
    onSelectedMerchant (merchantIds) {
      this.merchantIds = merchantIds
      this.isResetData = false
    },
    onCloseModal () {
      this.$bvModal.hide(MODAL.STAFFS_FILTER)
    },
    onConfirmFilters () {
      this.$emit('on-confirm', this.dataTransferred)
    },
    onResetFilters () {
      this.searchAddressAndNicknameStaff = ''
      this.isResetData = true
      this.statusSelected = null
      this.merchantIds = []
    },
    onConfirmDatePicker (options) {
      this.datePicker.startDate = options.startDate
      this.datePicker.endDate = options.endDate
    },
    onSearchMerchantManager: debounce(function (search) {
      this.$_merchantManagerMixin_onChangeFilter({ search })
    }, 800)
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/mobile/modal/modal-staff-filter/index.scss">
</style>
