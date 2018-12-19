import Vue from 'vue'
import App from './App.vue'

import GameController from '@/recorder/GameController.js'

var controller = new GameController()

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
