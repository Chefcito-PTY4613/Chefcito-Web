<script setup lang="ts" >
type variant = 'default' | 'destructive';
const {variant,title,body,hide} = defineProps<{
  variant: variant;
  title: string;
  body: string;
  hide: Boolean;
}>();

const autoHide = ref(true);

watch(hide,() => {
  console.log('propValue has changed:', hide);
});
</script>

<template>
  {{ hide }}
  <UiAlert v-if="autoHide" :variant="variant" class="absolute -top-20 sm:right-2 right-0 max-w-full w-[500px] transition-transform translate-y-24 delay-75">
    <UiAlertTitle>{{title}}</UiAlertTitle>
    <UiAlertDescription>
     {{body}}
    </UiAlertDescription>
  </UiAlert>
</template>
