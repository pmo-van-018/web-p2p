import { POST_STATUS } from '@/constants/posts'

export const LIST_STATUS = {
  CLOSE: { id: 2, name: 'CLOSE', label: 'postings.post_item.close' },
  ONLINE: { id: 1, name: 'ONLINE', label: 'postings.post_item.online' },
  OFFLINE: { id: 0, name: 'OFFLINE', label: 'postings.post_item.offline' }
}

export const LIST_STATUS_POSTING_FILTER = [
  { name: 'postings.post_item.online', value: POST_STATUS.ONLINE },
  { name: 'postings.post_item.offline', value: POST_STATUS.OFFLINE }
]

export const STATUS_AVAILABLE_FILTER = `${POST_STATUS.OFFLINE},${POST_STATUS.ONLINE}`
