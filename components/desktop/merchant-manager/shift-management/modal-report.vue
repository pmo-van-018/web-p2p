<template>
  <b-modal
    :id="MODAL.SHIFT_SUMMARY_REPORT"
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
            <h1 class="summary-report__title">{{ $t('shift_management.title_modal') }}</h1>
            <div class="summary-report__close" @click="$bvModal.hide(MODAL.SHIFT_SUMMARY_REPORT)">
              <span class="icon-cancel" />
            </div>
          </div>
          <div class="summary-report__body">
            <div class="summary-report__context">
              <div class="summary-report__context-head">
                <div class="summary-report__context-box">1</div>
                <div class="summary-report__context-title">{{ $t('report.select_merchant_operator') }}</div>
              </div>
              <div class="summary-report__context-body">
                <report-wrapper>
                  <report-list-merchant
                    :role="role"
                    :merchants="merchantOperators"
                    :is-reset="isResetSelectedMerchantOperator"
                    @on-selected="merchantOperatorSelected = $event; isResetSelectedMerchantOperator = false"
                    @intersect="onInfiniteLoadingMerchantOperator"
                    @on-search="onSearchMerchantOperator"
                  />
                </report-wrapper>
              </div>
            </div>

            <div class="summary-report__context">
              <div class="summary-report__context-head">
                <div class="summary-report__context-box">2</div>
                <div class="summary-report__context-title">{{ $t('report.custom_and_select_time') }}</div>
              </div>
              <div class="summary-report__context-body">
                <report-wrapper :title="$t('report.choice_date_export')">
                  <div class="summary-report__content">
                    <report-action
                      v-for="time in rangeDates"
                      :key="time.key"
                      class="flex-grow-1"
                      :item="time"
                      :active="selectRangeDate?.key === time.key"
                      @click="onSelectRangeDate(time)"
                    />
                    <report-select-quarter
                      class="flex-grow-1"
                      :min-date="minDate"
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

                <div class="summary-report__datepicker">
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
              :disabled="isLoadingExportReport"
              :loading="isLoadingExportReport"
              color="primary"
              full-width
              @click="onSubmitExportReport"
            >
              {{ $t('action.button_export_history') }}
            </base-button>
          </div>
        </div>
      </div>
    </div>
  </b-modal>
</template>
<script>
import shiftReportMixin from '~/mixins/merchant/shift-report'
export default {
  mixins: [shiftReportMixin]
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/modal/modal-summary-report.scss">
</style>
