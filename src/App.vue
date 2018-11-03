<template>
  <div id="app">
    <header>
      <router-link to="/">
        <div class="float-left"><h1>Logo</h1></div>
      </router-link>
      <h2 v-if="+this.$root.balance" class="float-right balance">MTT: {{(+this.$root.balance/10**18).toFixed(2)}}</h2>
    </header>
    <div class="main-wrapper">
      <router-view :is-load="isLoad"/>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'App',
    data() {
      return {
        isLoad: false
      }
    },
    mounted() {
      this.isLoad = this.$root.init();
    }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    /*color: #2c3e50;*/
    min-height: 100%;
    display: grid;
    grid-template-rows: auto 1fr auto;
    grid-template-columns: 100%;
    color: white;
  }

  html, body {
    width: 100%;
    height: 100%;
  }

  header {
    background-color: #510b23;
    height: 60px;
    padding: 5px 50px 0 50px;
  }

  .balance {
    padding-top: 5px;
  }

  .main-wrapper {
    padding: 0;
    margin: 0;
    /*left: 0;*/

    width: 100%;
    height: 100%;
    background-image: linear-gradient(to bottom right, #7F0D35, #CC1555);
  }

</style>
