import { createRouter, createWebHistory } from 'vue-router';
import MainMenu from '../views/MainMenu.vue'; // Import de la vue de test
import dropView from '../views/drop.vue'; // Import de la vue de test
import ShopView from '../views/shop.vue'; // Import de la vue de test


const routes = [
  {
    path: '/',
    name: 'Home',
    component: MainMenu,
  },
  {
    path: '/drop/:pseudo', // Définition de l'URL /test
    name: 'drop',
    component: dropView,
    props: true, // Active les props pour que selectedPack soit passé correctement

  },

  {
    path: '/shop', // Définition de la route pour la boutique
    name: 'Shop',
    component: ShopView,
  },

];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
