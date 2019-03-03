<template>
  <div id="app" class="flex-view">
    <nav id="nav" class="flex-fixed">
      <div class="text-center mt-2">
        <h3>Quoridor</h3>
        <RouterLink to="/" class="btn btn-primary">
          New game
        </RouterLink>
      </div>

      <br>
      <ul class="menu without-bg">
        <li class="divider text-center" data-content="Last games" />
        <li v-for="game in lastGames" :key="game.uuid + 2" class="menu-item">
          <RouterLink :to="{ name: 'viewer', params: { uuid: game.uuid } }">
            {{ game.name }}
          </RouterLink>
          <small class="menu-badge mr-2">
            <mark>{{ game.date }}</mark>
          </small>
        </li>
      </ul>
    </nav>

    <router-view class="flex-extensible-fixed" />
  </div>
</template>

<script>
export default {
  name: 'home',

  computed: {
    lastGames () {
      return [
        { uuid: '2019-03-19-11-21-43588-HH-kajvbzz', name: '🧑 vs 🧑', date: '11:21' },
        { uuid: '2019-03-19-11-20-43588-HR-kajvbzz', name: '🧑 vs 🤖', date: '11:20' },
        { uuid: '2019-03-19-11-19-43588-RH-kajvbzz', name: '🤖 vs 🧑', date: '11:19' },
        { uuid: '2019-03-19-11-18-43588-RR-kajvbzz', name: '🤖 vs 🤖', date: '11:18' },
        { uuid: '2019-03-19-11-17-43588-RR-kajvbzz', name: '🤖 vs 🤖', date: '11:17' },
        { uuid: '2019-03-19-11-16-43588-RR-kajvbzz', name: '🤖 vs 🤖', date: '11:16' },
        { uuid: '2019-03-19-11-15-43588-RR-kajvbzz', name: '🤖 vs 🤖', date: '11:15' }
      ]
    }
  }
}
</script>

<style lang="scss">
@import "styles/main.scss";

#nav {
  width: 12rem;
  background: $sidebar-color;

}
</style>
