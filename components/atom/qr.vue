<script setup lang="ts">

const {
  value='https://example.com',
  size = 128,
} = defineProps<{
  value: string;
  size: number;
}>();

</script>
<template>
  <div>
    <QRCode class="rounded-md" :value="value" :size="size" foreground="#ffffff" background="#000000"></QRCode>
  </div>
</template>