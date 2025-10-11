<script>
import BankSelector from '@/components/common/add-bank-selector.vue';
import { MODAL } from '@/resources/modal.js';
import { mapActions, mapGetters, mapState } from 'vuex';
import BaseInputLabel from '@/components/common/base-input-label.vue';
import isEmpty from 'lodash/isEmpty';
import { differenceObject } from '@/helper/difference';
import { CONFIRM_TYPE, RESPONSE_ICON } from '@/resources/message';
import { trimMultipleSpaceStartEndString } from '@/helper';

export default {
  components: {
    BankSelector,
    BaseInputLabel
  },
  data () {
    return {
      MODAL,
      formData: {
        bankNumber: '',
        bankName: '',
        bankHolder: '',
        bankRemark: ''
      },
      isSubmitPaymentLoading: false
    };
  },
  computed: {
    ...mapState('payments', ['supportBanks', 'paymentDetail']),
    ...mapGetters('payments', ['getSupportedBanks']),
    getTitle () {
      return this.paymentDetail?.id
        ? this.$t('add_bank_modal.title_edit')
        : this.$t('add_bank_modal.title');
    },
    buttonActionText () {
      return this.paymentDetail?.id ? this.$t('add_bank_modal.update') : this.$t('add_bank_modal.btn')
    },
    isSubmit () {
      return (
        this.formData.bankNumber &&
          this.formData.bankName &&
          this.formData.bankHolder &&
          !this.$refs.bankHolder?.$v.$invalid &&
          !this.$refs.bankNumber?.$v.$invalid &&
          !this.$refs.bankName?.$v.$invalid &&
          !this.$refs.bankRemark?.$v.$invalid &&
          !this.isSubmitPaymentLoading
      );
    }
  },
  methods: {
    ...mapActions('payments', [
      'setPaymentDetail',
      'createPayment',
      'updatePayment',
      'getSupportBanks',
      'createUserPayment',
      'updateUserPayment',
      'getUserSupportBanks',
      'setPaymentId'
    ]),
    ...mapActions('modal-response', ['showResponseModal']),
    onHideModal () {
      this.setPaymentDetail({});
    },
    onShowModal () {
      this.formData.bankNumber = this.paymentDetail.bankNumber;
      this.formData.bankName = this.paymentDetail.bankName;
      this.formData.bankHolder = this.paymentDetail.bankHolder;
      this.formData.bankRemark = this.paymentDetail.bankRemark;
      this.getSupportBanksWithRoles()
      this.confirmed = false
    },
    getSupportBanksWithRoles () {
      if (!isEmpty(this.$store.state.user.user) && !this.supportBanks.length) {
        if (window.location.host.includes(this.$config.OPERATION_DOMAIN)) {
          this.getSupportBanks()
        }
        if (window.location.host.includes(this.$config.USER_DOMAIN)) {
          this.getUserSupportBanks()
        }
      }
    },
    trimObjectPropertiesFormData (formData) {
      const trimmedData = {};
      for (const key in formData) {
        trimmedData[key] = trimMultipleSpaceStartEndString(formData[key])
      }
      return trimmedData;
    },
    async submit () {
      if (!this.isSubmit) {
        /* eslint-disable no-console */
        console.error('Some thing went wrong!');
        return;
      }
      this.isSubmitPaymentLoading = true
      const diffObject = differenceObject(this.formData, this.paymentDetail)
      const payload = this.trimObjectPropertiesFormData(diffObject)
      try {
        let result = null;
        if (payload) {
          if (this.paymentDetail.id) {
            payload.id = this.paymentDetail.id;

            if (window.location.host.includes(this.$config.OPERATION_PREFIX)) {
              result = await this.updatePayment(payload);
            } else {
              result = await this.updateUserPayment(payload);
            }
          } else if (window.location.host.includes(this.$config.OPERATION_PREFIX)) {
            result = await this.createPayment({ ...payload });
          } else {
            result = await this.createUserPayment({ ...payload });
          }
          if (result?.errors?.length) {
            const errorKey = result?.errors[0]?.key || 'error_system';
            const modalProperties = {};
            switch (errorKey) {
              case 'PAYMENT_NUMBER_IS_EXIST':
                modalProperties.title = payload?.id ? this.$t('modal.title.edit_payment') : this.$t('modal.title.add_payment');
                modalProperties.content = payload?.id ? this.$t('modal.content.can_not_edit_payment') : this.$t('modal.content.can_not_add_payment');
                modalProperties.icon = RESPONSE_ICON.PAYMENT_METHOD_NOT_ALLOWED;
                break;
              case 'PAYMENT_METHOD_HAS_REACH_LIMIT':
                modalProperties.title = this.$t('modal.title.system');
                modalProperties.content = '';
                modalProperties.icon = RESPONSE_ICON.PAYMENT_METHOD_HAS_REACH_LIMIT;
                break;
              default:
                modalProperties.title = '';
                modalProperties.content = payload?.id ? this.$t('modal.message.payment_update_failed') : this.$t('modal.message.payment_create_failed');
                modalProperties.icon = RESPONSE_ICON.PAYMENT_METHOD_FAILED;
                break;
            }
            this.showResponseModal({
              ...modalProperties,
              description: this.$t(`modal.message.${errorKey}`),
              show: true,
              confirmAction: this.$t('action.confirm'),
              confirmActionType: CONFIRM_TYPE.CLOSE
            })
          }
        }

        if (window.location.host.includes(this.$config.OPERATION_PREFIX)) {
          await this.getSupportBanks()
        } else {
          await this.getUserSupportBanks()
        }

        this.isSubmitPaymentLoading = false
        this.$bvModal.hide(MODAL.ADD_BANK);
      } catch (error) {
        console.error(error);
      } finally {
        this.isSubmitPaymentLoading = false
      }
    }
  }
};
</script>
