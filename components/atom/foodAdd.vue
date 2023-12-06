<script setup lang="ts">
const config = useRuntimeConfig();
import { bytesToMB, reduceImageResolution } from "@/lib/utils.rata";
import { useUserStore } from "@/stores/user";
const userStore = useUserStore();
const { getFoodTypes, set } = foodTypesStore();
if (getFoodTypes.length == 0) set();
const types = computed(() => getFoodTypes);

const name = ref(""),
  desc = ref(""),
  price = ref(0),
  typeEdit = ref(""),
  sizeOrg = ref(0),
  sizeNew = ref(0),
  imagePreview = ref(""),
  img: Ref<File | null>  = ref(null);

let canva: HTMLCanvasElement | null = null;

const btnDisabled = computed(
  () =>
    price.value > 500 &&
    name.value.length > 1 &&
    desc.value.length > 1 &&
    typeEdit.value.length > 1 &&
    imagePreview.value.length > 1
);

const previewImage = (file: File) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    imagePreview.value = e.target?.result as string;
  };
  reader.readAsDataURL(file);
};
async function fileUpload(event: InputEvent) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const data = await reduceImageResolution(target.files[0]);
    if (data.img && data.sizeNew && data.sizeOrg) {
      previewImage(data.img);
      img.value = data.img;
      sizeOrg.value = data.sizeOrg;
      sizeNew.value = data.sizeNew;
    }
  }
}


// Function to reduce image resolution



const delteImage = () => {
  imagePreview.value = "";
  sizeOrg.value = 0;
  sizeNew.value = 0;
};

const add = async () => {
  if(!img.value)return;

  const formData = new FormData();
  formData.append("name", name.value);
  formData.append("desc", desc.value);
  formData.append("price", `${price.value}`);
  formData.append("type", typeEdit.value);
  formData.append("img", img.value);

  await fetch(`${config.public.backEnd}food`, {
    method: "POST",
    headers: { Authorization: `Bearer ${userStore.getUser.token}` },
    body: formData,
  })
    .then((data) => data.json())
    .catch((err) => console.log(err));
};
</script>
<template>
  <UiSheet>
    <UiSheetTrigger>Añadir</UiSheetTrigger>
    <UiSheetContent class="c-scroll">
      <UiSheetHeader>
        <UiSheetTitle>Añadir comida</UiSheetTitle>
        <UiSheetDescription>
          Puedes añadir comidas que luego estaran en el lado del cliente.
        </UiSheetDescription>
      </UiSheetHeader>

      <div class="grid gap-5 py-5">
        <div class="grid grid-cols-5 items-center gap-5">
          <UiLabel for="name" class="col-span-2 text-right"> Nombre </UiLabel>
          <UiInput
            id="name"
            v-model="name"
            :value="name"
            class="col-span-3"
          ></UiInput>
        </div>
        <div class="grid grid-cols-5 items-center gap-5">
          <UiLabel for="flag" class="col-span-2 text-right"> Precio </UiLabel>
          <UiInput
            type="number"
            id="flag"
            v-model="price"
            :value="price"
            class="col-span-3"
          ></UiInput>
        </div>
        <div class="grid grid-cols-5 items-center gap-5">
          <UiLabel for="type" class="col-span-2 text-right"> Tipo</UiLabel>
          <UiSelect class="col-span-3" id="type" v-model="typeEdit">
            <UiSelectTrigger class="col-span-3">
              <UiSelectValue placeholder="Tipo de comida" />
            </UiSelectTrigger>
            <UiSelectContent>
              <UiSelectGroup>
                <UiSelectLabel>Tipo de comida</UiSelectLabel>
                <UiSelectItem
                  v-for="item in types"
                  :key="item._id"
                  :value="item._id"
                >
                  {{ item.name }}
                </UiSelectItem>
              </UiSelectGroup>
            </UiSelectContent>
          </UiSelect>
        </div>
        <div class="grid grid-cols-5 items-center gap-5">
          <UiLabel for="desc" class="col-span-2 text-left">
            Descripción
          </UiLabel>
          <UiTextarea
            id="desc"
            v-model="desc"
            :value="desc"
            class="col-span-5"
          ></UiTextarea>
        </div>
        <div class="grid grid-cols-5 items-center gap-5">
          <UiLabel for="desc" class="col-span-2 text-left"> Foto </UiLabel>
          <article class="col-span-5 relative" v-if="imagePreview !== ''">
            <img
              class="w-full rounded-sm"
              :src="imagePreview"
              alt="Image Preview"
            />
            <UiButton
              class="absolute top-2 right-2 p-0 h-auto"
              variant="outline"
              @click="delteImage()"
              >❌</UiButton
            >
            <footer
              class="absolute bottom-2 left-2 rounded-sm text-primary-foreground bg-primary px-1"
            >
              <p>Tamaño original: {{ bytesToMB(sizeOrg) }}mb</p>
              <p>Tamaño nuevo: {{ bytesToMB(sizeNew) }}mb</p>
            </footer>
          </article>
          <UiInput
            v-else
            id="picture"
            type="file"
            accept="image/*"
            @change="fileUpload"
            class="col-span-5"
          ></UiInput>
          <canvas ref="canva" style="display: none"></canvas>
        </div>
        <UiButton :disabled="!btnDisabled" @click="add()"
          >Guardar cambios</UiButton
        >
      </div>
    </UiSheetContent>
  </UiSheet>
</template>
