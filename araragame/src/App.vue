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

#game-container{
  display: flex;
  justify-content: center;
  flex-direction: column;
}

canvas {
  height: 100vw * 3/4 !important;
  max-height: 100vh;
  width: 100vh * 4/3 !important;
  max-width: 100vw;
}
</style>
