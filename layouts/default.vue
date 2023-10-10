<template>
    <div class="layout">
      <MoleculeNavBar></MoleculeNavBar>
      <!-- Output page -->
      <main class="grow pt-10 pb-8 mt-10 min-h-[calc(100%_-_40px)] w-full max-w-[100%] mb-0 mx-0 px-2">
        <slot />
      </main>
    </div>
  </template>
  