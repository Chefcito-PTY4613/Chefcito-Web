<script setup>
useHead({ title: "User" });
</script>
<template>
  
  <UiTabs default-value="list" class="max-w-full w-[800px]">
    <UiTabsList class="gap-1.5">
      <UiTabsTrigger value="list"> Trabajadores</UiTabsTrigger>
      <UiTabsTrigger value="listCli"> Clientes </UiTabsTrigger>
      <UiTabsTrigger value="create"> Crear Trabajador </UiTabsTrigger>
    </UiTabsList>

    <UiTabsContent value="list">
      <MoleculeWorkersList></MoleculeWorkersList>
    </UiTabsContent>
    <UiTabsContent value="listCli">
      <MoleculeUsersList></MoleculeUsersList>
    </UiTabsContent>
    <UiTabsContent value="create" class="flex flex-col items-center">
      <MoleculeWorkersCreate></MoleculeWorkersCreate>
    </UiTabsContent>
    <UiSeparator></UiSeparator>
  </UiTabs>
</template>
