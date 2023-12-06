<script setup lang="ts">
import { MyRoutes } from "~/lib/types";
const userStore = useUserStore();
const myRoutes = useMyRoutes();

const user = computed(() => userStore.getUser);
const links = ref([] as MyRoutes[]);
const header = ref(null);
const headerSize = ref(800);

onUpdated(() => {
  if (header.value) {
    const clientWidth = header.value.clientWidth;
    headerSize.value = clientWidth;
  }
});

onMounted(() => {
  if (Object.keys(user.value).length > 5) {
    const userType =
      user.value == null || user.value == undefined
        ? null
        : user.value.userType?.name;

    if (userType !== null) links.value = myRoutes.getMyRoutes(userType);
  }

  window.addEventListener("resize", () => {
    if (header.value) {
      const clientWidth = header.value.clientWidth;
      headerSize.value = clientWidth;
    }
  });
});
watch(user, () => {
  if (Object.keys(user.value).length > 5) {
    const userType =
      user.value == null || user.value == undefined
        ? null
        : user.value.userType?.name;
    if (userType !== null) links.value = myRoutes.getMyRoutes(userType);
  }else{
    links.value = [];
  }
});
</script>
<template>
  <header
    ref="header"
    class="fixed z-50 h-10 h-header bg-background flex w-full items-center justify-center drop-shadow-[0_0_2px_hsl(var(--foreground))] "
  >
    <div
      class="w-full max-w-[1000px] flex justify-between items-center relative px-2 py-0 "
    >
      <nav class="flex">
        <nuxt-link to="/" :class="headerSize > 800 ? '' : 'mr-4'"
          >Home</nuxt-link
        >
        <nuxt-link
          v-for="rt in links"
          :class="headerSize > 800 ? '' : 'mr-4'"
          key="rt"
          :to="rt.path"
        >
          {{ rt.icon }}
          {{ headerSize > 800 ? rt.name : "" }}
        </nuxt-link>
      </nav>
      <div class="flex">
        <AtomThemeButton></AtomThemeButton>
        <AtomInOutButton></AtomInOutButton>
      </div>
    </div>
  </header>
</template>
