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
  <header class="fixed h-10 h-header bg-background flex w-full items-center justify-center drop-shadow-[0_0_2px_hsl(var(--foreground))]">
    <div class="w-full max-w-[1000px] flex justify-between items-center relative px-2 py-0">
      <nav class="flex">
        <nuxt-link to="/">Home</nuxt-link>

        <nuxt-link v-for="rt in links" key="rt" :to="rt.path">
          {{ rt.icon }}
          {{ rt.name }}
        </nuxt-link>
      </nav>
      <div class="flex">
        <AtomThemeButton></AtomThemeButton>
        <AtomInOutButton></AtomInOutButton>
      </div>
    </div>
  </header>
</template>
 