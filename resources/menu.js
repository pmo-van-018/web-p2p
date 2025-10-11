import { USER_ROLE } from '@/config/constant.js';
export const LEFT_MENU = [
  {
    title: 'menu.left_menu.overview',
    icon: 'icon-dashboard',
    url: '/merchant/dashboard',
    activeUrls: ['/merchant/dashboard'],
    isCountOrder: false,
    permission: [USER_ROLE.MERCHANT_OPERATOR],
    iconInActive: '/assets/icons/menu/inactive/dashboard.svg',
    iconActive: '/assets/icons/menu/active/dashboard.svg'
  },
  {
    title: 'menu.left_menu.ads',
    icon: 'icon-note-2',
    url: '/merchant/postings',
    activeUrls: [
      '/merchant/postings',
      '/merchant/create-ad',
      '/merchant/postings-history',
      'merchant-postings-history-id',
      '/merchant/posting-detail'
    ],
    isCountOrder: false,
    permission: [USER_ROLE.MERCHANT_OPERATOR],
    iconInActive: '/assets/icons/menu/inactive/ads.svg',
    iconActive: '/assets/icons/menu/active/ads.svg'
  },
  {
    title: 'menu.left_menu.orders',
    icon: 'icon-convertshape-2',
    url: '/merchant/orders',
    activeUrls: ['/merchant/completed-orders', '/merchant/pending-orders'],
    isCountOrder: true,
    permission: [USER_ROLE.MERCHANT_OPERATOR],
    iconInActive: '/assets/icons/menu/inactive/order.svg',
    iconActive: '/assets/icons/menu/active/order.svg'
  },
  {
    title: 'menu.left_menu.shift_manage',
    icon: 'icon-convertshape-2',
    url: '/merchant/shift-management',
    activeUrls: ['/merchant/shift-management'],
    isCountOrder: false,
    permission: [USER_ROLE.MERCHANT_OPERATOR],
    iconInActive: '/assets/icons/menu/inactive/submit.svg',
    iconActive: '/assets/icons/menu/active/submit.svg'
  },
  {
    title: 'menu.left_menu.setting',
    icon: 'icon-setting',
    url: '/merchant/settings',
    activeUrls: [],
    isCountOrder: false,
    permission: [USER_ROLE.SUPER_ADMIN],
    iconInActive: '/assets/icons/menu/inactive/setting.svg',
    iconActive: '/assets/icons/menu/active/setting.svg'
  }
];

export const SIDEBAR_ADMIN = [
  {
    title: 'menu.left_menu.overview',
    icon: 'icon-dashboard',
    url: '/dashboard',
    activeUrls: ['/dashboard'],
    permission: [USER_ROLE.SUPER_ADMIN],
    iconInActive: '/assets/icons/menu/inactive/dashboard.svg',
    iconActive: '/assets/icons/menu/active/dashboard.svg'
  },
  // {
  //   title: 'menu.report',
  //   icon: 'icon-report',
  //   url: '/admin/report',
  //   activeUrls: ['/admin/pending-orders'],
  //   permission: [USER_ROLE.SUPER_ADMIN]
  // },
  // {
  //   title: 'menu.left_menu.ads',
  //   icon: 'icon-ads',
  //   url: '/admin/postings',
  //   activeUrls: ['/admin/postings'],
  //   permission: [USER_ROLE.SUPER_ADMIN]
  // },
  {
    title: 'menu.appeal',
    icon: 'icon-complaint',
    url: '/appeals',
    activeUrls: ['/appeals', 'appeal-detail'],
    permission: [USER_ROLE.SUPER_ADMIN],
    iconInActive: '/assets/icons/menu/inactive/complain.svg',
    iconActive: '/assets/icons/menu/active/complain.svg',
    isAppealCount: true
  },
  {
    title: 'menu.merchant',
    icon: 'icon-cup',
    url: '/merchant-managers',
    activeUrls: ['/merchant-managers', 'merchant-managers-id-staffs'],
    permission: [USER_ROLE.SUPER_ADMIN],
    iconInActive: '/assets/icons/menu/inactive/merchant.svg',
    iconActive: '/assets/icons/menu/active/merchant.svg'
  },
  {
    title: 'menu.admin_supporter',
    icon: 'icon-cup',
    url: '/admin-supporters',
    activeUrls: ['/admin-supporters'],
    permission: [USER_ROLE.SUPER_ADMIN],
    iconInActive: '/assets/icons/menu/inactive/admin-supporter.svg',
    iconActive: '/assets/icons/menu/active/admin-supporter.svg'
  },
  {
    title: 'menu.user',
    icon: 'icon-cup',
    url: '/users',
    activeUrls: ['/users'],
    permission: [USER_ROLE.SUPER_ADMIN],
    iconInActive: '/assets/icons/menu/inactive/staff.svg',
    iconActive: '/assets/icons/menu/active/staff.svg'
  },
  {
    title: 'menu.help',
    icon: 'icon-complaint',
    url: '/support-requests',
    activeUrls: ['/support-requests', 'admin-supporter-support-requests-id'],
    permission: [USER_ROLE.SUPER_ADMIN],
    iconInActive: '/assets/icons/menu/inactive/customer.svg',
    iconActive: '/assets/icons/menu/active/customer.svg',
    isRequestCount: true
  },
  {
    title: 'menu.blacklist',
    icon: 'icon-complaint',
    url: '/blacklists',
    activeUrls: ['/blacklist'],
    permission: [USER_ROLE.SUPER_ADMIN],
    iconInActive: '/assets/icons/menu/inactive/blacklist.svg',
    iconActive: '/assets/icons/menu/active/blacklist.svg',
    isRequestCount: false
  },
  {
    title: 'menu.news',
    icon: 'icon-complaint',
    url: '/news',
    activeUrls: ['/news'],
    permission: [USER_ROLE.SUPER_ADMIN],
    iconInActive: '/assets/icons/menu/inactive/news.svg',
    iconActive: '/assets/icons/menu/active/news.svg',
    isRequestCount: false
  }
];

export const SIDEBAR_ADMIN_SUPPORTER = [
  {
    title: 'menu.appeal',
    icon: 'icon-complaint',
    url: '/admin-supporter/list-appeals',
    activeUrls: ['/admin-supporter/list-appeals', 'admin-supporter-appeal-detail'],
    permission: [USER_ROLE.ADMIN_SUPPORTER],
    iconInActive: '/assets/icons/menu/inactive/complain.svg',
    iconActive: '/assets/icons/menu/active/complain.svg',
    isAppealCount: true
  },
  {
    title: 'menu.left_menu.orders',
    icon: 'icon-convertshape-2',
    url: '/admin-supporter/orders',
    activeUrls: ['/admin-supporter/orders'],
    permission: [USER_ROLE.MERCHANT_OPERATOR],
    iconInActive: '/assets/icons/menu/inactive/order.svg',
    iconActive: '/assets/icons/menu/active/order.svg',
    isFailedTransactionCount: true
  },
  {
    title: 'menu.help',
    icon: 'icon-complaint',
    url: '/admin-supporter/support-requests',
    activeUrls: ['/admin-support/support-requests'],
    permission: [USER_ROLE.ADMIN_SUPPORTER],
    iconInActive: '/assets/icons/menu/inactive/customer.svg',
    iconActive: '/assets/icons/menu/active/customer.svg',
    isRequestCount: true
  }
];

export const SIDEBAR_SYSTEM_ADMIN = [
  {
    title: 'menu.left_menu.system_setting',
    icon: 'icon-setting',
    url: '/system-admin/system-settings',
    activeUrls: ['/system-admin/system-settings'],
    permission: [USER_ROLE.SYSTEM_ADMIN],
    iconInActive: '/assets/icons/menu/inactive/setting.svg',
    iconActive: '/assets/icons/menu/active/setting.svg'
  },
  {
    title: 'menu.left_menu.ui_setting',
    icon: 'icon-setting',
    url: '/system-admin/ui-settings',
    activeUrls: ['/system-admin/ui-settings'],
    permission: [USER_ROLE.SYSTEM_ADMIN],
    iconInActive: '/assets/icons/menu/inactive/ui-setting.svg',
    iconActive: '/assets/icons/menu/active/ui-setting.svg'
  },
  {
    title: 'menu.left_menu.supper_admin',
    icon: 'icon-complaint',
    url: '/system-admin/admins',
    activeUrls: ['/system-admin/admins'],
    permission: [USER_ROLE.SYSTEM_ADMIN],
    iconInActive: '/assets/icons/menu/inactive/admin.svg',
    iconActive: '/assets/icons/menu/active/admin.svg'
  },
  {
    title: 'menu.news',
    icon: 'icon-complaint',
    url: '/system-admin/news',
    activeUrls: ['/news'],
    permission: [USER_ROLE.SUPER_ADMIN],
    iconInActive: '/assets/icons/menu/inactive/news.svg',
    iconActive: '/assets/icons/menu/active/news.svg',
    isRequestCount: false
  }
];

export const SIDEBAR_MERCHANT_MANAGER = [
  {
    title: 'menu.left_menu.overview',
    icon: 'icon-dashboard',
    url: '/merchant-manager/dashboard',
    isCountOrder: false,
    activeUrls: ['/merchant-manager/dashboard'],
    rightIcon: '',
    iconInActive: '/assets/icons/menu/inactive/dashboard.svg',
    iconActive: '/assets/icons/menu/active/dashboard.svg'
  },
  {
    title: 'menu.staffs',
    icon: 'icon-profile-user',
    url: '/merchant-manager/staffs',
    isCountOrder: false,
    rightIcon: 'icon-info-circle1',
    activeUrls: ['/merchant-manager/staffs'],
    iconInActive: '/assets/icons/menu/inactive/staff.svg',
    iconActive: '/assets/icons/menu/active/staff.svg'
  },
  {
    title: 'menu.left_menu.ads',
    icon: 'icon-note-2',
    url: '/merchant-manager/postings',
    activeUrls: [
      '/merchant-manager/postings'
    ],
    isCountOrder: false,
    iconInActive: '/assets/icons/menu/inactive/ads.svg',
    iconActive: '/assets/icons/menu/active/ads.svg'
  },
  {
    title: 'menu.left_menu.payment_methods',
    icon: 'icon-card-add',
    url: '/merchant-manager/payments',
    isCountOrder: false,
    rightIcon: '',
    activeUrls: ['/merchant-manager/payments'],
    iconInActive: '/assets/icons/menu/inactive/payment.svg',
    iconActive: '/assets/icons/menu/active/payment.svg'
  },
  {
    title: 'menu.left_menu.shift_manage',
    icon: 'icon-convertshape-2',
    url: '/merchant-manager/shift-management',
    activeUrls: ['/merchant-manager/shift-management'],
    isCountOrder: false,
    iconInActive: '/assets/icons/menu/inactive/submit.svg',
    iconActive: '/assets/icons/menu/active/submit.svg'
  }
];
export const SIDEBAR_MERCHANT_SUPPORTER = [
  {
    title: 'menu.bottom_menu.order',
    icon: 'icon-convertshape-2',
    url: '/supporter/orders?status=pending',
    permission: [USER_ROLE.MERCHANT_SUPPORTER],
    activeUrls: ['/supporter/orders'],
    isRequiredLogin: true,
    iconInActive: '/assets/icons/menu/inactive/order.svg',
    iconActive: '/assets/icons/menu/active/order.svg'
  }
];
export const BOTTOM_BAR_MENU = {
  [USER_ROLE.USER]: [
    {
      title: 'menu.bottom_menu.home',
      icon: 'icon-home-trend-up',
      url: '/marketplace',
      isCountOrder: false,
      activeRoutes: ['marketplace', 'marketplace-type'],
      iconInActive: '/assets/icons/menu/inactive/p2p.svg',
      iconDarkInActive: '/assets/icons/menu/dark/p2p.svg',
      iconActive: '/assets/icons/menu/active/p2p.svg'
    },
    {
      title: 'menu.bottom_menu.dashboard',
      icon: 'icon-dashboard',
      url: '/user/dashboard',
      isCountOrder: false,
      activeRoutes: ['user-dashboard'],
      iconInActive: '/assets/icons/menu/inactive/dashboard.svg',
      iconDarkInActive: '/assets/icons/menu/dark/dashboard.svg',
      iconActive: '/assets/icons/menu/active/dashboard.svg'
    },
    {
      title: 'menu.bottom_menu.order',
      icon: 'icon-convertshape-2',
      url: '/user/orders?status=pending',
      isCountOrder: true,
      activeRoutes: ['user-orders', 'type-order-detail-orderRefId'],
      iconInActive: '/assets/icons/menu/inactive/order.svg',
      iconDarkInActive: '/assets/icons/menu/dark/order.svg',
      iconActive: '/assets/icons/menu/active/order.svg'
    },
    {
      title: 'menu.bottom_menu.payments',
      icon: 'icon-card-add',
      url: '/user/payments',
      isCountOrder: false,
      activeRoutes: ['user-payments'],
      iconInActive: '/assets/icons/menu/inactive/payment.svg',
      iconDarkInActive: '/assets/icons/menu/dark/payment.svg',
      iconActive: '/assets/icons/menu/active/payment.svg'
    }
  ],
  [USER_ROLE.MERCHANT_OPERATOR]: [
    {
      title: 'menu.bottom_menu.dashboard',
      icon: 'icon-dashboard',
      url: '/merchant/dashboard',
      isCountOrder: false,
      activeRoutes: ['merchant-dashboard'],
      iconInActive: '/assets/icons/menu/inactive/dashboard.svg',
      iconActive: '/assets/icons/menu/active/dashboard.svg'
    },
    {
      title: 'menu.bottom_menu.ads',
      icon: 'icon-note-2',
      url: '/merchant/postings',
      isCountOrder: false,
      activeRoutes: [
        'merchant-postings',
        'merchant-postings-history',
        'merchant-postings-history-id'
      ],
      iconInActive: '/assets/icons/menu/inactive/ads.svg',
      iconActive: '/assets/icons/menu/active/ads.svg'
    },
    {
      title: 'menu.bottom_menu.order',
      icon: 'icon-convertshape-2',
      url: '/merchant/orders?status=pending',
      isCountOrder: true,
      activeRoutes: ['merchant-orders'],
      iconInActive: '/assets/icons/menu/inactive/order.svg',
      iconActive: '/assets/icons/menu/active/order.svg'
    }
  ],
  [USER_ROLE.MERCHANT_MANAGER]: [
    {
      title: 'menu.bottom_menu.dashboard',
      icon: 'icon-dashboard',
      isCountOrder: false,
      url: '/merchant-manager/dashboard',
      activeRoutes: ['merchant-manager-dashboard'],
      iconInActive: '/assets/icons/menu/inactive/dashboard.svg',
      iconActive: '/assets/icons/menu/active/dashboard.svg'
    },
    {
      title: 'menu.staffs',
      icon: 'icon-profile-user',
      isCountOrderWaitingOfMerchantManager: true,
      url: '/merchant-manager/staffs',
      activeRoutes: ['merchant-manager-staffs', 'merchant-manager-staffs-id-orders', 'merchant-manager-staffs-dashboard-id'],
      iconInActive: '/assets/icons/menu/inactive/staff.svg',
      iconActive: '/assets/icons/menu/active/staff.svg'
    }
  ],
  [USER_ROLE.SUPER_ADMIN]: [
    {
      title: 'menu.bottom_menu.dashboard',
      icon: 'icon-dashboard',
      url: '/dashboard',
      isCountOrder: false,
      activeRoutes: ['dashboard'],
      iconInActive: '/assets/icons/menu/inactive/dashboard.svg',
      iconActive: '/assets/icons/menu/active/dashboard.svg'
    },
    {
      title: 'menu.bottom_menu.appeal',
      icon: 'icon-complaint',
      url: '/appeals',
      isCountOrder: false,
      activeRoutes: ['appeals', 'appeal-detail'],
      iconInActive: '/assets/icons/menu/inactive/complain.svg',
      iconActive: '/assets/icons/menu/active/complain.svg'
    },
    {
      title: 'menu.bottom_menu.support',
      url: '/support-requests',
      activeRoutes: ['support-requests'],
      iconInActive: '/assets/icons/menu/inactive/customer.svg',
      iconActive: '/assets/icons/menu/active/customer.svg',
      isRequestCount: true
    }
  ],
  [USER_ROLE.SYSTEM_ADMIN]: [
    {
      title: 'menu.bottom_menu.setting',
      icon: 'icon-setting',
      url: '/system-admin/system-settings',
      isCountOrder: false,
      activeRoutes: ['system-admin-settings'],
      iconInActive: '/assets/icons/menu/inactive/setting.svg',
      iconActive: '/assets/icons/menu/active/setting.svg'
    }
  ],
  [USER_ROLE.ADMIN_SUPPORTER]: [
    {
      title: 'menu.bottom_menu.appeal',
      icon: 'icon-complaint',
      url: '/admin-supporter/list-appeals',
      isCountOrder: false,
      activeRoutes: ['admin-supporter-list-appeals', 'admin-supporter-appeal-detail'],
      iconInActive: '/assets/icons/menu/inactive/complain.svg',
      iconActive: '/assets/icons/menu/active/complain.svg'
    },
    {
      title: 'menu.bottom_menu.support',
      url: '/admin-supporter/support-requests',
      isRequestCount: true,
      activeRoutes: ['admin-supporter-support-requests'],
      iconInActive: '/assets/icons/menu/inactive/customer.svg',
      iconActive: '/assets/icons/menu/active/customer.svg'
    }
  ]
}

export const ORDER_MENU = {
  name: 'menu.order_menu.name',
  list: [
    {
      title: 'menu.order_menu.pending',
      icon: 'loading',
      url: '/merchant/orders?status=pending',
      urlEndUser: '/user/orders?status=pending',
      useImage: true
    },
    {
      title: 'menu.order_menu.completed',
      icon: 'complete',
      url: '/merchant/orders?status=completed',
      urlEndUser: '/user/orders?status=completed',
      useImage: true
    }
  ]
};

export const ADS_MENU = {
  name: 'menu.ads_menu.name',
  list: [
    {
      title: 'menu.ads_menu.ads_list',
      icon: 'ads',
      url: '/merchant/postings',
      useImage: true
    },
    {
      title: 'menu.ads_menu.ads_history',
      icon: 'history',
      url: '/merchant/postings-history',
      useImage: true
    },
    {
      title: 'menu.ads_menu.ads_create',
      icon: 'add-new',
      url: '/merchant/create-ad',
      useImage: true
    }
  ]
};

export const ACCOUNT_MENU = [
  {
    title: 'menu.account_menu.about',
    icon: 'icon-note1',
    url: '/',
    permission: [USER_ROLE.MERCHANT_OPERATOR, USER_ROLE.MERCHANT_SUPPORTER, USER_ROLE.MERCHANT_MANAGER, USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN_SUPPORTER],
    isRequiredLogin: false,
    externalDomainUser: true,
    iconInActive: '/assets/icons/menu/inactive/home.svg',
    iconActive: '/assets/icons/menu/active/home.svg'
  },
  {
    title: 'menu.account_menu.overview',
    icon: 'icon-dashboard',
    url: '/user/dashboard',
    permission: [USER_ROLE.USER],
    isRequiredLogin: true,
    externalDomainUser: false,
    iconInActive: '/assets/icons/menu/inactive/dashboard.svg',
    iconDarkInActive: '/assets/icons/menu/dark/dashboard.svg',
    iconActive: '/assets/icons/menu/active/dashboard.svg'
  },
  {
    title: 'menu.account_menu.dashboard',
    icon: 'icon-chart',
    url: '/merchant/dashboard',
    permission: [USER_ROLE.MERCHANT_OPERATOR],
    isRequiredLogin: true,
    externalDomainUser: false,
    iconInActive: '/assets/icons/menu/inactive/dashboard.svg',
    iconActive: '/assets/icons/menu/active/dashboard.svg'
  },
  {
    title: 'menu.account_menu.dashboard',
    icon: 'icon-chart',
    url: '/dashboard',
    permission: [USER_ROLE.SUPER_ADMIN],
    isRequiredLogin: true,
    externalDomainUser: false,
    iconInActive: '/assets/icons/menu/inactive/dashboard.svg',
    iconActive: '/assets/icons/menu/active/dashboard.svg'
  },
  {
    title: 'menu.account_menu.dashboard',
    icon: 'icon-chart',
    url: '/merchant-manager/dashboard',
    permission: [USER_ROLE.MERCHANT_MANAGER],
    isRequiredLogin: true,
    externalDomainUser: false,
    iconInActive: '/assets/icons/menu/inactive/dashboard.svg',
    iconActive: '/assets/icons/menu/active/dashboard.svg'
  },
  {
    title: 'menu.account_menu.dashboard',
    icon: 'icon-chart',
    url: '/supporter/orders?status=pending',
    permission: [USER_ROLE.MERCHANT_SUPPORTER],
    isRequiredLogin: true,
    externalDomainUser: false,
    iconInActive: '/assets/icons/menu/inactive/dashboard.svg',
    iconActive: '/assets/icons/menu/active/dashboard.svg'
  },
  {
    title: 'menu.account_menu.payment_methods',
    icon: 'icon-card-add',
    url: '/user/payments',
    permission: [USER_ROLE.USER],
    isRequiredLogin: true,
    externalDomainUser: false,
    iconInActive: '/assets/icons/menu/inactive/payment.svg',
    iconDarkInActive: '/assets/icons/menu/dark/payment.svg',
    iconActive: '/assets/icons/menu/active/payment.svg'
  },
  {
    title: 'menu.account_menu.security',
    icon: 'icon-archive-tick',
    url: '/privacy-principles',
    permission: [],
    isRequiredLogin: false,
    externalDomainUser: true,
    iconInActive: '/assets/icons/menu/inactive/policy.svg',
    iconDarkInActive: '/assets/icons/menu/dark/policy.svg',
    iconActive: '/assets/icons/menu/active/policy.svg'
  },
  {
    title: 'menu.account_menu.rule',
    icon: 'icon-guard',
    url: '/terms',
    permission: [],
    isRequiredLogin: false,
    externalDomainUser: true,
    iconInActive: '/assets/icons/menu/inactive/rule.svg',
    iconDarkInActive: '/assets/icons/menu/dark/rule.svg',
    iconActive: '/assets/icons/menu/active/rule.svg'
  },
  {
    title: 'menu.account_menu.help',
    icon: 'icon-message-question',
    url: '/faq',
    permission: [],
    isRequiredLogin: false,
    externalDomainUser: true,
    iconInActive: '/assets/icons/menu/inactive/help.svg',
    iconDarkInActive: '/assets/icons/menu/dark/help.svg',
    iconActive: '/assets/icons/menu/active/help.svg'
  }
];

export const SIDEBAR_RIGHT_MENU = [
  {
    title: 'menu.account_menu.about',
    icon: 'icon-note1',
    url: '/',
    permission: [],
    isRequiredLogin: false,
    externalDomainUser: true,
    iconInActive: '/assets/icons/menu/inactive/home.svg',
    iconDarkInActive: '/assets/icons/menu/dark/home.svg',
    iconActive: '/assets/icons/menu/active/home.svg'
  },
  {
    title: 'menu.account_menu.overview',
    icon: 'icon-dashboard',
    url: '/user/dashboard',
    permission: [USER_ROLE.USER],
    isRequiredLogin: true,
    externalDomainUser: false,
    iconInActive: '/assets/icons/menu/inactive/dashboard.svg',
    iconDarkInActive: '/assets/icons/menu/dark/dashboard.svg',
    iconActive: '/assets/icons/menu/active/dashboard.svg'
  },
  {
    title: 'menu.merchant',
    icon: 'icon-cup',
    url: '/merchant-managers',
    permission: [USER_ROLE.SUPER_ADMIN],
    isRequiredLogin: true,
    externalDomainUser: false,
    iconInActive: '/assets/icons/menu/inactive/merchant.svg',
    iconActive: '/assets/icons/menu/active/merchant.svg'
  },
  {
    title: 'menu.user',
    icon: 'icon-cup',
    url: '/users',
    activeUrls: ['/users'],
    permission: [USER_ROLE.SUPER_ADMIN],
    isRequiredLogin: true,
    iconInActive: '/assets/icons/menu/inactive/staff.svg',
    iconActive: '/assets/icons/menu/active/staff.svg'
  },
  {
    title: 'menu.account_menu.payment_methods',
    icon: 'icon-card-add',
    url: '/merchant-manager/payments',
    permission: [USER_ROLE.MERCHANT_MANAGER],
    isRequiredLogin: true,
    externalDomainUser: false,
    iconInActive: '/assets/icons/menu/inactive/payment.svg',
    iconActive: '/assets/icons/menu/active/payment.svg'
  },
  {
    title: 'menu.account_menu.payment_methods',
    icon: 'icon-card-add',
    url: '/user/payments',
    permission: [USER_ROLE.USER],
    isRequiredLogin: true,
    externalDomainUser: false,
    iconInActive: '/assets/icons/menu/inactive/payment.svg',
    iconDarkInActive: '/assets/icons/menu/dark/payment.svg',
    iconActive: '/assets/icons/menu/active/payment.svg'
  },
  {
    title: 'menu.account_menu.security',
    icon: 'icon-archive-tick',
    url: '/privacy-principles',
    permission: [],
    isRequiredLogin: false,
    externalDomainUser: true,
    iconInActive: '/assets/icons/menu/inactive/policy.svg',
    iconDarkInActive: '/assets/icons/menu/dark/policy.svg',
    iconActive: '/assets/icons/menu/active/policy.svg'
  },
  {
    title: 'menu.account_menu.rule',
    icon: 'icon-guard',
    url: '/terms',
    permission: [],
    isRequiredLogin: false,
    externalDomainUser: true,
    iconInActive: '/assets/icons/menu/inactive/rule.svg',
    iconDarkInActive: '/assets/icons/menu/dark/rule.svg',
    iconActive: '/assets/icons/menu/active/rule.svg'
  },
  {
    title: 'menu.account_menu.help',
    icon: 'icon-message-question',
    url: '/faq',
    permission: [],
    isRequiredLogin: false,
    externalDomainUser: true,
    iconInActive: '/assets/icons/menu/inactive/help.svg',
    iconDarkInActive: '/assets/icons/menu/dark/help.svg',
    iconActive: '/assets/icons/menu/active/help.svg'
  }
];

export const LEFT_MENU_NOTIFICATION = [
  {
    title: 'left_menu_notification.overview',
    icon: 'icon-dashboard',
    url: '/notification?tab=all',
    activeUrls: ['all'],
    permission: [USER_ROLE.MERCHANT_OPERATOR, USER_ROLE.USER],
    counterNotify: 'totalBell',
    iconInActive: '/assets/icons/menu/inactive/dashboard.svg',
    iconDarkInActive: '/assets/icons/menu/dark/dashboard.svg',
    iconActive: '/assets/icons/menu/active/dashboard.svg'
  },
  {
    title: 'left_menu_notification.orders',
    icon: 'icon-convertshape-2',
    url: '/notification?tab=transaction',
    activeUrls: ['transaction'],
    permission: [USER_ROLE.MERCHANT_OPERATOR, USER_ROLE.USER],
    counterNotify: 'totalTransaction',
    iconInActive: '/assets/icons/menu/inactive/order.svg',
    iconDarkInActive: '/assets/icons/menu/dark/order.svg',
    iconActive: '/assets/icons/menu/active/order.svg'
  },
  {
    title: 'left_menu_notification.notification',
    icon: 'icon-device-message',
    url: '/notification?tab=system',
    activeUrls: ['system'],
    permission: [USER_ROLE.MERCHANT_OPERATOR, USER_ROLE.USER],
    counterNotify: 'totalSystem',
    iconInActive: '/assets/icons/menu/inactive/system-notification.svg',
    iconDarkInActive: '/assets/icons/menu/dark/system-notification.svg',
    iconActive: '/assets/icons/menu/active/system-notification.svg'
  }
];
