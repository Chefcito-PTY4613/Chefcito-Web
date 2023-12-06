<script>
export default {
  beforeCreate() {
    this.showHideSpinner = true;
  },
  mounted() {
    this.showHideSpinner = false;
  },
  data() {
    return {
      showHideSpinner: true
    };
  }
};
</script>
<template>
  <div class="layout">
      <AtomLoader v-if="showHideSpinner" />
      <main class="grow flex justify-center pt-10 pb-8 mt-10 min-h-[calc(100%_-_40px)] w-full max-w-[100%] mb-0 mx-0 px-2">
        <!-- Output page -->
        <slot />
      </main>
      <!-- NavBar -->
      <MoleculeNavBar></MoleculeNavBar>
    </div>
  </template>
  