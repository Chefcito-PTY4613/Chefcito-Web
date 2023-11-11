<script setup lang="ts">
const config = useRuntimeConfig();
import { useUserStore } from "@/stores/user";
import { bytesToMB, reduceImageResolution } from "~/lib/utils.rata";
const userStore = useUserStore();
const { getFoodTypes, set } = foodTypesStore();
if (getFoodTypes.length == 0) set();
const types = computed(() => getFoodTypes);

const { id, name, desc, img, price, typeId } = defineProps<{
  id: string;
  name: string;
  desc: string;
  img: string;
  price: number;
  typeId: string;
}>();

const nameEdit = ref(name),
      descEdit = ref(desc),
      priceEdit = ref(price),
      imgEdit: Ref<File | null>  = ref(null),
      sizeOrg = ref(0),
      sizeNew = ref(0),
      typeEdit = ref(typeId),
      imagePreview = ref(img);

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
      imgEdit.value = data.img;
      sizeOrg.value = data.sizeOrg;
      sizeNew.value = data.sizeNew;
    }
  }
}

const delteImage = () => {
  imagePreview.value = "";
  imgEdit.value = null;
  sizeOrg.value = 0;
  sizeNew.value = 0;
};

const edit = async () => {
  
  const formData = new FormData();
  formData.append("id", id);
  if(nameEdit.value !== '' && nameEdit.value !== name) 
  formData.append("name", nameEdit.value);

  if(descEdit.value !== '' && descEdit.value !== desc) 
  formData.append("desc", descEdit.value);

  if(priceEdit.value > 500 && priceEdit.value !== price) 
  formData.append("price", `${priceEdit.value}`);

  if(typeEdit.value !== '' && typeEdit.value !== typeId) 
  formData.append("type", typeEdit.value);

  if (imgEdit.value) formData.append("img", imgEdit.value);

  

await fetch(`${config.public.backEnd}food`, {
  method: "PUT",
  headers: { Authorization: `Bearer ${userStore.getUser.token}` },
  body: formData,
})
  .then((data) => data.json())
  .catch((err) => console.log(err));
};
</script>
<template>
  <UiSheet>
    <UiSheetTrigger class="p-1 h-auto">🖊️</UiSheetTrigger>
    <UiSheetContent class="c-scroll">
      <UiSheetHeader>
        <UiSheetTitle>Editar {{ name }}</UiSheetTitle>
        <UiSheetDescription>
          Puedes editar todos los atributos.
        </UiSheetDescription>
      </UiSheetHeader>

      <div class="grid gap-5 py-5">
        <div class="grid grid-cols-5 items-center gap-5">
          <UiLabel for="name" class="col-span-2 text-right"> Nombre </UiLabel>
          <UiInput
            id="name"
            v-model="nameEdit"
            :value="nameEdit"
            class="col-span-3"
          ></UiInput>
        </div>
        <div class="grid grid-cols-5 items-center gap-5">
          <UiLabel for="flag" class="col-span-2 text-right"> Precio </UiLabel>
          <UiInput
            type="number"
            id="flag"
            v-model="priceEdit"
            :value="priceEdit"
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
            v-model="descEdit"
            :value="descEdit"
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

        <UiButton @click="edit()">Guardar cambios</UiButton>
      </div>
    </UiSheetContent>
  </UiSheet>
</template>
