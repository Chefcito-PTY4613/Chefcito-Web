<script setup lang="ts">
const props = defineProps<{
  modelValue: string;
  label: string;
  placeholder: string;
  type: string;
}>();

const emit = defineEmits(["update:modelValue"]);

const model = computed({
  get() {
    return props.modelValue;
  },

  set(value) {
    return emit("update:modelValue", value);
  },
});
</script>
<template>
  <div class="input">
    <label
      :for="props.modelValue"
      class="input__label"
      >{{ label }}</label
    >
    <input
      :type="props.type"
      :name="props.modelValue"
      :placeholder="props.placeholder"
      v-model="model"
      class="input__form"
      
    />
  </div>
</template>
