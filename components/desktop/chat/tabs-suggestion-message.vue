<template>
  <section class="tab-suggestion">
    <div class="tab-suggestion__container">
      <div class="tab-suggestion__inner">
        <b-tabs
          fill
          nav-class="tab-suggestion__nav"
          active-nav-item-class="tab-suggestion__nav-item-active"
          active-tab-class="tab-suggestion__active-tab"
        >
          <b-tab
            v-for="(tab, index) in tabsMapped"
            :key="index"
            v-b-tooltip.hover.bottom
            href="javascript:void(0)"
            role="presentation"
            tabindex="0"
            :title="tab.title"
            :active="currentTab === index"
            title-link-class="tab-suggestion__link-title"
            @click="handleActiveTab(tab, index)"
          >
            <div class="card-content">
              <div class="card-content__list">
                <div
                  v-for="(item, idx) in tabsMapped[currentTab].items"
                  :key="`card_${idx}`"
                  class="card-content__item"
                  @click="$emit('on-input', item)"
                >
                  <p v-html="normalizeText(item)" />
                </div>
              </div>
            </div>
          </b-tab>
        </b-tabs>
      </div>
    </div>
  </section>
</template>
<script>
import { REGEX_URL_IN_TEXT } from '@/constants';

export default {
  props: {
    tabs: {
      type: Array,
      default: () => []
    },
    active: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      currentTab: 0
    }
  },
  computed: {
    tabsMapped () {
      return [
        {
          title: 'Giao dịch',
          items: [
            'Xin lỗi về sự bất tiện bạn gặp phải. Bạn có thể cho tôi biết thêm chi tiết về vấn đề phát sinh hoặc mã giao dịch? Tôi sẽ kiểm tra ngay lập tức.',
            'Bạn có thể xem tất cả giao dịch của mình trong menu "Giao dịch" trên bảng điều khiển. Nếu bạn cần thông tin chi tiết hơn hoặc có thắc mắc, tôi ở đây để giúp đỡ.',
            'Chúng tôi hiểu sự trì hoãn có thể gây phiền toái. Thời gian xử lý giao dịch có thể biến động do lưu lượng mạng. Vui lòng kiên nhẫn và kiểm tra tình trạng giao dịch sau vài phút. Nếu vấn đề vẫn tiếp diễn, hãy liên hệ với chúng tôi.',
            'Nếu giao dịch của bạn không được thực hiện, có thể do lệnh không đáp ứng được các điều kiện (Sai mạng, không đủ số dư, hết thời gian giao dịch...) hoặc có vấn đề về tài khoản. Vui lòng kiểm tra lại thông tin và thử lại. Nếu cần hỗ trợ thêm, chúng tôi luôn sẵn lòng giúp đỡ.',
            'Sự khác biệt giữa giá hiển thị và giá giao dịch thực tế có thể do độ trễ của hệ thống hoặc biến động nhanh của thị trường. Chúng tôi luôn cố gắng cung cấp thông tin giá chính xác nhất. Nếu bạn cảm thấy có sự nhầm lẫn, xin vui lòng cung cấp chi tiết để chúng tôi có thể kiểm tra.',
            'Để điều chỉnh lệnh giao dịch, bạn cần hủy lệnh hiện tại và đặt lệnh mới với các thông số mong muốn. Hãy lưu ý rằng việc này chỉ khả thi nếu lệnh chưa được thực hiện. Nếu bạn cần hỗ trợ trong quá trình này, chúng tôi luôn sẵn lòng giúp đỡ.',
            'Trạng thái giao dịch sai có thể do sự cố kỹ thuật tạm thời. Vui lòng làm mới trang và kiểm tra lại sau ít phút. Nếu vấn đề vẫn không được giải quyết, xin hãy liên hệ với chúng tôi để được trợ giúp.',
            'Vui lòng cung cấp cho chúng tôi bằng chứng liên quan đến giao dịch chuyển tiền mã hóa mà bạn đã thực hiện.'
          ]
        },
        {
          title: 'Hệ thống',
          items: [
            'Phí giao dịch của chúng tôi dựa trên loại giao dịch và khối lượng. Tất cả thông tin chi tiết đã được cập nhật trên mỗi bài quảng cáo. Nếu bạn cần giải thích thêm, tôi sẵn lòng hỗ trợ.',
            'Chúng tôi xin lỗi về sự bất tiện này. Bạn có thể mô tả sự cố kỹ thuật mà bạn đang gặp phải? Điều này sẽ giúp chúng tôi xác định và giải quyết vấn đề một cách nhanh chóng.'
          ]
        },
        {
          title: 'Tài khoản',
          items: [
            'Bạn có thể dễ dàng theo dõi và quản lý giao dịch của mình trực tiếp trên màn hình "Tổng quan" tại bảng điều khiển. Chức năng này cung cấp cái nhìn tổng quan về hiệu suất giao dịch, cũng như khả năng phân tích và tối ưu hóa lợi nhuận của bạn.',
            `Chính sách bảo mật và quyền riêng tư của chúng tôi được thiết kế để bảo vệ thông tin cá nhân và tài sản của bạn. Bạn có thể xem chi tiết chính sách trên website ${this.$config.STATIC_DOMAIN}/privacy-principles của chúng tôi hoặc liên hệ với chúng tôi nếu có bất kỳ câu hỏi hoặc lo ngại nào.`,
            'Luôn cảnh giác với lừa đảo và hành vi gian lận, đặc biệt là trong thị trường crypto. Không bao giờ chia sẻ thông tin cá nhân hoặc thông tin ví dùng liên kết với sàn. Chúng tôi cũng khuyến cáo kiểm tra nguồn thông tin và chỉ giao dịch thông qua các nền tảng uy tín. Nếu bạn nghi ngờ hoạt động gian lận, hãy báo cáo ngay lập tức cho chúng tôi.'
          ]
        },
        {
          title: 'Khiếu nại',
          items: [
            'Nếu bạn nghi ngờ có gian lận trong giao dịch của mình, hãy ngừng mọi hoạt động và liên hệ ngay với chúng tôi. Cung cấp thông tin chi tiết giúp chúng tôi nhanh chóng điều tra và bảo vệ tài khoản của bạn.',
            'Nếu bạn có bất kỳ khiếu nại nào ở giao dịch, vui lòng chờ đến bước [Liên hệ CSKH] hoặc chủ động yêu cầu hỗ trợ trực tiếp từ chúng tôi thông qua chức năng trò chuyện.'
          ]
        }
      ]
    }
  },
  watch: {
    active (value) {
      this.currentTab = value
    }
  },
  mounted () {
    this.currentTab = this.active
  },
  methods: {
    handleActiveTab (tab, indexTab) {
      this.currentTab = indexTab
      this.$emit('change-tab', tab)
    },
    normalizeText (text) {
      return text.replace(REGEX_URL_IN_TEXT, (url) => {
        return `<a href="${url}" target="_blank">${url}</a>`;
      });
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/chat/tabs-suggestion-message.scss">
</style>
