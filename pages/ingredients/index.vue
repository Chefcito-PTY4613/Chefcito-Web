<script setup></script>
<template>
  <UiTabs default-value="ingredient" class="max-w-full w-[800px]">
    <UiTabsList class="gap-1.5">
      <UiTabsTrigger value="ingredient"> Ingredientes</UiTabsTrigger>
      <!--<UiTabsTrigger value="food"> Comidas </UiTabsTrigger>-->
    </UiTabsList>

    <UiTabsContent value="ingredient">
      <MoleculeIngredientList></MoleculeIngredientList>
    </UiTabsContent>
    <!--
      <UiTabsContent value="food">
        <MoleculeUsersList></MoleculeUsersList>
      </UiTabsContent>
    -->
    <UiSeparator></UiSeparator>
  </UiTabs>
</template>
