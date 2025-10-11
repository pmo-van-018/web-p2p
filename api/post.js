const POST_API = {
  SEARCH: '/marketplace/get-posts',
  SEARCH_BRIEF: '/marketplace/get-posts-brief',
  SEARCH_BY_MERCHANT: '/marketplace/get-posts-by-merchant',
  SEARCH_BRIEF_BY_MERCHANT: '/marketplace/get-posts-brief-by-merchant',
  GET_AMOUNT_RANGE: '/marketplace/get-amount-range',
  SEARCH_REFERENCE_EXCHANGE_RATE: '/posts/merchant/search-reference-exchange-rate',
  POST_STATUS: '/marketplace/list-online-posts',
  CREATE: '/posts/merchant/create-post',
  UPDATE: '/posts/merchant/update-post',
  CLOSE: id => `/posts/merchant/close-post/${id}`,
  UPDATE_STATUS: id => `/posts/merchant/update-post-status/${id}`,
  GET_DETAIL: id => `/posts/merchant/get-post-info/${id}`,
  GET_HISTORY_DETAIL: id => `/posts/merchant/get-post-history/${id}`,
  GET_LIST: '/posts/merchant/list-posts',
  GET_POST_ORDERS: '/posts/merchant/get-matched-orders-by-post',
  RECOMMEND_PRICE: '/posts/merchant/get-post-recommend-price',
  MERCHANT_MANAGER_LIST_POST: '/posts/merchant-manager/list-posts',
  MANAGER_UPDATE: '/posts/merchant-manager/update-post',
  MANAGER_GET_DETAIL: id => `/posts/merchant-manager/get-post-info/${id}`,
  MERCHANT_MANAGER_UPDATE_POST: id => `/posts/merchant-manager/update-post-status/${id}`
}
module.exports = POST_API
