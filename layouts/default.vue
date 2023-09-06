<template>
    <div>
      <header>
        <nav>
          <NuxtLink to="/">home</NuxtLink>
          <NuxtLink to="/login">login</NuxtLink>
        </nav>
      </header>
      <!-- Output page -->
      <main class="container">
        <slot />
      </main>
    </div>
  </template>
  