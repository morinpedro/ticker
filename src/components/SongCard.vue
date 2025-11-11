<template>
  <q-card class="bg-info col-12" clickable @click="$emit('click')">
    <div class="row q-px-xl q-py-xs text-h6">{{ props.song.name }}</div>
    <div class="row q-px-sm q-py-xs" v-for="block in props.song.blocks" :key="block.id">
      <!-- {{ block }} -->
      <div class="col-1">({{ block.id }})</div>
      <div class="col-3">BPC: <span class="q-pl-sm">{{ block.bpc }}</span></div>
      <div class="col-auto q-pr-xs">BPM:</div>
      <div class="col">{{ block.speed }}
        <span v-if="accel !== 0" class="q-pl-sm">({{ Math.max(block.speed + props.accel, 1) }})</span>
      </div>
      <div class="col-2">Rep: {{ block.repeat }}</div>
    </div>
    <div class="row" v-if="allowEdit">
      <div class="col-12 text-right" v-if="!editing">
        <q-btn dense color="green" icon="edit" @click.stop="enableEditingediting = true"></q-btn>
      </div>
      <div class="col-12 text-center" v-if="editing">
        <q-btn dense color="green" icon="check" class="q-mr-xl" @click.stop="submitChanges"></q-btn>
        <q-btn dense color="red" icon="cancel" @click.stop="cancelChanges"></q-btn>
      </div>

    </div>
  </q-card>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  song: {
    type: Object,
    required: true
  },
  accel: {
    type: Number,
    default: 0
  },
  allowEdit: {
    type: Boolean,
    default: false
  }
})
const editing = ref(false)

</script>
