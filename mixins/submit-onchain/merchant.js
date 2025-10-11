import { SENDING_CRYPTO_STATUS } from '@/config/constant';
import fetchEventMixin from '@/mixins/submit-onchain/fetch-event';
import MERCHANT_ORDER_API from '@/api/merchant-order';
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
    async $_merchantSubmitTransactionOnChain_onFetchTxEventsOnChain ({
      fromAddress,
      toAddress,
      orderId,
      assetNetwork,
      assetName,
      orderCreatedAt
    }) {
      try {
        this.isConfirmSubmitTransactionCrypto = true
        const transactionHash = await this.$_fetchEventOnChain_fetchAndProcessEvents(
          {
            fromAddress,
            toAddress,
            assetNetwork,
            assetName
          });
        if (!transactionHash) {
          this.handleError(SENDING_CRYPTO_STATUS.FAILED, '');
          return;
        }
        const isTransactionCryptoSentAfterCreateOrder = await this.$_fetchEventOnChain_isTransactionSentAfterOrderCreated(assetNetwork, orderCreatedAt, transactionHash)
        if (!isTransactionCryptoSentAfterCreateOrder) {
          this.handleError(SENDING_CRYPTO_STATUS.FAILED, '');
          return;
        }
        await this.submitTransactionCrypto(orderId, transactionHash, assetNetwork);
      } catch (error) {
        this.handleError(SENDING_CRYPTO_STATUS.FAILED, '');
      } finally {
        this.isConfirmSubmitTransactionCrypto = false
      }
    },
    async submitTransactionCrypto (orderId, txHash, assetNetwork) {
      const result = await this.$_merchantSubmitTransactionOnChain_onSubmitTransactionCrypto(orderId, txHash);
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
    async $_merchantSubmitTransactionOnChain_onSubmitTransactionCrypto (orderId, txHash) {
      try {
        return await this.$axios.$post(MERCHANT_ORDER_API.SUBMIT_CRYPTO_TRANSACTION, {
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
