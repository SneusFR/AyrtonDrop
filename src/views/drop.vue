<template>
  <div class="scale-page">
  <div>

    <div class="level-container">
      <img v-if="equippedSkinImage" :src="equippedSkinImage" alt="Skin équipé" class="equipped-skin-image" />
      <div class="pseudo-display" v-if="pseudo">{{ pseudo }}</div>
      <div class="level-display">Niveau : {{ currentLevel }}</div>
      <div class="progress-bar">
        <div class="progress" :style="{ width: levelProgress + '%' }"></div>
      </div>
    </div>
    <img src="@/assets/boussole.png" alt="Boussole" class="boussole-image" />

    <!-- Affichage de la question actuelle -->
    <div class="header-image">
      <p class="question-text">{{ currentQuestion.question || 'Aucune question disponible' }}</p>
    </div>



    <!-- Affichage du chronomètre -->
    <div class="timer">
      <p>{{ formatTime(remainingTime) }}</p>
    </div>

    <!-- Conteneur pour les rectangles avec les réponses -->
    <div class="d-flex justify-content-center align-items-center vh-100">
      <div
        v-for="(rectangle, index) in rectangles"
        :key="index"
        class="rectangle"
        :class="{ explosion: explodedIndexes.includes(index) }"
        @click="addToken(index)"
        @contextmenu.prevent="removeToken(index)"
      >
        <p class="answer-text">{{ currentAnswers[index] || '' }}</p>
        <p class="token-count">Jetons: {{ rectangle.count }}</p>
      </div>
    </div>

    <!-- Affichage des jetons disponibles sous forme d'images -->
    <div class="tokens-container">
      <p class='jetondisponible'>Jetons disponibles :</p>
  <!-- Conteneur pour l'image du portefeuille et les jetons -->
  <div class="wallet-container">
    <img src="@/assets/portefeuille.png" alt="Portefeuille" class="wallet-image" />

    <!-- Images des jetons dispersées sur le portefeuille -->
    <img
    v-for="(token, index) in availableTokens"
      :key="index"
      :src="require('@/assets/money.png')"
      alt="Jeton"
      class="token-image"
      :style="getTokenPosition()"
    />
  </div>
      <button class="reduce-timer-button" @click="reduceTimer">Valider</button>

    </div>

    <!-- Balises audio pour jouer les sons -->
    <audio ref="alertSound" :src="require('@/assets/moneydrop.mp3')" />
    <audio ref="suspenseSound" :src="require('@/assets/suspens.mp3')" />
    <audio ref="explosionSound" :src="require('@/assets/explosion.mp3')" />
    <audio ref="coinSound" :src="require('@/assets/coin.wav')" />
    <audio ref="coinSound2" :src="require('@/assets/punch.mp3')" />
    <audio ref="gagnantSound" :src="require('@/assets/gagnant.mp3')" />
    <audio ref="relaxSound" :src="require('@/assets/relax.mp3')" />
    <audio ref="perdantSound" :src="require('@/assets/perdant.mp3')" />


  </div>
  </div>
</template>

<script>
import { usePackStore } from '@/stores/usePackStore';

export default {
  name: 'dropView',
  computed: {

    pseudo() {
      return this.$route.params.pseudo || "GuestKL"; // Définit "GestKL" si aucun pseudo n'est passé
    },

    selectedPack() {
      const packStore = usePackStore();
      return packStore.selectedPack;
    },
    currentAnswers() {
      return this.currentQuestion.answers || [];
    },
    currentQuestion() {
      return this.selectedPack?.questions[this.currentQuestionIndex] || {};
    },
    availableTokens() {
      return this.tokens.filter(token => !token.placed);
    },
  },
  data() {
    return {
      tokens: Array.from({ length: 20 }, () => ({ placed: false })),
      rectangles: Array.from({ length: 4 }, () => ({ count: 0 })),
      remainingTime: 165,
      soundPlayed: false,
      suspensePlayed: false,
      explosionTriggered: false,
      gagnantPlayed: false,
      explodedIndexes: [],
      currentQuestionIndex: 0,
      lock: false,
      goodTokens: 0, // Compteur pour les jetons sur la bonne réponse
      badTokens: 0, // Compteur pour les jetons sur les mauvaises réponses
      currentLevel: 1, // Niveau initial
      levelProgress: 0, // Progression en pourcentage dans le niveau
      correctTokens: 0, // Nombre de jetons placés sur la bonne réponse
      equippedSkinImage: null // Image du skin équipé

    };
  },
  mounted() {
    if (!this.selectedPack) {
      this.$router.push({ name: 'Home' });
    } else {
      this.startTimer();
    }

      // Récupération du niveau et de la progression à partir de `localStorage`
  const savedLevel = localStorage.getItem('currentLevel');
  const savedProgress = localStorage.getItem('levelProgress');

  const equippedSkin = localStorage.getItem('equippedSkin'); // Initialiser equippedSkin ici

    if (equippedSkin) {
      const skinImages = {
        "Skin Légendaire": require('@/assets/level100.png'),
        "Skin Épique": require('@/assets/play.png'),
        "Skin Classique": require('@/assets/play.png'),
      };
      this.equippedSkinImage = skinImages[equippedSkin] || null;
    }

  if (savedLevel !== null) {
    this.currentLevel = parseInt(savedLevel, 10); // Convertit en nombre
  }
  if (savedProgress !== null) {
    this.levelProgress = parseFloat(savedProgress); // Convertit en nombre
  }

  },
  methods: {
    formatTime(seconds) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    },

    getTokenPosition() {
  const minX = 30; // Position minimum en pourcentage pour `left`
  const maxX = 60; // Position maximum en pourcentage pour `left`
  const minY = 35; // Position minimum en pourcentage pour `top`
  const maxY = 65; // Position maximum en pourcentage pour `top`

  const randomX = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
  const randomY = Math.floor(Math.random() * (maxY - minY + 1)) + minY;

  return {
    position: 'absolute',
    top: `${randomY}%`,
    left: `${randomX}%`,
  };
},

    reduceTimer() {
      this.lock = true;
      this.remainingTime = 3;
      console.log("Bouton Valider cliqué !");
  },
    playSound(audioRef) {
      if (audioRef) {
        audioRef.currentTime = 0;
        audioRef.play();
      } else {
        console.warn("Le fichier audio n'est pas disponible");
      }
    },
    triggerExplosionEffect() {
      const correctAnswerIndex = this.currentQuestion.correctAnswer;
      this.explodedIndexes = this.rectangles
        .map((_, index) => index)
        .filter(index => index !== correctAnswerIndex);
      
      setTimeout(() => {
        this.explodedIndexes = [];
      }, 15000); // Effet d'explosion d'une seconde
    },
    startTimer() {
      // Si un timer est déjà en cours, l'arrêter avant d'en démarrer un nouveau
      if (this.timer) {
        clearInterval(this.timer);
      }

      // Réinitialise tous les sons et états à zéro
      this.remainingTime = 165;
      this.soundPlayed = false;
      this.suspensePlayed = false;
      this.explosionTriggered = false;
      this.gagnantPlayed = false;
      this.relaxPlayed = false;
      this.explodedIndexes = [];
      this.lock = false;

      // Démarre le nouveau timer
      this.timer = setInterval(() => {
        if (this.remainingTime > 0) {
          this.remainingTime--;

          if (this.remainingTime === 164 && !this.soundPlayed) {
            this.playSound(this.$refs.relaxSound);
            this.relaxPlayed = true;
          }

          if (this.remainingTime === 45 && !this.soundPlayed) {
            this.playSound(this.$refs.alertSound);
            this.lock = true;
            this.soundPlayed = true;
          }

          if (this.remainingTime === 1 && !this.suspensePlayed) {
            this.remainingTime = 36;
            this.playSound(this.$refs.suspenseSound);
            this.suspensePlayed = true;
          }

          if (this.remainingTime === 0 && this.suspensePlayed && !this.explosionTriggered) {
            this.remainingTime = 15;
            console.log('Explosion !');
            this.playSound(this.$refs.explosionSound);
            this.triggerExplosionEffect();
            if (this.goodTokens > this.badTokens) {
              this.playSound(this.$refs.gagnantSound); // Joue le son gagnant
            } else {
              console.log('Perdu !');
              this.playSound(this.$refs.perdantSound); // Joue le son perdant
            }
            this.explosionTriggered = true;
            this.goodTokens = 0;
            this.badTokens = 0;
          }
        } else {
          clearInterval(this.timer);
          this.evaluateAnswers();
        }
      }, 1000);
    },
    addToken(index) {
      if (this.lock == false) {
      const element = document.querySelectorAll('.rectangle')[index];
      element.classList.add('shake');


      this.playSound(this.$refs.coinSound);

      setTimeout(() => {
        element.classList.remove('shake');
      }, 300);


      const tokenIndex = this.tokens.findIndex(token => !token.placed);
      if (tokenIndex !== -1) {
        this.rectangles[index].count += 1;
        this.tokens[tokenIndex].placed = true;
      }

      if (index === this.currentQuestion.correctAnswer) {
        this.goodTokens += 1;
      } else {
        this.badTokens += 1;
      }

    }},

    saveLevelData() {
      console.log('Sauvegarde du niveau et de la progression');
      localStorage.setItem('currentLevel', this.currentLevel);
      localStorage.setItem('levelProgress', this.levelProgress);
    },
    removeToken(index) {
      if (this.lock == false) {

      if (this.rectangles[index].count > 0) {
        this.playSound(this.$refs.coinSound2);
        this.rectangles[index].count -= 1;
        const tokenIndex = this.tokens.findIndex(token => token.placed);
        if (tokenIndex !== -1) {
          this.tokens[tokenIndex].placed = false;
        }
        if (index === this.currentQuestion.correctAnswer) {
        this.goodTokens -= 1;
      } else {
        this.badTokens -= 1;
      }
      }}
    },
    evaluateAnswers() {
      const correctAnswerIndex = this.currentQuestion.correctAnswer;

      this.rectangles.forEach((rectangle, index) => { // Parcours des rectangles
        if (index === correctAnswerIndex) { // Si le rectangle est la bonne réponse
          for (let i = 0; i < rectangle.count; i++) { // Parcours des jetons
            this.correctTokens += 1; // Incrémente le nombre de jetons corrects
            const token = this.tokens.find(token => token.placed); // Trouve un jeton placé
            if (token) token.placed = false; 
          }
        } else {
          for (let i = 0; i < rectangle.count; i++) {
            const token = this.tokens.find(token => token.placed);
            if (token) token.placed = true;
          }
        }
        rectangle.count = 0;
      });

      this.nextQuestion();
    },

    
    nextQuestion() {

            // Calcul des points pour les jetons placés dans la bonne réponse
      console.log('Nombre de jetons corrects :', this.correctTokens);
      // Ajoute des points à la progression de niveau
      this.levelProgress += this.correctTokens;
      this.correctTokens = 0; // Réinitialise le compteur de jetons corrects
      
      // Si la progression atteint 100%, on passe au niveau suivant
      if (this.levelProgress >= 100) {
        this.currentLevel += 1; // Incrémente le niveau
        this.levelProgress = this.levelProgress % 100; // Repart à zéro la progression
      }

      this.saveLevelData();


      if (this.currentQuestionIndex < this.selectedPack.questions.length - 1) {
        this.currentQuestionIndex += 1;
        this.startTimer(); // Démarre un nouveau timer pour la question suivante
      } else {
        console.log('Fin du jeu');
      }
    },
  },


};
</script>



<style scoped>
.rectangle {
  top : 25px;
  width: 650px; /* Largeur de l'image */
  height: 600px; /* Hauteur de l'image */
  margin: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  cursor: pointer;
  background-image: url('@/assets/arcade.png'); /* Image de fond */
  background-size: cover; /* Ajuste l'image de fond */
  background-position: center;
  position: relative;
  border: none; /* Supprime la bordure */
  transition: transform 0.5s, opacity 0.5s;
}


.rectangle.explosion {
  transform: scale(1.5);
  opacity: 0;
}

@font-face {
  font-family: 'SDGlitch';
  src: url('../fonts/SDGlitch_Demo.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}

.answer-text {
  font-family: 'SDGlitch', sans-serif;
  font-size: 30px;
  color: #00FF00; /* Vert style hacker */
  position: absolute;
  top: 250px; /* Positionne le texte à 10px du haut du rectangle */
  right : 10px;
  text-align: center;
  width: 100%; /* Prend toute la largeur pour un alignement centré */
}

.token-count {
  font-weight: bold;
  position: absolute;
  bottom: 25px; /* Positionne le texte en bas de l'image */
  color: white;
  text-align: center;
  width: 100%;
  font-size: 25px;
}


.tokens {
  display: flex;
  justify-content: center;
  gap: 5px;
  flex-wrap: wrap;
}


.tokens-container {
  position: relative;
  text-align: center;
  margin-top: -1050px; /* Ajuste cette valeur pour placer les jetons plus haut */
  right : 600px;

}

.wallet-container {
  position: relative;
  display: inline-block;
}

.wallet-image {
  width: 400px; /* Ajustez la taille selon vos besoins */
  height: auto;
}

.token-image {
  width: 30px;
  height: 30px;
}

.timer {
  position: absolute;
  top: 190px;
  left: 83.8%; /* Utilise un pourcentage pour rester dans la page */
  transform: translateX(-50%); /* Centrage horizontal */
  font-family: 'SDGlitch', sans-serif;
  font-size: 35px;
  font-weight: bold;
}

.question-container {
  position: absolute;
  top: 150px;
  width: 100%;
  text-align: center;
  font-size: 24px;
  font-weight: bold;
}



.header-image {
  width: 40%;
  left : 30%;
  height: 200px; /* Hauteur de l'image d'en-tête */
  background-image: url('@/assets/wooden.png'); /* Image de fond */
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.scale-page {
  zoom: 0.86; /* Réduit le zoom à 75% */

}

.question-text {
  font-family: 'SDGlitch', sans-serif;
  position: absolute;
  top: 100px;
  color: white;
  font-size: 35px;
  font-weight: bold;
  text-align: center;
}

@keyframes shake {
  0% { transform: translate(0px, 0px); }
  25% { transform: translate(3px, 0px); }
  50% { transform: translate(-3px, 0px); }
  75% { transform: translate(3px, 0px); }
  100% { transform: translate(0px, 0px); }
}

.shake {
  animation: shake 0.3s ease; /* Applique l'animation de tremblement */
}

.jetondisponible {
  font-family: 'SDGlitch', sans-serif;
  font-size: 30px;
  color: white; /* Vert style hacker */
  top: 10px; /* Positionne le texte à 10px du haut du rectangle */
  right : 10px;
  text-align: center;
  width: 100%; /* Prend toute la largeur pour un alignement centré */
}

.reduce-timer-button {
  background-color: #cccccc; /* Couleur verte moderne */
  border: none;
  color: rgb(60, 173, 16);
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease, transform 0.2s ease;
  left : 50px;
}

.reduce-timer-button:hover {
  background-color: rgb(43, 226, 55); /* Changement de couleur au survol */
  transform: scale(0.95); /* Effet de clic */

}

.reduce-timer-button:active {
  transform: scale(0.95); /* Effet de clic */
}

.level-container {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.level-display {
  font-family: 'SDGlitch', sans-serif;
  font-size: 28px;
  color: #333;
  font-weight: bold;
}

.progress-bar {
  width: 200px;
  height: 20px;
  background-color: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
}

.progress {
  height: 100%;
  background-color: #007bff;
  transition: width 0.3s ease;
}

.pseudo-display {
  font-family: 'SDGlitch', sans-serif;
  font-size: 28px;
  color: #ffffff;
  margin-right: 15px; /* Séparation avec le niveau */
  font-weight: bold;

}

.equipped-skin-image {
  width: 40px;
  height: 40px;
  margin-right: 10px;
}

.boussole-image {
  position : absolute;
  width: 400px; /* Ajuste la taille de l'image selon tes besoins */
  height: auto;
  left : 1300px;
}

</style>
