<script setup lang="ts">

const userStore = useUserStore();
const myRoutes = useMyRoutes();

const user = computed(()=> userStore.getUser);
const links = ref([]);



onMounted(() => { 
  if(Object.keys(user.value).length>5){
  const userType = user.value == null || user.value == undefined ? null : user.value.userType?.name;

  if (userType !== null) links.value = myRoutes.getMyRoutes(userType);}
});
watch(user,()=>{
  if(Object.keys(user.value).length>5){
  const userType = user.value == null || user.value == undefined ? null : user.value.userType?.name;
  if (userType !== null) links.value = myRoutes.getMyRoutes(userType);}
})
</script>
<template>
  <header class="header">
    <div class="header__container">
      <nav class="header__nav-bar">
        <nuxt-link to="/">Home</nuxt-link>
        <nuxt-link v-for="rt in links" key="rt" :to="rt.path">{{ rt.icon }}{{ rt.name }}</nuxt-link>
      </nav>
      <div class="header__nav-buttons">
        <AtomThemeButton></AtomThemeButton>
        <AtomInOutButton></AtomInOutButton>
      </div>
    </div>
  </header>
</template>
