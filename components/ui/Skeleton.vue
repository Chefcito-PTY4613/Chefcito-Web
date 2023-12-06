<script setup lang="ts">
const {
  repite
} = withDefaults (defineProps<{
  repite:number;
}>(),{
  repite: 0
})

</script>

<template>
  <div  v-for="n in repite" :key="n" :class="`animate-pulse rounded-md bg-secondary ${$attrs.class}`" />
</template>
