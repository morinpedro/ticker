<template>
  <q-page padding>
    <div class="row">
      <div class="col-0 col-sm-1 col-md-2"></div>
      <div class="col">
        <div class="row q-pa-lg">
          <q-card class="bg-info col-12">
            <q-form @submit.prevent="submitChanges">
              <q-input label="Nombre" v-model="song.name" :disable="!editing"></q-input>
              <div class="row q-px-xl q-py-xs text-h6">
                {{ song.name }}</div>
              <div class="row q-px-sm q-py-xs items-center" v-for="block in song.blocks" :key="block.id">
                <!-- {{ block }} -->
                <div class="col-1">({{ block.id }})</div>
                <div class="col-2 q-pr-sm">
                  <q-input label="BPC" v-model="block.bpc"></q-input>
                </div>
                <div class="col-2 q-pr-sm">
                  <q-input label="BPM" v-model="block.speed">
                  </q-input>
                </div>
                <div class="col-2 q-pr-sm"><br />
                  <span v-if="accel !== 0" class="q-pl-sm">({{ Math.max(block.speed + accel, 1)
                  }})</span>
                </div>
                <div class="col-2">
                  <q-input label="Repeticiones" v-model="block.repeat"></q-input>
                </div>
              </div>
              <div class="row q-pa-xs">
                <div class="col-12 text-right" v-if="!editing">
                  <q-btn dense color="green" icon="edit" @click="enableEditing"></q-btn>
                </div>
                <div class="col-12 text-center" v-if="editing">
                  <q-btn dense color="green" type="submit" icon="check" class="q-mr-xl"></q-btn>
                  <q-btn dense color="red" icon="cancel" @click.stop="cancelChanges"></q-btn>
                </div>

              </div>
            </q-form>
          </q-card>
        </div>
        <div class="row justify-center q-px-xl q-pt-md q-pb-xl">
          Aceleración (en BPM)
        </div>
        <div class="row items-center q-px-xl">
          <div class="col-auto">
            <q-btn icon="remove" @click="slowDown"></q-btn>
          </div>
          <div class="col q-px-lg">
            <q-slider :min="-30" :max="30" label-always color="green" v-model="accel" />
          </div>
          <div class="col-auto">
            <q-btn icon="add" @click="speedUp"></q-btn>
          </div>
        </div>
        <div class="row flex flex-center">
          <q-btn :icon="playPause" @click="startStopMetronome"></q-btn>
        </div>
      </div>
      <div class="col-0 col-sm-1 col-md-2"></div>
    </div>
  </q-page>
</template>

<script setup>
import { useInterval } from 'quasar';
import { computed, ref, watch } from 'vue';
const { registerInterval, removeInterval } = useInterval();

import { useRoute } from 'vue-router'
const route = useRoute()

const song = JSON.parse(route.query.data);

const accel = ref(0)
const slowDown = () => {
  accel.value--
}
const speedUp = () => {
  accel.value++
}
const playing = ref(false)
const playPause = computed(() => {
  if (!playing.value)
    return 'play_arrow'
  return 'stop'
})

const startStopMetronome = (() => {
  if (!playing.value) startMetronome();
  else stopMetronome();
})

let audioContext = null;
let oscillator = null;

// Function to start the metronome
const startMetronome = async () => {
  if (playing.value) return

  playing.value = true;
  for (let i = 0; i < song.blocks.length; i++) {
    await playBlock(song.blocks[i])
    console.log(playing.value)
    if (!playing.value) {
      stopMetronome()
      // removeInterval()
      return
    }
  }
  stopMetronome()
  // playing.value=false

}

async function playBlock (block) {
  const intervalMs = (60 / Math.max(block.speed + accel.value, 1)) * 1000; // Calculate interval in milliseconds

  // const promise = new Promise((resolve)=>{
  //   setTimeout(() => {
  //     resolve('done')
  //   }, block.repeat*intervalMs)
  // })

  playClick(1);

  let counter = 1
  const promise = new Promise((resolve) => {
    registerInterval(() => {
      counter++
      if (!playing.value) {
        // removeInterval()
        resolve('done')
      }
      if (counter > block.repeat * block.bpc) {
        removeInterval()
        resolve('done')
      } else {
        console.log(counter % block.bpc)
        if (counter % block.bpc == 1)
          playClick(1)
        else
          playClick(0)
        console.log(block.id, counter)
      }
    }, intervalMs)
  })

  await promise
}

// Function to stop the metronome
function stopMetronome () {
  // if (!playing.value) return;
  removeInterval();
  playing.value = false;

  if (oscillator) {
    oscillator.stop();
    oscillator.disconnect();
    oscillator = null;
  }
  if (audioContext) {
    audioContext.close();
    audioContext = null;
  }
}

// Function to create and play a click sound
const playClick = (n = 0) => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  oscillator = audioContext.createOscillator();
  oscillator.type = 'sine'; // Can be 'sine', 'square', 'sawtooth', 'triangle'
  if (n)
    oscillator.frequency.value = 900; // Frequency of the click sound
  else
    oscillator.frequency.value = 600; // Frequency of the click sound

  const gainNode = audioContext.createGain();
  gainNode.gain.setValueAtTime(1, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.02); // Quick fade out

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.02); // Sound duration
}//

const editing = ref(false)
const enableEditing = () => {
  editing.value = true
}
const cancelChanges = () => {
  editing.value = false
}
const submitChanges = () => {
  editing.value = false
}

// const editSong = () => {
//   console.log('click')
// }
watch(accel, () => {
  stopMetronome()
})

</script>
