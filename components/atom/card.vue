<script setup lang="ts">
const {
  title
} = withDefaults (defineProps<{
  title:string;
}>(),{
  title: ''
})
</script>

<template>
  <article
    :class="`min-w-[250px] mx-2 my-4 rounded overflow-hidden shadow-md border-2 border-inherit shadow-gray-700 dark:shadow-gray-200 px-4 py-2 ${$attrs.class ?? ''}`"
  >
  <h2 v-if="title" class="font-bold text-xl mb-2">{{ title }}</h2>
    <slot />
  </article>
</template>
