const CHAT_API = {
  GET_CHAT_HISTORY: roomId => `/rooms/${roomId}/get-history-message`,
  GET_LAST_MESSAGE: roomId => `/rooms/${roomId}/get-last-message`,
  GET_LAST_MESSAGES: '/rooms/last-messages',
  UPLOAD_FILE: roomId => `/rooms/${roomId}/upload-file`,
  SIGNED_COOKIE: roomId => `/rooms/${roomId}/signed-cookie`,
  PRESIGNED_URL: roomId => `/rooms/${roomId}/presigned-url`,
  ADMIN_SIGNED_COOKIE: roomId => `/admin/rooms/${roomId}/signed-cookie`,
  ADMIN_GET_CHAT_HISTORY: roomId => `/admin/rooms/${roomId}/get-history-message`,
  ADMIN_GET_ALL_MESSAGES: roomId => `/admin/rooms/${roomId}/get-all-messages`,
  CREATE_ORDER_ROOM_CHAT: '/chat/merchant/create-order-room-chat',
  USER_PARTICIPANTS: id => `/chat/list-participants/${id}`,
  MERCHANT_PARTICIPANTS: id => `/chat/merchant/list-participants/${id}`,
  ADMIN_PARTICIPANTS: id => `/chat/admin/list-participants/${id}`
};
module.exports = CHAT_API
