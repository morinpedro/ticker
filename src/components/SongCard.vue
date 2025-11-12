<template>
  <q-card class="bg-info col-12" clickable @click="$emit('click')">
    <div class="row q-pl-xl q-py-xs">
      <div class="col text-h6">{{ props.song.name }}</div>
      <div class="col-auto">
        <q-btn round flat class="text-red" icon="delete" @click.stop="$emit('delete')"></q-btn>
      </div>
    </div>
    <div class="row q-px-sm q-py-xs" v-for="block in props.song.blocks" :key="block.id">
      <!-- {{ block }} -->
      <div class="col-1">({{ block.id }})</div>
      <div class="col-3">BPC: <span class="q-pl-sm">{{ block.bpc }}</span></div>
      <div class="col-auto q-pr-xs">BPM:</div>
      <div class="col">{{ block.speed }}
      </div>
      <div class="col-2">Rep: {{ block.repeat }}</div>
    </div>
  </q-card>
</template>

<script setup>

const props = defineProps({
  song: {
    type: Object,
    required: true
  },
  accel: {
    type: Number,
    default: 0
  },
})

</script>
