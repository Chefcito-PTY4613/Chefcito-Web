<script setup>
useHead({ title: "Home" });
const autores = [
  { name: "Gary", link: "https://www.instagram.com/dread._.9/" },
  { name: "Cristobal", link: "https://www.instagram.com/_baal.__/" },
  { name: "Raquel", link: "https://www.instagram.com/raq_racoon/" },
  { name: "Ratapan", link: "https://www.instagram.com/ratapics/" },
];
</script>
<template>
  <section class="h-full w-full max-w-[800px] flex flex-col justify-between">
    <h1 class="text-3xl">Buenos días y bienvenido a Chefcito trabajadores</h1>
    <br />
    <main class="flex-grow">
      <MoleculeImageSlider></MoleculeImageSlider>
    </main>
    <br />
    <footer class="text-center">
      Hecho con ❤️ por
      <span v-for="(autor, i) in autores" :key="i">
        <a
          :href="autor.link"
          target="_blank"
          class="text-purple-500"
          :alt="`autor-${autor.name}`"
        >
          {{ `${autor.name}` }} </a
        >{{
          `${
            autores.length - 1 !== i
              ? autores.length - 2 !== i
                ? ", "
                : " y "
              : ""
          }`
        }}
      </span>
    </footer>
  </section>
</template>
