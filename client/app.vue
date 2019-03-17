<template>
  <div id="app" class="flex-view">
    <div v-if="!isAuthConnected" class="flex-extensible-fixed global-auth">
      <p>
        No connected. Trying to reach the server...
      </p>
      <p v-show="isAuthLoading">
        <i class="loading" />
      </p>
    </div>

    <template v-else>
      <nav id="nav" class="flex-fixed">
        <div class="text-center mt-2">
          <h3>Quoridor</h3>
          <RouterLink to="/" class="btn btn-primary">
            New game
          </RouterLink>
        </div>

        <br>
        <ul class="menu without-bg">
          <li class="divider text-center" data-content="Current games" />
          <li v-for="game in currentGames" :key="game.slug + 2" class="menu-item">
            <RouterLink :to="{ name: 'game', params: { gameSlug: game.slug } }">
              {{ game.player1 }} vs {{ game.player2 }}
            </RouterLink>
            <small class="menu-badge mr-2">
              <mark>{{ game.date }}</mark>
            </small>
          </li>
        </ul>

        <br>
        <ul class="menu without-bg">
          <li class="divider text-center" data-content="Last games" />
          <li v-for="game in lastGames" :key="game.slug + 2" class="menu-item">
            <RouterLink :to="{ name: 'game', params: { gameSlug: game.slug } }">
              {{ game.player1 }} vs {{ game.player2 }}
            </RouterLink>
            <small class="menu-badge mr-2">
              <mark>{{ game.date }}</mark>
            </small>
          </li>
        </ul>
      </nav>

      <router-view class="flex-extensible-fixed" />
    </template>
  </div>
</template>

<script>
const { mapGetters } = require('vuex')

module.exports = {
  name: 'home',

  computed: {
    ...mapGetters([
      'isAuthLoading',
      'isAuthConnected',
      'currentGames',
      'lastGames'
    ])
  }
}
</script>

<style lang="scss">
@import "styles/main.scss";

#nav {
  width: 12rem;
  background: $sidebar-color;
}

.global-auth {
  text-align: center;
  font-size: 1rem;
  padding-top: 30%;
}
</style>
