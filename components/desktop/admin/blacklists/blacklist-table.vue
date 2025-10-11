<template>
  <div class="blacklist-table">
    <base-table
      :fields="fields"
      :items="items"
      :is-loading="isLoading"
      :disabled="disabled"
      @change-sort="$emit('change-sort', $event)"
      @row-clicked="$emit('row-clicked', $event)"
    >
      <template #cell(walletAddress)="{ item }">
        <div class="blacklist-item flex-row">
          <span class="blacklist-item__wallet-address">
            {{ item?.walletAddress }}
          </span>
        </div>
      </template>
      <template #cell(type)="{ item }">
        <div class="blacklist-item d-flex align-items-center justify-content-center">
          <span class="blacklist-item__icon" :class="getClassIconType(item)" />
          <span class="blacklist-item__text">{{ getTextType(item) }}</span>
        </div>
      </template>
      <template #cell(createdAt)="{ item }">
        <div class="blacklist-item text-center">{{ item.createdAt | formatDateTime }}</div>
      </template>
      <template #cell(action)="{ item }">
        <div class="d-flex justify-content-end">
          <base-button width="180px" variants="contained" color="info" @click="onDeleteWalletAddressBlackList(item)">
            {{ $t('role_management.delete') }}
          </base-button>
        </div>
      </template>
    </base-table>

    <div class="blacklist-table__pagination">
      <pagination
        v-if="total > limit"
        :total="total"
        :current-page="page"
        :per-page="limit"
        :note="$t('postings.pagination')"
        @handle-page="handleChangePagination"
      />
    </div>
    <modal-remove-black-list :current-id="currentId" @on-refresh="onRefreshBlackList" />
  </div>
</template>

<script>
import { BLACKLIST_TYPE } from '@/constants/blacklist';
import { MODAL } from '@/resources/modal';

export default {
  components: {
    BaseTable: () => import('~/components/desktop/commons/tables/index.vue'),
    ModalRemoveBlackList: () => import('~/components/desktop/admin/blacklists/modal-remove-blacklist.vue'),
    Pagination: () => import('~/components/common/pagination.vue'),
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
    },
    page: {
      type: Number,
      default: 1
    },
    total: {
      type: Number,
      default: 0
    },
    limit: {
      type: Number,
      default: 10
    }
  },
  data () {
    return {
      fields: [
        {
          key: 'walletAddress',
          label: this.$t('blacklist.table.wallet_address'),
          subLabel: '',
          sortField: '',
          isSort: false,
          align: 'left',
          thStyle: {
            width: '386px'
          }
        },
        {
          key: 'type',
          label: this.$t('blacklist.table.type'),
          subLabel: '',
          sortField: '',
          isSort: false,
          align: 'center',
          thStyle: {
            width: '24%'
          }
        },
        {
          key: 'createdAt',
          label: this.$t('blacklist.table.created_at'),
          subLabel: '',
          sortField: 'createdAt',
          isSort: true,
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
      currentId: ''
    };
  },
  computed: {
    disabled () {
      return !this.items?.length;
    }
  },
  methods: {
    getClassIconType (item) {
      return item.type === BLACKLIST_TYPE.MANUAL ? 'icon-logo' : 'icon-external'
    },
    getTextType (item) {
      return item.type === BLACKLIST_TYPE.MANUAL ? this.$t('blacklist.type.tooltip_manual') : this.$t('blacklist.type.tooltip_crawl')
    },
    handleChangePagination (page) {
      this.$emit('change-pagination', {
        page,
        limit: this.limit
      })
    },
    onDeleteWalletAddressBlackList (item) {
      this.currentId = item.id
      this.$bvModal.show(MODAL.REMOVE_BLACK_LIST)
    },
    onRefreshBlackList () {
      this.$emit('get-blacklists')
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/admin/blacklists/blacklist-table.scss" />
