<template>
  <div>

    <div>
      <img src="../img/auction.svg">
    </div>
    <div>
      <h2>Welcome to the auction</h2>
      <p class="central-text">
        That is blockchain based site which works with MTT tokens. Here you can create your own new articles for sale,
        or buy
        something by betting.
      </p>
    </div>
    <div class="buttons">
      <router-link role="button" to="/createNewArticle" class="btn create-new-auction">Create new Auction</router-link>
      <router-link to="displayArticle" role="button" class="btn participation-in-auction">Participate in Auction
      </router-link>
    </div>

  </div>
</template>

<script>
  export default {
    name: "TitlePage"
  }
</script>

<style scoped>


  img {
    height: 300px;
    width: 300px;
    padding-top: 85px;
  }

  .central-text {
    width: 500px;
    text-align: center;
    margin: auto;
  }

  .buttons {
    padding-top: 20px;
  }

  .create-new-auction {
    background-color: #FF669C;
    color: white;
  }

  .participation-in-auction {
    background-color: #FF1A6A;
    color: white;
  }

  .btn:hover {
    background-color: #510b23;
  }
</style>
