<template>
  <div class="main-menu">
    <h1 class="title">Ayrton drop</h1>


    <!-- Formulaire pour entrer le pseudo -->
    <form @submit.prevent="startGame">
      <label for="pseudo">Pseudo :</label>
      <input
        type="text"
        id="pseudo"
        v-model="pseudo"
        placeholder="Entrez votre pseudo"
      />
    </form>

    

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
          { question: "Quelle particule subatomique a été découverte par J.J. Thomson en 1897 ?", answers: ["Proton", "Neutron", "Électron", "Quark"], correctAnswer: 2 },
          { question: "Quel est le nom complet de l'équation de Schrödinger ?", answers: ["Équation des ondes", "Équation de Schrödinger-Dirac", "Équation d'onde de Schrödinger", "Équation de probabilité de Schrödinger"], correctAnswer: 2 },
          { question: "En quelle année Constantinople est-elle tombée ?", answers: ["1423", "1453", "1492", "1501"], correctAnswer: 1 },
          { question: "Quel est le premier élément synthétisé en laboratoire ?", answers: ["Technétium", "Uranium", "Plutonium", "Radium"], correctAnswer: 0 },
          { question: "Quelle est la distance moyenne de la Terre au Soleil en millions de kilomètres ?", answers: ["93", "149", "227", "384"], correctAnswer: 1 },
          { question: "Qui est l'auteur du 'Prince' ?", answers: ["Platon", "Nicolas Machiavel", "Thomas More", "Hobbes"], correctAnswer: 1 },
          { question: "Quel pays détient la plus grande réserve prouvée de pétrole ?", answers: ["États-Unis", "Russie", "Venezuela", "Arabie Saoudite"], correctAnswer: 2 },
          { question: "Quelle est la plus petite étoile de type connu ?", answers: ["Naine blanche", "Naine rouge", "Pulsar", "Trou noir"], correctAnswer: 1 },
          { question: "Quel est le plus ancien texte connu de mathématiques ?", answers: ["Tablettes d'Uruk", "Papyrus de Rhind", "Tablettes de Plimpton 322", "Papyrus d'Ahmès"], correctAnswer: 3 },
          ]
        },
        {
          questions: [
          { question: "Quel est le plus ancien texte connu de mathématiques ?", answers: ["Tablettes d'Uruk", "Papyrus de Rhind", "Tablettes de Plimpton 322", "Papyrus d'Ahmès"], correctAnswer: 3 },
          { question: "Dans quel océan se trouve la fosse des Mariannes ?", answers: ["Atlantique", "Pacifique", "Indien", "Arctique"], correctAnswer: 1 },
          { question: "Quel philosophe grec a enseigné Alexandre le Grand ?", answers: ["Platon", "Socrate", "Aristote", "Pythagore"], correctAnswer: 2 },
          { question: "Quel est le nom du premier satellite artificiel lancé par l'URSS en 1957 ?", answers: ["Soyouz", "Saliout", "Mir", "Spoutnik"], correctAnswer: 3 },
          { question: "Quelle est la formule chimique de l'acide sulfurique ?", answers: ["H2SO4", "HCl", "HNO3", "CH3COOH"], correctAnswer: 0 },
          { question: "Dans quelle ville se trouve le CERN ?", answers: ["Zurich", "Genève", "Berne", "Lausanne"], correctAnswer: 1 },
          { question: "Quel scientifique a proposé la théorie de l'évolution par sélection naturelle ?", answers: ["Gregor Mendel", "Jean-Baptiste Lamarck", "Alfred Russel Wallace", "Charles Darwin"], correctAnswer: 3 },
          { question: "Quel est le nom de la couche la plus externe du Soleil ?", answers: ["Photosphère", "Chromosphère", "Couronne", "Noyau"], correctAnswer: 2 },
          ]
        }, {

        questions: [
        { question: "Dans quelle ville se trouve la bibliothèque d'Alexandrie ?", answers: ["Rome", "Athènes", "Le Caire", "Alexandrie"], correctAnswer: 3 },
        { question: "Quel mathématicien est connu pour son dernier théorème ?", answers: ["Euler", "Gauss", "Fermat", "Pythagore"], correctAnswer: 2 },
        { question: "Quel peintre a réalisé 'Les Demoiselles d'Avignon' ?", answers: ["Claude Monet", "Pablo Picasso", "Salvador Dalí", "Henri Matisse"], correctAnswer: 1 },
        { question: "Quelle est la hauteur de la Tour Eiffel en mètres ?", answers: ["324", "273", "200", "418"], correctAnswer: 0 },
        { question: "Quel fleuve est le plus long d'Amérique du Sud ?", answers: ["Amazonas", "Paraná", "Orénoque", "Rio de la Plata"], correctAnswer: 0 },
        { question: "Quel poète latin est l'auteur de l'Énéide ?", answers: ["Homère", "Ovide", "Virgile", "Plaute"], correctAnswer: 2 },
        { question: "Dans quel pays trouve-t-on le plus de pyramides ?", answers: ["Égypte", "Mexique", "Chine", "Soudan"], correctAnswer: 3 },
        { question: "Quel code est internationalement reconnu pour désigner une urgence médicale ?", answers: ["Code Bleu", "Code Rouge", "Code Jaune", "Code Noir"], correctAnswer: 0 }

        ]
      },
      ],
    };
  },
  methods: {
    selectPack(pack) {
      const packStore = usePackStore();
      packStore.setSelectedPack(pack);
      this.$router.push({ name: 'drop', params: { pseudo: this.pseudo } });
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
  left : 50px;
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

form {
  top : 250px;
}

input[type="text"] {
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 200px;
  margin-top: 10px;
}
</style>
