<template>
  <q-page class="q-container">
    <div class="row q-pa-lg">
    <song-card :song="song" :clickable="false" :accel="accel"/>
    </div>
    <div class="row justify-center q-px-xl q-pt-md q-pb-xl">
      Aceleración (en BPM)
      </div>
    <div class="row items-center q-px-xl">
      <div class="col-auto">
        <q-btn icon="remove" @click="slowDown"></q-btn>
      </div>
      <div class="col q-px-lg">
        <q-slider type="slider" :min="-30"
      :max="30"
      label-always
      color="green"
      v-model="accel" />
      </div>
      <div class="col-auto">
        <q-btn icon="add" @click="speedUp"></q-btn>
      </div>
    </div>
<div class="row flex flex-center">
  <q-btn :icon="playPause" @click="startStopMetronome"></q-btn>
</div>
  </q-page>
</template>

<script setup>
import SongCard from 'src/components/SongCard.vue'
import { useInterval } from 'quasar';
import { computed, ref, watch } from 'vue';
const { registerInterval, removeInterval } = useInterval();

import { useRoute } from 'vue-router'
const route = useRoute()

const song = JSON.parse(route.query.data);

const accel=ref(0)
const slowDown = () => {
  accel.value --
}
const speedUp = () => {
  accel.value ++
}
const playing = ref(false)
const playPause = computed (() => {
  if (!playing.value)
    return 'play_arrow'
  return 'stop'
})

const startStopMetronome = (() =>{
  if (!playing.value) startMetronome();
  else   stopMetronome();
})

let audioContext = null;
let oscillator = null;

// Function to start the metronome
const startMetronome = async () => {
    if(playing.value) return

    playing.value = true;
    for(let i=0; i<song.blocks.length ; i++) {
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

async function playBlock(block) {
      const intervalMs = (60 / Math.max(block.speed+accel.value,1)) * 1000; // Calculate interval in milliseconds

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
        if (counter > block.repeat*block.bpc) {
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
function stopMetronome() {
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
const playClick = (n=0) => {
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

watch(accel, () => {
    stopMetronome()
})
</script>
