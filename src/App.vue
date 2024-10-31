<template>
  <div id="app" class="background-gif">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
.background-gif {
  background-image: url('@/assets/Beach1.gif'); /* Remplace 'ton-fichier.gif' par le nom de ton fichier */
  background-size: cover; /* Ajuste pour couvrir l'écran */
  background-repeat: no-repeat;
  background-position: center;
  height: 100vh; /* Hauteur de l'écran */
  width: 100vw;
  overflow: hidden;
}
</style>
