<template>
  <div class="scale-page">
  <div>
    <!-- Affichage de la question actuelle -->
    <div class="header-image">
      <p class="question-text">{{ currentQuestion.question || 'Aucune question disponible' }}</p>
    </div>

    <!-- Affichage du chronomètre -->
    <div class="timer">
      <p>Temps restant : {{ formatTime(remainingTime) }}</p>
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
      <div class="tokens">
        <img
          v-for="(token, index) in availableTokens"
          :key="index"
          :src="require('@/assets/money.png')"
          alt="Jeton"
          class="token-image"
        />
      </div>
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
    };
  },
  mounted() {
    if (!this.selectedPack) {
      this.$router.push({ name: 'Home' });
    } else {
      this.startTimer();
    }
  },
  methods: {
    formatTime(seconds) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
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

      this.rectangles.forEach((rectangle, index) => {
        if (index === correctAnswerIndex) {
          for (let i = 0; i < rectangle.count; i++) {
            const token = this.tokens.find(token => token.placed);
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

.tokens-container {
  position: absolute;
  top: 235px;
  width: 100%;
  text-align: center;
}

.tokens {
  display: flex;
  justify-content: center;
  gap: 5px;
  flex-wrap: wrap;
}

.token-image {
  width: 30px;
  height: 30px;

}

.timer {
  font-family: 'SDGlitch', sans-serif;
  position: absolute;
  top: 200px;
  width: 100%;
  text-align: center;
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
</style>
