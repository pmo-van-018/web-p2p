import { ethers } from 'ethers'
import TronWeb from 'tronweb';
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters('resources', ['networkConfigs'])
  },
  methods: {
    $_providerFactory_getProvider (chain) {
      const provider = {
        Polygon: new ethers.providers.JsonRpcProvider(
          this.networkConfigs.Polygon.rpc[0]
        ),
        BSC: new ethers.providers.JsonRpcProvider(
          this.networkConfigs.BSC.rpc[0]
        ),
        KDONG: new ethers.providers.JsonRpcProvider(
          this.networkConfigs.KDONG.rpc[0]
        ),
        Tron: new TronWeb({
          fullHost: this.networkConfigs.Tron.rpc[0],
          solidityNode: this.networkConfigs.Tron.rpc[0]
        })
      }[chain];
      return provider;
    }
  }
}
