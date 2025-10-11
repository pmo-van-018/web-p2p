/**
 * events
 * ---------------------
 * Define all your possible custom events here.
 */
export const events = {
  objects: {
    user: 'user',
    policy: 'policy',
    order: 'order',
    system: 'system',
    appeal: 'appeal',
    notification: 'notification'
  },
  actions: {
    user: {
      created: 'onUserCreated',
      blocked: 'onUserBlocked',
      deactivated: 'onUserDeactivated',
      deleted: 'onUserDeleted',
      statistic: 'onUserStatistic'
    },
    policy: {
      created: 'onPolicyCreate'
    },
    order: {
      buy: {
        userCreateBuyOrder: 'onUserCreateBuyOrder',
        userConfirmPayment: 'onUserConfirmPayment',
        merchantConfirmPayment: 'onMerchantConfirmPayment',
        userCancelled: 'onUserCancelled',
        merchantSubmitTransaction: 'onMerchantSubmitTransaction',
        systemUpdateStep: 'onSystemUpdateStep',
        systemUpdateTransactionStatus: 'onSystemUpdateTransactionStatusBuyOrder',
        systemUpdateAppealTimeout: 'onSystemUpdateAppealTimeout',
        systemCancelOrder: 'onSystemCancelOrder',
        systemFinishOrder: 'onSystemFinishOrder'
      },
      sell: {
        userCreateOrder: 'onUserCreateSellOrder',
        merchantConfirmSentPayment: 'onMerchantConfirmSentPayment',
        userSubmitTransaction: 'onUserSubmitTransaction',
        userConfirmReceived: 'onUserConfirmReceived',
        userCancelOrder: 'onUserCancelSellOrder',
        systemCancelOrder: 'onSystemCancelSellOrder',
        systemUpdateTransactionStatus: 'onSystemUpdateTransactionStatusSellOrder',
        systemUpdateStepOrder: 'onSystemUpdateStepSellOrder'
      }
    },
    appeal: {
      // Buy
      userCreateAppeal: 'onUserCreateAppeal',
      extraTime: 'onExtraTime',
      userBuyAppeal: 'onUserBuyAppeal',
      closeAppealInBuy: 'oncloseAppealInBuy',
      resultBuyAppealUserWin: 'onResultBuyAppealUserWin',
      resultBuyAppealMerchantWin: 'onResultBuyAppealMerchantWin',
      closeBuyAppealNotEvident: 'onCloseBuyAppealNotEvident',
      reopenBuyAppealUserWin: 'onReopenBuyAppealUserWin',
      onExtraTimeBuyAppeal: 'onExtraTimeBuyAppeal',
      // Sell
      userSellAppeal: 'onUserSellAppeal',
      extraTimeSellAppeal: 'onExtraTimeSellAppeal',
      closeSellAppeal: 'onCloseSellAppeal',
      resultSellAppealMerchantWin: 'onResultSellAppealMerchantWin',
      resultSellAppealUserWin: 'onResultSellAppealUserWin',
      onExtraTimeSellAppeal: 'onExtraTimeSellAppeal',
      closeAppeal: 'onCloseAppeal',

      adminCancelAppealSession: 'onAdminCancelAppealSession'
    },
    supportRequest: {
      createNewSupportRequest: 'onCreateNewSupportRequest',
      supportRequestPicked: 'onSupportRequestPicked',
      resolvedSupportRequest: 'onResolvedSupportRequest'
    },
    system: {
      availableAmountLessThanMinAmount: 'onAvailableAmountLessThanMinAmount',
      deletePaymentMethodWithMerchant: 'onDeletePaymentMethodWithMerchant',
      availableAmountEqualZero: 'onAvailableAmountEqualZero'
    }
  }
};
