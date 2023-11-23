<script setup>

const colorMode = useColorMode();
const initialColor = colorMode.preference
const color = ref(`${initialColor}`);

const change = () => {
  const newVal = colorMode.preference == "dark" ? "light" : "dark";
  colorMode.preference = newVal;
  color.value = newVal;
};

</script>
<template>
  <button class="flex items-center justify-center bg-accent px-2 py-1" @click="change">

    <span v-if="color === 'light'">
      ☀️
    </span>
    <span
      v-else
    >
      🌔
    </span>
    
  </button>
</template>
