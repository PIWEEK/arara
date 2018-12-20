import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false
Vue.config.app = process.env

new Vue({
  render: h => h(App)
}).$mount('#app')
