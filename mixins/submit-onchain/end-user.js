import { SENDING_CRYPTO_STATUS } from '@/config/constant';
import USER_ORDER_API from '@/api/user-order';
import fetchEventMixin from '@/mixins/submit-onchain/fetch-event';
import { mapActions, mapState } from 'vuex';
import { MODAL } from '@/resources/modal';

export default {
  data () {
    return {
      isConfirmSubmitTransactionCrypto: false
    }
  },
  mixins: [fetchEventMixin],
  computed: {
    ...mapState('send-crypto', ['confirmSendCryptoInfo']),
    statusConfirmSendCryptoInfo () {
      return this.confirmSendCryptoInfo?.status || ''
    },
    titleErrorOnChainSendCrypto () {
      return this.confirmSendCryptoInfo?.title || ''
    },
    subTitleErrorOnChainSendCrypto () {
      return this.confirmSendCryptoInfo?.subTitle || ''
    }
  },
  methods: {
    ...mapActions('send-crypto', ['setResult']),
    async $_userSubmitTransactionOnChain_onFetchTxEventsOnChain ({ fromAddress, toAddress, orderId, assetNetwork, assetName, orderCreatedAt }) {
      try {
        this.isConfirmSubmitTransactionCrypto = true
        const txHash = await this.$_fetchEventOnChain_fetchAndProcessEvents({
          fromAddress,
          toAddress,
          assetNetwork,
          assetName
        });
        const isTransactionCryptoSentAfterCreateOrder = await this.$_fetchEventOnChain_isTransactionSentAfterOrderCreated(assetNetwork, orderCreatedAt, txHash)
        if (txHash && isTransactionCryptoSentAfterCreateOrder) {
          await this.submitTransactionCrypto(orderId, txHash, assetNetwork);
        } else {
          this.handleError(SENDING_CRYPTO_STATUS.FAILED, '');
        }
      } catch (error) {
        this.handleError(SENDING_CRYPTO_STATUS.FAILED, '');
      } finally {
        this.isConfirmSubmitTransactionCrypto = false
      }
    },
    async submitTransactionCrypto (orderId, txHash, assetNetwork) {
      const result = await this.$_userSubmitTransactionOnChain_onSubmitTransactionCrypto(orderId, txHash);
      if (result?.data) {
        const { data } = result;
        this.setResult({
          status: data.status,
          hash: data.hash,
          network: assetNetwork,
          orderId: data.orderId
        });
        this.$bvModal.hide(MODAL.SEND_CRYPTO_CONFIRMATION);
      }
    },
    handleError (status) {
      this.setConfirm({
        status,
        amount: 0,
        asset: '',
        orderId: '',
        title: this.$t('modal.send_crypto_confirmation.onchain.error_title'),
        subTitle: this.$t('modal.send_crypto_confirmation.onchain.error_sub_title')
      });
    },
    async $_userSubmitTransactionOnChain_onSubmitTransactionCrypto (orderId, txHash) {
      try {
        return await this.$axios.$post(USER_ORDER_API.SUBMIT_CRYPTO_TRANSACTION, {
          orderId,
          hash: txHash,
          isUpdate: true
        });
      } catch (e) {
        console.error(e)
      }
    }
  }
}
