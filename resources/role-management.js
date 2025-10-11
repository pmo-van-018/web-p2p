import { USER_ROLE, USER_STATUS } from '@/config/constant';

export const LIST_STATUS = {
  ALL: { id: 0, name: '', label: 'role_management.item.all' },
  ACTIVE: { id: 1, name: USER_STATUS.ACTIVE, label: 'role_management.item.active' },
  INACTIVE: { id: 2, name: USER_STATUS.INACTIVE, label: 'role_management.item.inactive' },
  DELETED: { id: 4, name: USER_STATUS.DELETED, label: 'role_management.item.deleted' }
};

export const LIST_STAFF = {
  ALL: { id: 0, name: '', label: 'role_management.item.all' },
  MERCHANT_OPERATOR: { id: 4, name: USER_ROLE.MERCHANT_OPERATOR, label: 'role_management.label.merchant_operator' },
  MERCHANT_SUPPORTER: { id: 5, name: USER_ROLE.MERCHANT_SUPPORTER, label: 'role_management.label.merchant_supporter' }
}

export const TABLE_FIELDS = {
  ADMIN_MERCHANT_MANAGER: [
    {
      key: 'nickName',
      label: 'role_management.label.nickname',
      subLabel: '',
      sortField: 'nickName',
      isSort: false,
      thStyle: {
        width: '14%'
      }
    },
    {
      key: 'walletAddress',
      label: 'role_management.label.wallet_address',
      subLabel: '',
      sortField: 'walletAddress',
      isSort: false,
      thStyle: {
        width: '30%',
        minWidth: '120px'
      }
    },
    {
      key: 'numberMembers',
      label: 'role_management.label.number_members',
      subLabel: '',
      sortField: '',
      isSort: false,
      thStyle: {
        width: '4%'
      }
    },
    {
      key: 'contract',
      label: 'role_management.label.contract_from',
      subLabel: '',
      sortField: '',
      isSort: false,
      thStyle: {
        width: '9%',
        minWidth: '132px'
      }
    },
    {
      key: 'completedTime',
      label: 'role_management.label.completed_time',
      subLabel: '',
      sortField: '',
      isSort: false,
      thStyle: {
        width: '21%',
        minWidth: '120px'
      }
    },
    {
      key: 'status',
      label: 'role_management.label.status',
      subLabel: '',
      sortField: '',
      isSort: false,
      thStyle: {
        width: '8%',
        minWidth: '120px'
      }
    },
    {
      key: 'updateAt',
      label: 'role_management.label.time_create',
      subLabel: 'role_management.label.time_update',
      sortField: '',
      isSort: false,
      thStyle: {
        width: '12%',
        minWidth: '120px'
      }
    },
    {
      key: 'staff',
      label: 'role_management.label.staff',
      subLabel: '',
      sortField: '',
      isSort: false,
      align: 'center',
      thStyle: {
        width: '6%'
      }
    },
    {
      key: 'gasless',
      label: 'role_management.label.gasless',
      subLabel: '',
      sortField: '',
      isSort: false,
      align: 'center',
      thStyle: {
        width: '11%'
      }
    },
    {
      key: 'actions',
      label: 'role_management.label.action',
      subLabel: '',
      sortField: '',
      isSort: false,
      align: 'center',
      thStyle: {
        width: '6%'
      }
    }
  ],
  ADMIN_SUPPORTER: [
    {
      key: 'nickName',
      label: 'role_management.label.nickname',
      subLabel: '',
      sortField: 'nickName',
      isSort: false,
      thStyle: {
        width: '14%'
      }
    },
    {
      key: 'walletAddress',
      label: 'role_management.label.wallet_address',
      subLabel: '',
      sortField: 'walletAddress',
      isSort: false,
      thStyle: {
        width: '30%',
        minWidth: '120px'
      }
    },
    {
      key: 'appealReceivedCount',
      label: 'role_management.label.complaints_support',
      subLabel: '',
      sortField: '',
      isSort: false,
      align: 'center',
      thStyle: {
        width: '9%'
      }
    },
    {
      key: 'pickSupportRequestCount',
      label: 'role_management.label.request_support',
      subLabel: '',
      sortField: '',
      isSort: false,
      align: 'center',
      thStyle: {
        width: '9%'
      }
    },
    {
      key: 'status',
      label: 'role_management.label.status',
      subLabel: '',
      sortField: '',
      isSort: false,
      align: 'center',
      thStyle: {
        width: '10%',
        minWidth: '120px'
      }
    },
    {
      key: 'updateAt',
      label: 'role_management.label.time_create',
      subLabel: 'role_management.label.time_update',
      sortField: '',
      isSort: false,
      thStyle: {
        width: '12%',
        minWidth: '120px'
      }
    },
    {
      key: 'actions',
      label: 'role_management.label.action',
      subLabel: '',
      sortField: '',
      isSort: false,
      align: 'center',
      thStyle: {
        width: '10%'
      }
    }
  ],
  ADMIN_STAFF: [
    {
      key: 'nickName',
      label: 'role_management.label.nickname',
      subLabel: '',
      sortField: 'nickName',
      isSort: false,
      thStyle: {
        width: '14%'
      }
    },
    {
      key: 'walletAddress',
      label: 'role_management.label.wallet_address',
      subLabel: '',
      sortField: 'walletAddress',
      isSort: false,
      thStyle: {
        width: '30%',
        minWidth: '120px'
      }
    },
    {
      key: 'postShownCount',
      label: 'role_management.label.post_show_count',
      subLabel: '',
      sortField: '',
      isSort: false,
      thStyle: {
        width: '9%'
      }
    },
    {
      key: 'orderWaitingCount',
      label: 'role_management.label.post_hide_count',
      subLabel: '',
      sortField: '',
      isSort: false,
      thStyle: {
        width: '9%'
      }
    },
    {
      key: 'type',
      label: 'role_management.label.type',
      subLabel: '',
      sortField: '',
      isSort: false,
      thStyle: {
        width: '9%'
      }
    },
    {
      key: 'status',
      label: 'role_management.label.status',
      subLabel: '',
      sortField: '',
      isSort: false,
      thStyle: {
        width: '12%',
        minWidth: '120px'
      }
    },
    {
      key: 'updateAt',
      label: 'role_management.label.time_create',
      subLabel: 'role_management.label.time_update',
      sortField: '',
      isSort: false,
      thStyle: {
        width: '13%',
        minWidth: '132px'
      }
    }
  ],
  MERCHANT_MANAGER_STAFF: [
    {
      key: 'nickName',
      label: 'role_management.label.nickname',
      subLabel: '',
      sortField: 'nickName',
      isSort: false,
      thStyle: {
        width: '12%'
      }
    },
    {
      key: 'walletAddress',
      label: 'role_management.label.wallet_address',
      subLabel: '',
      sortField: 'walletAddress',
      isSort: false,
      thStyle: {
        width: '29%',
        minWidth: '120px'
      }
    },
    {
      key: 'orderAppealCount',
      label: 'role_management.label.order_appeal_count',
      subLabel: '',
      sortField: '',
      align: 'center',
      isSort: false,
      thStyle: {
        width: '9%'
      }
    },
    {
      key: 'postShownCount',
      label: 'role_management.label.post_show_count',
      subLabel: '',
      sortField: '',
      align: 'center',
      isSort: false,
      thStyle: {
        width: '9%'
      }
    },
    {
      key: 'orderWaitingCount',
      label: 'role_management.label.post_hide_count',
      subLabel: '',
      sortField: '',
      align: 'center',
      isSort: false,
      thStyle: {
        width: '9%'
      }
    },
    {
      key: 'type',
      label: 'role_management.label.type',
      subLabel: '',
      sortField: '',
      align: 'center',
      isSort: false,
      thStyle: {
        width: '9%'
      }
    },
    {
      key: 'status',
      label: 'role_management.label.status',
      subLabel: '',
      sortField: '',
      align: 'center',
      isSort: false,
      thStyle: {
        width: '10%',
        minWidth: '120px'
      }
    },
    {
      key: 'updateAt',
      label: 'role_management.label.time_create',
      subLabel: 'role_management.label.time_update',
      sortField: '',
      isSort: false,
      thStyle: {
        width: '13%',
        minWidth: '132px'
      }
    },
    {
      key: 'actions',
      label: 'role_management.label.action',
      subLabel: '',
      sortField: '',
      isSort: false,
      align: 'right',
      thStyle: {
        minWidth: '100px'
      }
    }
  ],
  SUPPER_ADMIN: [
    {
      key: 'nickName',
      label: 'role_management.label.nickname',
      subLabel: 'role_management.label.wallet_address',
      sortField: '',
      isSort: false,
      thStyle: {
        width: '410px'
      }
    },
    {
      key: 'createdAt',
      label: 'role_management.label.time_create',
      subLabel: '',
      sortField: '',
      align: 'center',
      isSort: false
    },
    {
      key: 'updatedAt',
      label: 'role_management.label.time_update',
      subLabel: '',
      sortField: '',
      isSort: false,
      align: 'center'
    },
    {
      key: 'status',
      label: 'role_management.label.status',
      subLabel: '',
      sortField: '',
      align: 'center',
      isSort: false,
      thStyle: {
        width: '135px'
      }
    },
    {
      key: 'actions',
      label: 'role_management.label.action',
      subLabel: '',
      sortField: '',
      isSort: false,
      align: 'right',
      thStyle: {
        minWidth: '100px'
      }
    }
  ]
};

export const VALIDATION_RULES = {
  MIN_LENGTH_NICKNAME: 8,
  MAX_LENGTH_NICKNAME: 20,
  MIN_RATE: 0,
  MAX_RATE: 100
};
