export default {
  props: {
    message: {
      type: Object,
      required: true
    },
    signCookieQuery: {
      type: String,
      default: ''
    }
  },
  computed: {
    fileUrl () {
      return `${this.message.fileUpload?.completedUrl}?${this.signCookieQuery}`
    },
    mime () {
      return this.message?.fileUpload?.mime
    },
    fileName () {
      return decodeURIComponent(this.message?.fileUpload?.filename)
    }
  },
  methods: {
    onDownloadFile () {
      if (this.fileUrl && this.fileName) {
        const link = document.createElement('a')
        link.href = encodeURIComponent(this.fileUrl)
        link.target = '_blank'
        link.download = this.fileName
        document.body.appendChild(link)
        link.click()

        document.body.removeChild(link);
      }
    }
  }
}
