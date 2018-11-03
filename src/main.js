// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import vueResource from 'vue-resource'
import BootstrapVue from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false;
Vue.use(vueResource);
Vue.use(BootstrapVue);

/* eslint-disable no-new */
import {Auction, Token} from './ABIS';

new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>',

  data: {
    url: "",
    web3Provider: null,
    contracts: {},
    account: null,
    balance: 0
  },

  methods: {
    init() {
      this.url = "https://ropsten.infura.io/";
      return this.initWeb3();
    },

    initWeb3() {
      web3.version.getNetwork((err, netId) => {
        switch (netId) {
          case "1":
            alert('This is mainnet, please switch to ropsten test network');
            break;
          case "2":
            alert('This is the deprecated Morden test network, please switch to ropsten test network');
            break;
          case "3":
            //In case "3" nothing to be done because that is identifier of the ropsten
            break;
          case "4":
            alert('This is the Rinkeby test network, please switch to ropsten test network');
            break;
          case "42":
            alert('This is the Kovan test network, please switch to ropsten test network');
            break;
          default:
            alert('This is an unknown network, please switch to ropsten test network');
        }
      });
      return this.initContract();
    },
    initContract() {
      this.contracts.Token = web3.eth.contract(Token).at("0x5351490ea69bc1c82132098d5aa70655e7852272");
      this.contracts.Auction = web3.eth.contract(Auction).at("0xe5f878775249a8189b2e13df7c4b6391e31af512");
      this.displayAccountInfo();
      // this.reloadArticles();
      // App.listenToEvents();

      return true;
    },
    displayAccountInfo() {

      let accounts = new Promise((resolve, reject) => {
        web3.eth.getAccounts((error, result) => {
            if (error) {
              reject(error)
            } else {
              resolve(result)
            }
          }
        )
      });
      accounts.then(accounts => {
        if (accounts.length) {
          this.contracts.Token.balanceOf.call(accounts, (err, balance) => {

            if (err === null) {
              this.account = accounts[0];
              this.balance = balance;
            }
          });
        }
      })
    },
  }
});
