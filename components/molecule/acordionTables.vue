<script setup lang="ts">
const {
  tableId = "",
  tableNum = 0,
  tablePersons = 0,
  tableTime = '',
} = defineProps<{
  tableId: string;
  tableNum: number;
  tablePersons: number;
  tableTime: string;
}>();


onMounted(()=>{

})
</script>
<template>
  <UiAccordion  type="single" collapsible >
    <UiAccordionItem  value="item-1">
      <UiAccordionTrigger class="bg-secondary px-4">
        <div class="text-left">
          <div>Mesa {{ tableNum }} de {{ tablePersons }} personas</div>
          <div class="text-sm">
            Usada desde las {{ tableTime }}
          </div>
        </div>
      </UiAccordionTrigger>
      <UiAccordionContent class="px-4">
        <slot/>
      </UiAccordionContent>
    </UiAccordionItem>
  </UiAccordion>
</template>
