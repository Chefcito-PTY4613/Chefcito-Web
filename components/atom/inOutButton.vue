<script setup>
const userStore = useUserStore();

const logged = computed(() => !(userStore.getUser.name === undefined));

const logOut = () => {
  userStore.del();
  
  navigateTo("/login");
};
const logIn = () => {
  navigateTo("/login");
};
</script>
<template>
  <button class="flex items-center justify-center bg-accent px-2 py-1 ml-2" @click="logged ? logOut() : logIn()">
    🚪
  </button>
</template>
