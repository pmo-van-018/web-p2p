export const STATUS_TRANSACTION = {
  FAILED: {
    text: 'FAILED',
    image: '/assets/images/common/orders/transfer-fail.svg',
    desc: 'merchant.modal_result_send_crypto.transaction_failed',
    note: 'merchant.modal_result_send_crypto.note_failed',
    icon: '<span class="icon-circle-cancel"><span class="path1" /><span class="path2" /><span class="path3" /></span>'
  },
  SUCCEED: {
    text: 'SUCCEED',
    image: '/assets/images/common/orders/succeed-transaction.svg',
    desc: 'merchant.modal_result_send_crypto.transaction_successed',
    note: 'merchant.modal_result_send_crypto.note_successed',
    icon: '<span class="icon-success"/>'
  },
  PENDING: {
    text: 'PENDING',
    image: '/assets/images/common/orders/transfer-processing.svg',
    desc: 'merchant.modal_result_send_crypto.transaction_processing',
    note: 'merchant.modal_result_send_crypto.note_processing',
    icon: '<span class="icon-loading"><span class="path1"></span><span class="path2"></span></span>'
  }
}
