import AUTH_API from '@/api/auth'
import {
  ERROR_TYPE,
  SKIP_GLOBAL_ERROR_POPUP_URLS,
  ERROR_MESSAGE,
  RESPONSE_ICON,
  CONFIRM_TYPE
} from '@/resources/message.js'

export default ({ store, app: { $axios, $cookies, i18n }, req, redirect }) => {
  const showErrorPopup = (error, type, data) => {
    const url = error?.config?.url;

    const isMatchSkip = (item) => {
      const isSameMethod = item?.method?.toLowerCase() === error?.config?.method?.toLowerCase();

      let isMatchUrl = false;
      if (item?.path && item?.path === url) {
        isMatchUrl = true;
      }

      if (!isMatchUrl && item?.pathPattern) {
        const regex = new RegExp(item?.pathPattern);
        isMatchUrl = regex.test(url);
      }

      return isSameMethod && isMatchUrl;
    }
    if (SKIP_GLOBAL_ERROR_POPUP_URLS.some(isMatchSkip)) {
      return;
    }

    store.commit(type, data);
  };

  const isLockedUser = (error) => {
    const message = error.response.data.errors[0]?.message;
    return message === ERROR_MESSAGE.OPERATION_IS_BLOCKED;
  }

  $axios.defaults.withCredentials = true
  $axios.onError((error) => {
    if (error.response?.data?.errors?.length) {
      const message = error.response.data.errors.slice(0, 1)
      const code = parseInt(error.response && error.response.status, 10);

      if (code === 412 || code === 400) {
        showErrorPopup(error, 'modal-message/INIT_MODAL', {
          type: ERROR_TYPE.MANUAL,
          message,
          api: error.response?.config?.url,
          isShow: true,
          showConnectWallet: false
        })
        return
      }
      switch (code) {
        case 401:
          if (isLockedUser(error)) {
            store.commit('user/SET_LOCKED_USER_DATA', true);
            redirect('/lock');
            return;
          }
          if (error.request?.path?.includes(AUTH_API.LOGOUT)) { return; }

          store.commit('modal-response/INIT_MODAL', {
            show: true,
            title: '',
            content: i18n.t('modal.message.session_expire'),
            description: i18n.t('modal.message.UNAUTHENTICATED'),
            icon: RESPONSE_ICON.CONNECT_EXPIRED_WALLET,
            confirmAction: i18n.t('action.confirm'),
            confirmActionType: CONFIRM_TYPE.LOGOUT,
            visibleClose: false,
            preventClose: true
          })
          break;
        case 429:
          store.commit('modal-response/INIT_MODAL', {
            show: true,
            title: i18n.t('modal.message.TITLE_FROM_SYSTEM'),
            description: i18n.t('modal.message.TOO_MANY_REQUEST_CONTENT'),
            icon: RESPONSE_ICON.TOO_MANY_REQUEST,
            visibleClose: true
          })
          break;
        default:
          break;
      }
    } else {
      showErrorPopup(error, 'modal-message/INIT_MODAL', {
        type: ERROR_TYPE.SYSTEM,
        message: [],
        api: error.response?.config?.url,
        isShow: true,
        showConnectWallet: false
      })
    }
  });

  $axios.interceptors.request.use((req) => {
    // for nginx, cf
    if (req.headers['x-domain']) {
      return req
    }
    req.headers['x-domain'] = process.server
      ? `${req?.headers['x-forwarded-proto']}://${req?.headers.host}`
      : `${window.location.protocol}//${window.location.host}`;
    return req
  })
};
