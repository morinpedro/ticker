<template>
  <q-dialog v-model="alwaysTrue" persistent>
    <q-card class="q-pt-lg q-px-lg">
      <q-card-section>
        <div class="text-primary" v-html="props.message"></div>
        <div class="justify-center row q-mt-lg" v-if="props.checkboxMessage">
          <q-checkbox v-model="model"> {{ props.checkboxMessage }}</q-checkbox>
        </div>

        <div class="justify-center row">
          <q-btn color="positive" class="q-ma-md" @click="emitYes">{{ yes }}</q-btn>
          <q-btn color="negative" class="q-ma-md" @click="emitNo">{{ no }}</q-btn>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>


<script setup>
import { ref, computed } from 'vue';

const alwaysTrue = ref(true)
const emit = defineEmits(["yes", "no"])
const props = defineProps({
  message: {
    type: String,
    required: true
  },

  checkboxMessage: {
    type: String,
    default: ''
  },

  language: {
    type: String,
    default: 'es'
  }
})

const yes = computed(() => {
  if (props.language.toLowerCase() == 'pt') {
    return 'Sim'
  }
  if (props.language.toLowerCase() == 'en') {
    return 'Yes'
  }

  return 'Sí'
})

const no = computed(() => {
  if (props.language.toLowerCase() == 'pt') {
    return 'Não'
  }
  if (props.language.toLowerCase() == 'en') {
    return 'No'
  }

  return 'No'

})

const model = defineModel()
const emitYes = () => {
  emit("yes")
}

const emitNo = async () => {
  alwaysTrue.value = false
  setTimeout(() => { emit("no") }, 200)
}

</script>
