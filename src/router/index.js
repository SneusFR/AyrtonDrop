import { createRouter, createWebHistory } from 'vue-router';
import MainMenu from '../views/MainMenu.vue'; // Import de la vue de test
import dropView from '../views/drop.vue'; // Import de la vue de test

const routes = [
  {
    path: '/',
    name: 'Home',
    component: MainMenu,
  },
  {
    path: '/drop', // Définition de l'URL /test
    name: 'drop',
    component: dropView,
    props: true, // Active les props pour que selectedPack soit passé correctement

  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
