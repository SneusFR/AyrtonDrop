<template>
  <div class="main-menu">
    <h1 class="title">Ayrton drop</h1>

    <!-- Bouton Jouer avec une image et un effet de zoom au survol -->
    <div class="play-button-container">
      <img 
        src="@/assets/play.png" 
        alt="Jouer" 
        class="play-button"
        @click="showPacks = !showPacks" 
      />
    </div>

    <!-- Sélection de pack de questions avec un style de niveau de jeu -->
    <div v-if="showPacks" class="packs-selection">
      <h2 class="packs-title">Choisissez un pack de questions :</h2>
      <div class="packs-list">
        <div 
          v-for="(pack, index) in packs" 
          :key="index" 
          class="pack-card"
          @click="selectPack(pack)"
        >
          <h3>Pack de question TEST {{ index + 1 }}</h3>
          <p>Questions: {{ pack.questions.length }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { usePackStore } from '@/stores/usePackStore';

export default {
  name: 'MainMenu',
  data() {
    return {
      showPacks: false,
      packs: [
        {
          questions: [
            { question: "Comment s'appelle Sneus irl ?", answers: ["Alex", "Valentin", "Julien", "Marc"], correctAnswer: 1 },
            { question: "Quel est le langage principal utilisé dans Vue.js ?", answers: ["JavaScript", "Python", "Ruby", "PHP"], correctAnswer: 0 },
            { question: "Combien de planètes gravitent autour du Soleil ?", answers: ["5", "7", "8", "9"], correctAnswer: 0 },
            { question: "Quelle est la capitale de l'Italie ?", answers: ["Paris", "Madrid", "Rome", "Berlin"], correctAnswer: 2 },
            { question: "Quel est l'élément chimique avec le symbole O ?", answers: ["Oxygène", "Hydrogène", "Carbone", "Azote"], correctAnswer: 0 },
            { question: "En quelle année a eu lieu la première guerre mondiale ?", answers: ["1914", "1920", "1939", "1945"], correctAnswer: 0 },
            { question: "Quel est le plus grand océan du monde ?", answers: ["Atlantique", "Pacifique", "Indien", "Arctique"], correctAnswer: 1 },
            { question: "Qui a peint la Joconde ?", answers: ["Vincent Van Gogh", "Claude Monet", "Léonard de Vinci", "Pablo Picasso"], correctAnswer: 2 }

          ]
        },
        {
          questions: [
            { question: "Quelle est la capitale de la France ?", answers: ["Berlin", "Londres", "Madrid", "Paris"], correctAnswer: 3 },
            { question: "Quelle est la couleur du ciel par temps clair ?", answers: ["Rouge", "Bleu", "Vert", "Jaune"], correctAnswer: 1 },
          ]
        },
      ],
    };
  },
  methods: {
    selectPack(pack) {
      const packStore = usePackStore();
      packStore.setSelectedPack(pack);
      this.$router.push({ name: 'drop' });
    },
  },
};
</script>

<style scoped>
.main-menu {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-image: url('@/assets/background.gif');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  color: #fff;
  text-align: center;
}

.title {
  font-size: 3rem;
  margin-bottom: 2rem;
  font-family: 'Arial', sans-serif;
}

.play-button-container {
  margin: 20px 0;
}

.play-button {
  width: 300px;
  transition: transform 0.3s ease;
  cursor: pointer;
}

.play-button:hover {
  transform: scale(1.2);
}

.packs-selection {
  margin-top: 2rem;
  width: 80%;
}

.packs-title {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.packs-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.pack-card {
  width: 150px;
  padding: 15px;
  background: linear-gradient(145deg, #282843, #1e1e2f);
  border-radius: 10px;
  color: #fff;
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.2), -4px -4px 10px rgba(255, 255, 255, 0.1);
}

.pack-card:hover {
  transform: translateY(-10px);
  box-shadow: 6px 6px 15px rgba(0, 0, 0, 0.3), -6px -6px 15px rgba(255, 255, 255, 0.15);
}

.pack-card h3 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #00ff99;
}

.pack-card p {
  font-size: 0.9rem;
  color: #cccccc;
}
</style>
