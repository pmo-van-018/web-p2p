export const REGEX_VALID_URL = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)/g
export const REGEX_URL_IN_TEXT = /(https?:\/\/[^\s]+)/g

export const REGEX_VALID_URL_IMAGE = /^https?:\/\/.*\/.*\.(png|gif|webp|jpeg|jpg)\??.*$/gmi
export const REGEX_VALID_FILE_IMAGE = /\.(png|gif|webp|jpeg|jpg)$/i;
export const REGEX_VALID_FILE_ATTACHMENT_CHAT = /\.(pdf|doc|docx?)$/i;
