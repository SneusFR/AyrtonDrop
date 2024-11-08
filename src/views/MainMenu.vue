<template>
  <div class="main-menu">
    <img src="@/assets/AyrtonDrop.png" alt="Ayrton Drop" class="title-image" />


    <!-- Formulaire pour entrer le pseudo -->
    <form @submit.prevent="startGame">
      <label for="pseudo"></label>
      <input
        type="text"
        id="pseudo"
        v-model="pseudo"
        placeholder="Entrez votre pseudo"
      />
      <button @click="goToShop" class="shop-button">Aller au Shop</button>

    </form>

    
    <div v-if="selectedPack" class="password-prompt">
  <label for="password">Mot de passe pour ce pack :</label>
  <input
    type="password"
    id="password"
    v-model="enteredPassword"
    placeholder="Entrez le mot de passe"
  />
  <button @click="validatePassword">Valider</button>
  <p v-if="passwordError" class="error">Mot de passe incorrect</p>
</div>

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
  @click="promptPassword(pack)"
>
        
          <h3>Pack de question AYRTON DROP {{ index + 1 }}</h3>
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
      selectedPack: null,
      enteredPassword: '',
      passwordError: false,
      showPacks: false,
      packs: [
        {
          password: "GrosPorc",
          questions: [
            { question: "Où est né Ronaldinho ?", answers: ["São Paulo", "Rio de Janeiro", "Porto Alegre", "Brasilia"], correctAnswer: 2 },
            { question: "D'après Mevko, Emmop est le petit frère de ?", answers: ["Hitler", "De Bruyne", "Un gars qu'il connait", "Johnny Bravo"], correctAnswer: 1 },
            { question: "Quel pirate légendaire aurait enterré un trésor qu’on n'a jamais retrouvé sur l'île d'Oak Island ?", answers: ["William Kidd", "Bartholomew Roberts", "Henry Morgan", "Edward Teach"], correctAnswer: 0 },
            { question: "Combien de livres Alain Soral a-t-il écrits ?", answers: ["8", "17", "21", "23"], correctAnswer: 1 },
            { question: "Combien d'Unpopular Opinions Kamat a-t-il posté au sein du channel dédié ?", answers: ["38", "51", "23", "68"], correctAnswer: 0 },
            { question: "Quelle était la note du rap de Kamat sur le Touchy Subject de SNEUS ?", answers: ["2.22", "2.19", "2.20", "2.10"], correctAnswer: 1 },
            { question: "Quel est le nom de l'île où Adona est retenue captive dans l'Empire des Femmes 2 ?", answers: ["Sapientia", "Teneros", "Elysia", "Arcadia"], correctAnswer: 1 },
            { question: "Qui est le doubleur actuel de Scooby-Doo en version française ?", answers: ["Mathias Kozlowski", "Éric Missoffe", "Laurent Larcher", "Patrick Poivey"], correctAnswer: 1 }
          ]
        },
        {
          password : "Fofana",
          questions: [
            { question: "Quelle est la valeur marchande de Malick Fofana ?", answers: ["1M", "5M", "10M", "15M"], correctAnswer: 3 },
            { question: "Quelle danse Fortnite Antoine Griezmann a-t-il réalisée en finale de CDM ?", answers: ["Electro Shuffle", "Take the L", "Orange Justice", "Floss"], correctAnswer: 1 },
            { question: "Quel rappeur existe vraiment ?", answers: ["Sopranal", "Payday", "Nekcouille", "CacaGangz"], correctAnswer: 0 },
            { question: "Passe-moi le cro-mi, que j’me serve de ma tête comme le but de ?", answers: ["Eric Cantona", "Manuel Amoros", "Basile Boli", "Jean Pierre Papin"], correctAnswer: 2 },
            { question: "Quel langage de script Frostbite utilise-t-il pour la création de comportements dans les jeux FIFA ?", answers: ["Ruby", "Python", "Java", "C++"], correctAnswer: 0 },
            { question: "Combien de followers possède actuellement Claude sur Instagram ?", answers: ["565k", "670k", "350k", "850k"], correctAnswer: 0 },
            { question: "Parmi les animaux suivants, lequel a le plus petit pénis en proportion de sa taille ?", answers: ["La musaraigne étrusque", "Le colibri", "Le coléoptère", "La chauve-souris pipistrelle"], correctAnswer: 2 },
            { question: "Que signifie le mot latin 'cacare' ?", answers: ["faire caca", "gargariser", "alléger", "subtiliser"], correctAnswer: 0 }
          ]
        },
        {
          password : "BostonRobGigi",
          questions: [
            { question: "Quelle porte, située dans une ville européenne, est souvent appelée 'la porte du soleil' ?", answers: ["La Porte de Brandebourg à Berlin", "La Porte du Soleil à Madrid", "La Porte de l'Orient à Istanbul", "La Porte de l'Alcazar à Séville"], correctAnswer: 1 },
            { question: "Quelle est l'actrice principale de la série Buffy contre les vampires ?", answers: ["Sarah Michelle Gellar", "Alyson Hannigan", "Eliza Dushku", "Buffy du discord"], correctAnswer: 0 },
            { question: "Dans quelle ville est né Boston Rob ?", answers: ["New York", "Los Angeles", "Tampa", "Hyde Park"], correctAnswer: 3 },
            { question: "Quel gaz est principalement responsable de l'odeur des flatulences ?", answers: ["Méthane", "Dioxyde de carbone", "Sulfure d'hydrogène", "Azote"], correctAnswer: 2 },
            { question: "Combien de fois le Nword a été posté sur le discord Ayrton ?", answers: ["26", "109", "155", "263"], correctAnswer: 1 },
            { question: "Dans quel tome apparaît pour la première fois Negan ? ", answers: ["12", "14", "17", "18"], correctAnswer: 2 },
            { question: "Quel auteur latin est à l'origine de la célèbre locution 'Carpe Diem' ?", answers: ["Cicéron", "Virgile", "Sénèque", "Horace"], correctAnswer: 3 },
            { question: "Dans le roman Les Trois Mousquetaires d'Alexandre Dumas, deux des mousquetaires se nomment Athos et Porthos. Comment s'appelle le troisième mousquetaire ?", answers: ["Aramis", "D'Artagnan", "Planchet", "Richelieu"], correctAnswer: 0 }
          ]
        },
        {
          password : "Rachel",
          questions: [
            { question: "De qui vient le t-shirt 'Ah batard tu fumes ?!'", answers: ["Arouf Gangsta", "Stromae", "Kalash Criminel", "Lacrim"], correctAnswer: 3 },
            { question: "Quel élément est associé aux signes de la Vierge, du Taureau et du Capricorne ?", answers: ["Air", "Feu", "Terre", "Eau"], correctAnswer: 2 },
            { question: "Quel est le nom de famille de Joelle de Koh-Lanta Palau ?", answers: ["Bernard", "Bourlier", "Boutin", "Cartaux"], correctAnswer: 1 },
            { question: "Dans Unity, quel type de lumière projette des ombres en temps réel et simule le soleil ?", answers: ["Point Light", "Spot Light", "Directional Light", "Area Light"], correctAnswer: 2 },
            { question: "Lequel de ces noms de personnages de Breaking Bad n'existe pas dans les versions étrangères ?", answers: ["Walter Blanco", "Gustavo Pizza", "José Miguel Rosas", "Saúl Bueno"], correctAnswer: 1 },
            { question: "Dans le film Détour mortel, quel est le nom de la famille de cannibales ?", answers: ["Les Odets", "Les Hilliker", "Les Sawyer", " Les Pessi"], correctAnswer: 2 },
            { question: "Quelle est la traduction italienne la plus appropriée pour la phrase ci-dessus ?", answers: ["È mancato poco.", "È stato per un pelo.", "Ha quasi fallito.", "È stato un soffio"], correctAnswer: 1 },
            { question: "Qui a produit le film 'Zone d'intérêt' ?", answers: ["Focus Features", "Focus Academy", "Film4 Productions", "Sony Pictures"], correctAnswer: 2 }
          ]
        },
        {
          password : "Titeuf",
          questions: [
            { question: "Merci Titeuf pour :", answers: ["Cette belle balade", "La pipe", "Les 5 subs", "Ce merveilleux voyage"], correctAnswer: 3 },
            { question: "Quelle était la première photo de profil du compte Kl.leaks ?", answers: ["ALJ", "Denis Brogniart", "Julien Magne", "Cocktail"], correctAnswer: 0 },
            { question: "Quelle taille faisait le plus gros caca jamais découvert ?", answers: ["20cm", "10cm", "55cm", "68cm"], correctAnswer: 0 },
            { question: "Quel est l'alcool le plus fort du monde ?", answers: ["Cocoroco", "Spirytus Rektyfikowany", "Everclear", "Bruichladdich X4 Quadrupled Whiskey"], correctAnswer: 0 },
            { question: "En quelle année Patrick Sabatier a-t-il animé N'oubliez pas les paroles ?", answers: ["2007", "2008", "2009", "2010"], correctAnswer: 1 },
            { question: "Dans quelle ville est né Ponce le streamer ?", answers: ["Nîmes", "Orange", "Avignon", "Carpentras"], correctAnswer: 2 },
            { question: "Qui est le nain le plus petit ?", answers: ["Verne Troyer", "Peter Dinklage", "Mimi Mathy", "Warwick Davis"], correctAnswer: 0 },
            { question: "Quelle est la profondeur de la fosse des Mariannes, le point océanique le plus profond connu sur Terre ?", answers: ["8 848 mètres", "10 994 mètres", "11 034 mètres", "12 011 mètres"], correctAnswer: 2 }
          ]
        }
      ]
    };
  },
  methods: {
    selectPack(pack) {
      const packStore = usePackStore();
      packStore.setSelectedPack(pack);
      this.$router.push({ name: 'drop', params: { pseudo: this.pseudo } });
    },
    promptPassword(pack) {
    this.selectedPack = pack;
    this.enteredPassword = '';
    this.passwordError = false;
  },

  goToShop() {
    this.$router.push('/shop');
  },


  validatePassword() {
  if (this.enteredPassword === this.selectedPack.password) {
    const packStore = usePackStore();
    packStore.setSelectedPack(this.selectedPack);
    this.$router.push({ name: 'drop', params: { pseudo: this.pseudo } });
  } else {
    this.passwordError = true;
  }
}

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
  left : 50px;
}

.play-button {
  width: 100px;
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
  top : 420px;
  margin-right:  10px;
}

input[type="text"] {
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 200px;
  margin-top: 10px;
}

.password-prompt {
  margin-top: 1rem;
  text-align: center;
}

.error {
  color: red;
  font-size: 0.9rem;
}

.shop-button {
  padding: 10px 20px;
  font-size: 1.2rem;
  background-color: #00ff99;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: transform 0.3s ease;
  margin-left: 10px;
}

.shop-button:hover {
  transform: scale(1.1);
}

.title-image {
  width: 300px; /* Ajuste la largeur selon tes besoins */
}

</style>
