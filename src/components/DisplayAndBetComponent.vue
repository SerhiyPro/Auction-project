<template>
  <div>
    <div class="display-article">
      <b-row align-h="center"><img class="clipboard" src="../img/clipboard.svg"/></b-row>
      <h2 class="auction-title">{{info.name}}</h2>
      <strong>Description: </strong>
      <br/>
      <span>{{info.descr}}</span>
      <br/>
      <strong>Cuurent bet: </strong>
      <span>{{+info.bet / toMTTdecimals}} MTT</span>
      <br/>
      <strong>Buy it now price: </strong>
      <span>{{+info.buyItNow / toMTTdecimals}} MTT</span>
      <br/>
      <strong>Sold by: </strong>
      <span class="article-seller">{{info.theOneWhoSells}}</span>
      <br/>
      <form style="margin-top: 10px">
        <strong>Enter the value for approval: </strong>
        <input type="number" class="form-control" ref="betValue" placeholder="your bet" v-model="betByBuyer"
               pattern="[0-9]+([\.,][0-9]+)?" step="1">
      </form>
      <div style="margin-top: 10px" v-if="+info.bet">
        <b-btn :hidden="info.theOneWhoSells === $root.account" class="btn-app-bet"
               @click="makeApprovalForBetting">Make approval
        </b-btn>
        <b-btn :hidden="info.theOneWhoSells === $root.account" class="btn-app-bet"
               @click="makeBet">Make a bet
        </b-btn>
        <b-btn :hidden="info.theOneWhoSells === $root.account" @click="buyImmediately"
               class="btn-buy-immediately">Buy immediately
        </b-btn>
        <b-btn
          :hidden="!(info.theOneWhoSells === $root.account || (timeIsUp && $root.account === info.theLastBetter))"
          class="btn-buy-immediately btn-end-auction" @click="endAuction">End Auction
        </b-btn>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      isLoad: {
        type: Boolean,
        default: false
      }
    },
    name: "DisplayAndBetComponent",
    data() {
      return {
        seller: null,
        toMTTdecimals: 10 ** 18,
        betByBuyer: null,
        timeIsUp: false,
        info: {
          name: '',
          descr: '',
          bet: 0,
          buyItNow: 0,
          theOneWhoSells: '',
          theLastBetter: ''
        }
      }
    },
    watch: {
      isLoad() {
        if (this.isLoad) {
          this.reloadArticles();
        }
      }
    },
    methods: {
      reloadArticles() {
        if (!this.seller && this.$root.contracts.Auction) {
          this.$root.contracts.Auction.seller.call((err, sellersAderss) => {
            this.seller = sellersAderss;
            this.$root.contracts.Auction.getArticle.call((err, args) => {
                this.info.name = args[0];
                this.info.descr = args[1];
                this.info.bet = args[2];
                this.info.buyItNow = args[3];
                this.info.theLastBetter = args[4];
                this.info.theOneWhoSells = sellersAderss;
              }
            );
          });
        } else {
          console.warn('waiting for conctracts initialization');
        }
      },
      makeApprovalForBetting() {

        let tx = {
          from: this.$root.account,
          to: this.$root.contracts.Token.address,
          value: 0x0,
          gas: 300000,
          gasPrice: web3.toWei(2, "gwei"),
          data: this.$root.contracts.Token.approve.getData(this.$root.contracts.Auction.address, this.betByBuyer * this.toMTTdecimals)
        };
        web3.eth.sendTransaction(tx, function (err, res) {
          if (res) {
            console.log("Everything went good with approval for betting");
            console.log(res);
          }
          else {
            console.error("There can be some mistakes");
          }
        });
      },
      makeBet() {
        if (this.betByBuyer <= 0)
          return;

        let tx = {
          from: this.$root.account,
          to: this.$root.contracts.Auction.address,
          value: 0x0,
          gas: 300000,
          gasPrice: web3.toWei(2, "gwei"),
          data: this.$root.contracts.Auction.betting.getData(this.betByBuyer * this.toMTTdecimals)
        };
        web3.eth.sendTransaction(tx, function (err, res) {
          if (res) {
            console.log("Everything went good with making a bet");
            console.log(res);
          }
          else {
            console.error("There can be some mistakes with bet");
          }
        });
      },
      buyImmediately() {
        if (this.betByBuyer >= this.info.buyItNow) {
          return;
        }
        let tx = {
          from: this.account,
          to: this.$root.contracts.Auction.address,
          value: 0x0,
          gas: 300000,
          gasPrice: web3.toWei(2, "gwei"),
          data: this.$root.contracts.Auction.sellArticleImmediately.getData()
        };
        web3.eth.sendTransaction(tx, function (err, res) {
          if (res) {
            console.log("Everything went good with buying immediately");
            console.log(res);
          }
          else {
            console.error("There can be some mistakes with buying immediately");
          }
        });
      },
      endAuction() {
        let tx = {
          from: web3.eth.account,
          to: this.$root.contracts.Auction.address,
          value: 0x0,
          gas: 3000000,
          gasPrice: web3.toWei(2, "gwei"),
          data: this.$root.contracts.Auction.sellArticle.getData()
        };

        web3.eth.sendTransaction(tx, function (err, res) {
          if (res) {
            console.log(res);
          }
          else {
            console.log("There can be some mistakes");
          }
        });
      },
      enableButton() {
        let myVar;

        myVar = setInterval(() => {
          this.$root.contracts.Auction.endGame.call((err, timeOfTheAuction) => {
            console.log(Math.floor(Date.now() / 1000) - timeOfTheAuction.toNumber());
            if ((Math.floor(Date.now() / 1000) > timeOfTheAuction.toNumber()) && (timeOfTheAuction.toNumber() !== 0)) {
              this.timeIsUp = true;
              clearInterval(myVar);
            }
          });
        }, 5000);
      }
    },
    created() {
      this.enableButton();
    },
    mounted() {
      this.reloadArticles();
    }
  }
</script>

<style scoped>
  .display-article {
    background-color: #510b23;
    text-align: left;
    padding: 25px;
    display: inline-block;
    height: 510px;
    margin: 5rem;
    position: relative;
    width: 600px;
    border-radius: 10px;
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  }

  .clipboard {
    width: 150px;
    height: 150px;
    margin: 0 auto;
  }

  .auction-title {
    text-transform: capitalize;
    text-align: center;
    padding: 5px;
  }

  .btn-buy-immediately {
    float: right;
    background-color: #FF1A6A;
    border: none;
  }

  .btn-buy-immediately:hover {
    color: #510b23;
  }

  .btn-app-bet {
    background-color: #FF669C;
    border: none;
  }

  .btn-app-bet:hover {
    color: #510b23;
  }

  .btn-end-auction {
    margin-right: 4px;
  }
</style>
