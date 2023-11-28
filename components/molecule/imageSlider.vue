<script setup lang="ts">
import { Food } from "~/lib/types";
import { delay } from "~/lib/utils.rata";

const config = useRuntimeConfig();
const currentImage = ref(0);
const images = ref([] as Array<Food>);

async function getData() {
  const totalData = await fetch(`${config.public.backEnd}food/`).then((data) =>
    data.json()
  );
  const data = totalData as Array<Food>;

  if (data)
    for (const el of data) {
      images.value.push(el);
    }
}

const autoSlide = async () => {
  while (true) {
    goToNext();
    await delay(4000);
  }
};

const goToNext = () => {
  if (currentImage.value < images.value.length - 1) {
    currentImage.value++;
  } else {
    currentImage.value = 0; // Vuelve al inicio si es la última imagen
  }
};

const goToPrevious = () => {
  if (currentImage.value > 0) {
    currentImage.value--;
  } else {
    currentImage.value = images.value.length - 1; // Va a la última imagen si es la primera
  }
};
onMounted(() => {
  getData();
  autoSlide();
});
</script>
<template>
  <div id="controls-carousel" class="relative w-full h-full">
    <!-- Carousel wrapper -->
    <div class="relative overflow-hidden rounded-lg h-96">
      <!-- Items -->

      <TransitionGroup>
        <div
          v-for="(image, i) in images"
          :key="image._id"
          class="duration-700 ease-in-out"
          v-show="i === currentImage"
        >
        <img
        :src="image.img"
        class="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
        :alt="image.name"
        />
        <div class="absolute top-0 bottom-1/2 left-0 right-0 flex items-center justify-center">
          <h3 class="text-xl text-center rounded-md py-2 px-4 bg-gray-100/80 dark:bg-gray-800/80">
           <strong>
             {{ image.name }}
            </strong>
            <br> 
            ${{ image.price }}
          </h3>
        </div>
        </div>
      </TransitionGroup>
    </div>
    <!-- Slider controls -->
    <button
      type="button"
      @click="goToPrevious"
      class="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
    >
      <span
        class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none"
      >
        <svg
          class="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 6 10"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 1 1 5l4 4"
          />
        </svg>
        <span class="sr-only">Previous</span>
      </span>
    </button>
    <button
      type="button"
      @click="goToNext"
      class="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
    >
      <span
        class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none"
      >
        <svg
          class="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 6 10"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m1 9 4-4-4-4"
          />
        </svg>
        <span class="sr-only">Next</span>
      </span>
    </button>
  </div>
</template>
<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.35s ease;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
