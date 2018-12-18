<template>
  <Game />
</template>


<script>
import Game from '@/components/Game'
export default {
  name: 'App',
  components: { Game }
}
</script>


<style lang="scss">
body {
  height: 100vh;
  display: flex;
  justify-content: center;
  margin: 0;
  padding: 0;
}
</style>
