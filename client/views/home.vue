<template>
  <div>
    <div :class="{ loading }" class="new-game loading-opacity loading-lg">
      <h3>NEW GAME</h3>

      <div v-show="loading" class="timer">
        <b>{{ message[type] || message['online'] }} {{ timer }}</b>
      </div>

      <a @click="create('local')">
        Local multiplayers
        <small>Your friend doesn't have a PC, play both on this one.</small>
      </a>
      <a @click="create('online')">
        Online multiplayers
        <small>Let's play with a random guy from the Internet.</small>
      </a>
      <a @click="create('human-bot')">
        Me vs 🤖 bot
        <small>You want to challenge the machine learning?</small>
      </a>
      <a @click="create('bot-bot')">
        🤖 bot vs itself
        <small>Why don't we watch the experts play with each other?</small>
      </a>
    </div>
  </div>
</template>

<script>
const { mapActions } = require('vuex')

module.exports = {
  name: 'home',

  data () {
    return {
      loading: false,
      timerInterval: null,
      timerValue: 0,
      type: 'online',
      message: {
        'local': 'Looking for money for your friend...',
        'online': 'Looking for your ideal life partner...',
        'human-bot': 'Looking for a robot you can beat...',
        'bot-bot': 'Soon available on Netflix...'
      }
    }
  },

  computed: {
    timer () {
      const minutes = Math.floor(this.timerValue / 60)
      const seconds = this.timerValue % 60
      return minutes + ':' + (seconds < 10 ? '0' : '') + seconds
    }
  },

  destroyed () {
    if (this.timerInterval) {
      clearInterval(this.timerInterval)
      this.timerInterval = null
    }
  },

  methods: {
    ...mapActions([
      'newGame'
    ]),
    create (type) {
      this.type = type
      this.loading = true
      this.timerValue = 0
      this.timerInterval = setInterval(() => {
        this.timerValue += 1
      }, 1000)
      setTimeout(() => {
        this.newGame({ type })
      }, 3000)
    }
  }
}
</script>

<style lang="scss">
@import "../styles/variables.scss";

.new-game {
  text-align: center;
  background: white;
  border-radius: 0.3rem;
  box-shadow: 0.2rem 0.2rem $dark-color;
  padding: 2rem 0 0;
  max-width: 20rem;
  margin: 10% auto;
  position: relative;

  h3 {
    margin-bottom: 2rem;
  }

  a {
    display: block;
    padding: 1rem;
    text-align: center;
    cursor: pointer;
    background: #f7f5f5;
    border-top: .05rem dashed #d8d8d8;
    color: $dark-color;
    font-size: 0.9rem;

    small {
      font-size: 60%;
      display: block;
    }

    &:last-child {
      border-radius: 0 0 .3rem .3rem;
    }

    &:hover,
    &:active,
    &:focus {
      font-weight: bold;
      text-decoration: none;
      background: #ecebeb;
    }
  }

  .timer {
    position: absolute;
    opacity: .9;
    top: 60%;
    left: 0;
    right: 0;
    z-index: 1;

    b {
      background: #2d3436;
      border-radius: 0.3rem;
      padding: 0.1rem 0.5rem;
      color: white;
      font-weight: normal;
    }
  }
}
</style>
