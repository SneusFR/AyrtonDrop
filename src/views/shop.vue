<template>
    <div class="shop-container">
      <p class="shop-subtitle">
      </p>  
      <div class="skin-carousel">
        <div
          v-for="(skin, index) in skins"
          :key="index"
          class="skin-card"
          :class="{ selected: selectedSkin === skin }"
          @click="selectSkin(skin)"
        >
          <img :src="skin.image" :alt="skin.name" class="skin-image" />
          <h3 class="skin-name">{{ skin.name }}</h3>
          <p class="skin-price">Niveau requis: {{ skin.requiredLevel }}</p>
          <p class="skin-price">Prix: {{ skin.price }} Coins</p>
        </div>
      </div>
  
      <div v-if="selectedSkin" class="skin-details">
        <img :src="selectedSkin.image" :alt="selectedSkin.name" class="skin-details-image" />
        <p>{{ selectedSkin.description }}</p>
        <p class="skin-price">Niveau requis: {{ selectedSkin.requiredLevel }}</p>
        <p class="skin-price">Prix: {{ selectedSkin.price }} Coins</p>
        
        <!-- Bouton dynamique pour acheter ou équiper -->
        <button 
          class="purchase-button" 
          @click="selectedSkin.unlocked ? equipSkin() : purchaseSkin()" 
          :class="{ equipped: selectedSkin.unlocked && equippedSkin === selectedSkin.name }"
          :disabled="!canAfford && !selectedSkin.unlocked"
        >
          {{ selectedSkin.unlocked 
            ? (equippedSkin === selectedSkin.name ? 'Équipé' : 'Équiper') 
            : 'Débloquer' 
          }}
        </button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ShopView',
    data() {
      return {
        userLevel: parseInt(localStorage.getItem('currentLevel')) || 1, // Niveau actuel de l'utilisateur
        selectedSkin: null, // Skin actuellement sélectionné
        equippedSkin: localStorage.getItem('equippedSkin') || null, // Skin actuellement équipé
        skins: [
          {
            name: "Skin Légendaire",
            price: 200,
            requiredLevel: 100,
            description: "Un skin pour les vrais Ayrtonien",
            image: require('@/assets/level100.png'),
            unlocked: JSON.parse(localStorage.getItem('Skin Légendaire')) || false,
          },
          {
            name: "Skin Épique",
            price: 150,
            requiredLevel: 5,
            description: "Un skin épique pour impressionner vos amis.",
            image: require('@/assets/play.png'),
            unlocked: JSON.parse(localStorage.getItem('Skin Épique')) || false,
          },
          {
            name: "Skin Classique",
            price: 0,
            requiredLevel: 1,
            description: "Un skin classique gratuit pour tous les joueurs.",
            image: require('@/assets/play.png'),
            unlocked: true, // Toujours débloqué par défaut
          },
        ],
      };
    },
    computed: {
      canAfford() {
        return (
          this.userLevel >= (this.selectedSkin ? this.selectedSkin.requiredLevel : 1) &&
          !this.selectedSkin.unlocked
        );
      },
    },
    methods: {
      selectSkin(skin) {
        this.selectedSkin = skin;
      },
      purchaseSkin() {
        if (this.canAfford) {
          this.selectedSkin.unlocked = true;
          localStorage.setItem(this.selectedSkin.name, JSON.stringify(true));
  
          // Met à jour la liste des skins achetés
          const purchasedSkins = JSON.parse(localStorage.getItem('purchasedSkins')) || [];
          if (!purchasedSkins.includes(this.selectedSkin.name)) {
            purchasedSkins.push(this.selectedSkin.name);
            localStorage.setItem('purchasedSkins', JSON.stringify(purchasedSkins));
          }
  
          alert(`Vous avez débloqué le ${this.selectedSkin.name}!`);
        } else {
          alert("Vous n'avez pas le niveau requis pour débloquer ce skin.");
        }
      },
      equipSkin() {
        if (this.selectedSkin.unlocked) {
          // Sauvegarde le skin équipé dans le localStorage
          localStorage.setItem('equippedSkin', this.selectedSkin.name);
          this.equippedSkin = this.selectedSkin.name;
          alert(`${this.selectedSkin.name} est maintenant équipé !`);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .shop-container {
    width: 100vw;
    min-height: 100vh; /* Utilise min-height au lieu de height */
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 20px;
    color: #333;
    font-family: 'Arial', sans-serif;
    background: linear-gradient(145deg, #ffffff, #3b90b1);
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
  }
    
    .shop-title {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
      color: #007bff;
    }
  
    
    
    .shop-subtitle {
      font-size: 1.2rem;
      color: #555;
      margin-bottom: 2rem;
    }
    
    .skin-carousel {
      display: flex;
      justify-content: center;
      gap: 15px;
      padding: 20px 0;
    }
    
    .skin-card {
      width: 150px;
      padding: 10px;
      background: linear-gradient(145deg, #ffffff, #ececec);
      border-radius: 10px;
      transition: transform 0.3s, box-shadow 0.3s;
      cursor: pointer;
      text-align: center;
    }
    
    .skin-card.selected {
      transform: scale(1.1);
      box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.4);
    }
    
    .skin-image {
      width: 30%;
      height: auto;
      border-radius: 8px;
    }
    
    .skin-name {
      font-size: 1.1rem;
      color: #444;
      margin-top: 10px;
    }
    
    .skin-price {
      font-size: 1rem;
      color: #777;
    }
    
    .skin-details {
      margin-top: 30px;
      text-align: center;
    }
    
    .skin-details-image {
      width: 200px;
      height: auto;
      margin-top: 10px;
    }
    
    .purchase-button {
      background-color: #4caf50;
      color: white;
      padding: 10px 20px;
      font-size: 1rem;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.3s ease;
      margin-top: 15px;
    }
    
    .purchase-button:hover {
      background-color: #45a049;
    }
    
    .purchase-button:disabled {
      background-color: #ddd;
      color: #999;
      cursor: not-allowed;
    }
  
    /* Style pour le bouton équipé */
    .purchase-button.equipped {
      background-color: #007bff;
      cursor: default;
    }
  
    .niveau-user{
      top : -100px;
      position: relative;
    }
  </style>
  