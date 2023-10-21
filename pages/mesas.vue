<script setup>
useHead({ title: "Mesas" });
import { transforDate,transforDateTime } from "@/lib/utils.rata";

const config = useRuntimeConfig();

const { data } = useFetch(`${config.public.backEnd}table`);


</script>
<template>
  <div class="grid grid-cols-3 md:grid-cols-4 gap-8">
    <article class="flex flex-col rounded-md  p-2" 
    :class="mesa.active?'bg-secondary text-secondary-foreground':'bg-muted text-muted-foreground'"
    v-for="mesa in data" :key="mesa._id">
      <h2>Mesa {{ mesa.num }}</h2>
      <h2>{{ mesa.size }} personas</h2>
      <br>
      <AtomQr :value="JSON.stringify({ table: mesa._id })" :size="150"></AtomQr>
      <br />
      <p v-if="!mesa.active" class="text-center text-xs">
        Usado desde las {{ transforDateTime(mesa.updatedAt) }}
        <p v-if="!mesa.active" class="text-center text-xs">
        Del dia {{ transforDate(mesa.updatedAt) }}

      </p>
      </p>
    </article>
  </div>
</template>
