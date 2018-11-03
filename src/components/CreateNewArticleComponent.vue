<template>
  <section>
    <div>
      <!-- Modal Component -->
      <b-modal id="modal1" :no-close-on-esc="true" :no-close-on-backdrop="true" :hide-header-close="true" @ok="okButton"
               @cancel="cancelButton" ref="showModal" title="Before getting started..">
        <p class="my-4" style="color: #510b23">This page is used to inform visitors regarding my policies with the
          collection, use, and disclosure of Personal Information if anyone decided to use my Service. <br/>
          If you choose to use my Service, then you agree to the collection and use of information in relation to this
          policy. The Personal Information that I collect is used for providing and improving the Service. I will not
          use or share your information with anyone except as described in this Privacy Policy.<br/>
          Before creating a new article you should approve withdrawing 10 MTT`s. You need to have MetaMask installed to
          send them.<br/>
          The terms used in this Privacy Policy have the same meanings as in our Terms and Conditions, which is
          accessible at Auction unless otherwise defined in this Privacy Policy.<br/></p>
      </b-modal>
    </div>

    <div class="selling-form">
      <b-form @submit="sellArticle">
        <label><b>Enter article name:</b></label>
        <b-form-input type="text" v-model="articleName" required
                      placeholder="Article`s name"></b-form-input>

        <label><b>Enter minimal bet (in MTT):</b></label>
        <b-form-input type="number" v-model="currentBet" required placeholder="5"
                      pattern="[0-9]+([\.,][0-9]+)?" step="1">
        </b-form-input>

        <label><b>Enter buy it now price (in MTT):</b></label>
        <b-form-input type="number" v-model="buyItNowPrice" required placeholder=" 100"
                      pattern="[0-9]+([\.,][0-9]+)?" step="1">
        </b-form-input>

        <label><b>Give an informative description:</b></label>
        <b-form-textarea
          v-model="description" placeholder="Description" required maxlength="125"
          :rows="3" :max-rows="6">
        </b-form-textarea>

        <label><b>Set the time when will the auction end:</b></label>
        <b-form-input type="text" pattern="[0-9]*:[0-5][0-9]" v-model="time" required
                      placeholder="10:10"></b-form-input>

        <b-row slot="modal-footer" align-h="end" style="margin: 0">
          <b-btn size="m" class="submit-button" type="submit">Submit</b-btn>
        </b-row>
      </b-form>
    </div>
  </section>
</template>

<script>

  export default {
    name: "CreateNewArticleComponent",
    data() {
      return {
        url: this.$root.url,
        web3Provider: this.$root.web3Provider,
        contracts: this.$root.contracts,
        account: this.$root.account,
        balance: this.$root.balance,
        seller: null,
        articleName: null,
        description: null,
        currentBet: null,
        betByBuyer: null,
        buyItNowPrice: null,
        time: null,
        loading: null,
        isAvailable: null,
        valueForApproval: null,
        toMTTdecimals: 10 ** 18,
        approveForSellingWasMade: false,
      }
    },
    methods: {
      showModal() {
        this.$refs.myModalRef.show()
      },
      hideModal() {
        this.$refs.myModalRef.hide()
      },
      okButton() {
        let tx = {
          from: this.account,
          to: this.contracts.Token.address,
          value: 0x0,
          gas: 300000,
          gasPrice: web3.toWei(2, "gwei"),
          data: this.contracts.Token.approve.getData(this.contracts.Auction.address, 10 * this.toMTTdecimals)
        };
        web3.eth.sendTransaction(tx, (err, res) => {
          if (res) {
            console.log("Everything went good with approval");
            this.approveForSellingWasMade = true;
            console.log(res);
          }
          else {
            console.error(err);
          }
        });
      },
      cancelButton() {
        this.$router.go(-1);
      },
      sellArticle() {
        this.seller = web3.eth.accounts[0];

        let indexOfSC = this.time.indexOf(":");

        let hours = +this.time.slice(0, indexOfSC);
        let minutes = +this.time.slice(indexOfSC + 1);
        let seconds = hours * 3600 + minutes * 60;

        let betAtTheMoment = +this.currentBet * this.toMTTdecimals;
        let thePriceOfImmediateBuying = +this.buyItNowPrice * this.toMTTdecimals;

        if ((this.articleName.trim() === '') || (+this.currentBet === 0) || (+this.buyItNowPrice === 0) || (seconds === 0)) {
          // nothing to sell
          return false;
        }

        let tx = {
          from: web3.eth.account,
          to: this.contracts.Auction.address,
          value: 0x0,
          gas: 3000000,
          gasPrice: web3.toWei(2, "gwei"),
          data: this.contracts.Auction.createArticle.getData(this.articleName, betAtTheMoment, thePriceOfImmediateBuying, this.description, seconds)
        };

        web3.eth.sendTransaction(tx, (err, res) => {
          if (res) {
            console.log("Everything went good with creating article");
            console.log(res);
            // this.approveForSellingWasMade = false;
          }
          else {
            console.error("There can be some mistakes");
          }
        });
      },
      cancelArticle() {

        let tx = {
          from: this.account,
          to: this.contracts.Auction.address,
          value: 0x0,
          gas: 300000,
          gasPrice: web3.toWei(2, "gwei"),
          data: this.contracts.Auction.cancel.getData()
        };
        web3.eth.sendTransaction(tx, function (err, res) {
          if (res) {
            console.log("Everything went good with canceling");
            console.log(res);
          }
          else {
            console.error("There can be some mistakes with cancelling the article");
          }
        });
      },

    },
    mounted() {
      // this.reloadArticles();
      setTimeout(() => {
        this.$refs.showModal.show();
      }, 1000);
    }
  }
</script>

<style scoped>

  body {
    padding-bottom: 120px;
  }

  .selling-form {
    /*float: left;*/
    background-color: #510b23;;
    margin: 50px auto;
    padding: 25px;
    text-align: left;
    max-width: 500px;
    border: 1px solid #510b23;
    border-radius: 10px;
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  }

  footer {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
  }

  .submit-button {
    background-color: #FF1A6A;
    margin-top: 5px;
    color: white;
    border: none;
    width: 100px;
  }

</style>
