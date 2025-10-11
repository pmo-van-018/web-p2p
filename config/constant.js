export const IMAGE_PATH = '/assets/images/'

export const WIDTH_NAME = {
  DESKTOP: 1425,
  WIDE: 1300,
  TABLET: 1200,
  MOBILE: 980,
  MOBILE_768: 768,
  MOBILE_480: 480,
  MOBILE_320: 320
}
export const USER_ROLE = {
  MERCHANT_OPERATOR: 'MERCHANT_OPERATOR',
  MERCHANT_SUPPORTER: 'MERCHANT_SUPPORTER',
  MERCHANT_MANAGER: 'MERCHANT_MANAGER',
  USER: 'USER',
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN_SUPPORTER: 'ADMIN_SUPPORTER',
  SYSTEM_ADMIN: 'SYSTEM_ADMIN'
}

export const USER_ROLE_CODE = {
  USER: 1,
  SUPER_ADMIN: 2,
  MERCHANT_MANAGER: 3,
  MERCHANT_OPERATOR: 4,
  MERCHANT_SUPPORTER: 5,
  ADMIN_SUPPORTER: 6,
  SYSTEM_ADMIN: 7
}

export const USER_TYPE = {
  USER: 'USER',
  MERCHANT: 'MERCHANT',
  ADMIN: 'ADMIN'
}

export const USER_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  BLOCKED: 'BLOCKED',
  DELETED: 'DELETED'
}

export const USER_ROLE_STRING = {
  MERCHANT_OPERATOR: 'Giao dịch viên',
  MERCHANT_SUPPORTER: 'Hỗ trợ viên'
}

export const NAME_EVENT_WS_JOIN = 'join';
export const NAME_EVENT_WS_LISTEN = 'data'
export const FIELD_SORT = {
  ID: 'id',
  AMOUNT: 'amount'
}
export const TYPE_SORT = {
  DESC: 'DESC',
  ASC: 'ASC'
}

export const ORDER_STATUS = {
  TO_BE_PAID: 'TO_BE_PAID',
  CONFIRM_PAID: 'CONFIRM_PAID',
  PAID: 'PAID',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
}

export const ORDER_STATUS_KEY = {
  TO_BE_PAID: 1,
  CONFIRM_PAID: 2,
  PAID: 3,
  COMPLETED: 4,
  CANCELLED: 5
}

export const FULL_DATE_FORMAT = 'DD-MM-YYYY HH:mm:ss'

export const DIFF_DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss'

export const DATE_FORMAT = 'DD-MM-YYYY'

export const POST_TYPE = {
  BUY: 'BUY',
  SELL: 'SELL'
}

export const TRADE_TYPE = {
  BUY: 'BUY',
  SELL: 'SELL'
}

export const ICON_SETTING = {
  bank: 'icon-bank',
  calendar: 'icon-calendar-days',
  calendar_edit: 'icon-calendar-edit',
  moneys: 'icon-moneys',
  timer: 'icon-timer1',
  tag: 'icon-tag',
  minus: 'icon-transaction-minus',
  maintenance: 'icon-system',
  other_setting: 'icon-other-setting'
}

export const DATE_TIME_FORMAT = {
  DATE_ONLY: 'YYYY-MM-DD',
  DATE_VIEW: 'DD/MM/YYYY',
  TIME_ONLY: 'HH:mm:ss'
}

export const CRYPTO_INPUT_MAX_LENGTH = 17;
export const CRYPTO_INPUT_MAX_VALUE = 999999999999;

export const MAX_SUPPORT_REQUEST_LIMIT = 999;

export const MAX_PAYMENT_METHOD_LIMIT = 99;

export const MAX_APPEAL_RECEIVE_LIMIT = 99;

export const NAME_EVENT_WS_LISTEN_NOTIFICATION = 'notification'
export const IS_SKIP_NOTE_BY_DEVICE = 'isSkipNoteByDevice';
export const IS_SKIP_POLICY_CONDITION_DEVICE = 'isSkipPolicyCondition';
export const NAME_EVENT_WS_HEART_BEAT = 'ping';
export const WS_HEART_BEAT_INTERVAL_TIME = 30000;

export const MASTER_DATA_COMMON_DEFAULT = {
  MIN_ORDER_LIMIT: 150000,
  MAX_ORDER_LIMIT: 150000000,
  MIN_POST_LIMIT: 150000,
  MAX_POST_LIMIT: 150000000,
  FEE: 0.21,
  PENALTY_FEE: 0.23,
  USER_ASK_MERCHANT_TIME: 10,
  USER_ASK_CS_TIME: 10,
  SUBMIT_EVIDENCE_TIME: 1440,
  CRYPTO_TRANSACTION_TIME: 15,
  NUMBER_LIMIT_PAYMENT_METHOD: 10,
  NUMBER_LIMIT_PICK_APPEAL: 5,
  NUMBER_LIMIT_PICK_REQUEST: 5
};

export const MASTER_DATA_COMMON_MIN_VALUE = {
  MIN_ORDER_LIMIT: 1,
  MAX_ORDER_LIMIT: 1,
  MIN_POST_LIMIT: 1,
  MAX_POST_LIMIT: 1,
  FEE: 0.01,
  PENALTY_FEE: 0.01,
  USER_ASK_MERCHANT_TIME: 5,
  USER_ASK_CS_TIME: 5,
  SUBMIT_EVIDENCE_TIME: 60,
  CRYPTO_TRANSACTION_TIME: 5,
  SETTING_LIMIT: 5,
  EVIDENCE_TIME: 60
};

export const MASTER_DATA_COMMON_MAX_VALUE = {
  SUBMIT_EVIDENCE_TIME: 4320,
  CRYPTO_TRANSACTION_TIME: 30,
  MAX_ASK_TIME: 30
};

export const ICON_ASSET_NETWORK_DEFAULT = '/assets/images/common/networks/default.svg'
export const ICON_COIN_DEFAULT = '/assets/images/common/vndt.svg'

export const SENDING_CRYPTO_STATUS = {
  PROCESSING: 'processing',
  FAILED: 'failed'
}

export const LOGIN_TYPE_ROLE = {
  OPERATION: 'operation',
  ADMIN: 'admin',
  USER: 'user'
}

export const CHECK_ONLINE_POST_INTERVAL = 10000;

export const TWO_FA_STATUS = {
  UNKNOWN: 0,
  ENABLED: 1,
  DISABLED: 2,
  UNAUTHORIZED: 3
}
