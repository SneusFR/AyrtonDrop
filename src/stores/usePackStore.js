import { defineStore } from 'pinia';

export const usePackStore = defineStore('packStore', {
  state: () => ({
    selectedPack: null,
  }),
  actions: {
    setSelectedPack(pack) {
      this.selectedPack = pack;
    },
    clearSelectedPack() {
      this.selectedPack = null;
    },
  },
});
