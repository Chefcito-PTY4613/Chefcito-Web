<script setup lang="ts">

const {
  value='https://chefcito-web.vercel.app/',
  size = 128
} = defineProps<{
  value: string;
  size: number;
}>();

</script>
<template>
  <div>
    <QRCode class="rounded-md p-1 bg-slate-50" :value="value" :size="size"  foreground="#000000" background="#ffffff"></QRCode>
  </div>
</template>