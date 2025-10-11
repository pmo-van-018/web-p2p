<template>
  <div class="news-table">
    <base-table
      :fields="fields"
      :items="items"
      :is-loading="isLoading"
      :disabled="disabled"
      @change-sort="$emit('change-sort', $event)"
      @row-clicked="$emit('row-clicked', $event)"
    >
      <template #cell(content)="{ item }">
        <div class="newslist-item flex-row">
          <span class="blacklist-item__wallet-address">
            {{ item?.content }}
          </span>
        </div>
      </template>
      <template #cell(start)="{ item }">
        <div class="newslist-item text-center">{{ item.start | formatDateTime(dateFormat) }}</div>
      </template>
      <template #cell(end)="{ item }">
        <div class="newslist-item text-center">{{ item.end | formatDateTime(dateFormat) }}</div>
      </template>
      <template #cell(action)="{ item }">
        <div class="d-flex justify-content-end">
          <base-button width="180px" variants="contained" color="info" @click="onDelete(item)">
            {{ $t('role_management.delete') }}
          </base-button>
        </div>
      </template>
    </base-table>
    <modal-remove-news :current-id="currentId" @on-refresh="onRefresh" />
  </div>
</template>

<script>
import { MODAL } from '@/resources/modal';
import { DATE_FORMAT } from '@/config/constant';

export default {
  components: {
    BaseTable: () => import('~/components/desktop/commons/tables/index.vue'),
    ModalRemoveNews: () => import('~/components/desktop/admin/news/modal-remove.vue'),
    BaseButton: () => import('~/components/common/base-button/index.vue')
  },
  props: {
    items: {
      type: Array,
      default: () => []
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      fields: [
        {
          key: 'content',
          label: this.$t('news.content'),
          subLabel: '',
          sortField: '',
          isSort: false,
          align: 'left',
          thStyle: {
            width: '386px'
          }
        },
        {
          key: 'start',
          label: this.$t('news.start_date'),
          subLabel: '',
          sortField: '',
          isSort: false,
          align: 'center',
          thStyle: {
            width: '24%'
          }
        },
        {
          key: 'end',
          label: this.$t('news.end_date'),
          subLabel: '',
          sortField: '',
          isSort: false,
          align: 'center',
          thStyle: {
            width: '24%'
          }
        },
        {
          key: 'action',
          label: this.$t('blacklist.table.action'),
          subLabel: '',
          sortField: '',
          isSort: false,
          align: 'right',
          thStyle: {
            width: '24%'
          }
        }
      ],
      currentId: '',
      dateFormat: DATE_FORMAT
    };
  },
  computed: {
    disabled () {
      return !this.items?.length;
    }
  },
  methods: {
    onDelete (item) {
      this.currentId = item.id
      this.$bvModal.show(MODAL.REMOVE_NEWS)
    },
    onRefresh () {
      this.$emit('get-list')
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/admin/news/table.scss" />
