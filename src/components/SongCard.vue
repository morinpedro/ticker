<template>
    <q-card class="bg-info col-12" :clickable="props.clickable" @click="$emit('gotoSong')">
<div class="row q-px-xl q-py-xs text-h6">{{props.song.name}}</div>
<div class="row q-px-xl q-py-xs"
    v-for="block in props.song.blocks" :key="block.id">
<!-- {{ block }} -->
  <div class="col-1">({{ block.id }})</div>
      <div class="col-3">BPC: <span class="q-pl-sm">{{block.bpc}}</span></div>
      <div class="col-auto q-pr-xs">BPM:</div>
      <div class="col">{{block.speed}}
      <span v-if="accel!==0" class="q-pl-sm">({{ Math.max(block.speed+props.accel,1) }})</span>
      </div>
      <div class="col-2">Rep: {{block.repeat}}</div>
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
    clickable: {
      type: Boolean,
      default: false
    }
  })


</script>
