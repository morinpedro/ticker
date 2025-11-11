<template>
  <q-page padding>
    <div class="row">
      <div class="col-0 col-sm-1 col-md-2"></div>
      <div class="col">
        <div class="row text-h4 q-pa-xl">
          Metrónomo
        </div>
        <div class="row flex flex-center q-pa-lg">
          <div class="col-auto">
            <q-btn dense icon="remove" @click="lessBPC"></q-btn>
          </div>
          <div class="col-auto q-px-lg text-h6">
            {{ bpc }}
          </div>
          <div class="col-auto">
            <q-btn dense icon="add" @click="moreBPC"></q-btn>
          </div>
          <div class="col-12 text-center q-pb-sm text-h6">Beats por compás</div>
        </div>
        <div class="row items-center q-pa-lg">
          <div class="col-12 text-center q-pb-sm text-h6 text-green">{{ speed }}</div>
          <div class="col-auto">
            <q-btn dense icon="remove" @click="slowDown"></q-btn>
          </div>
          <div class="col q-px-lg">
            <q-slider size="lg" markers ticks :min="10" :max="240" track-size="6px" label-size="20px" color="green"
              v-model="speed" />
          </div>
          <div class="col-auto">
            <q-btn dense icon="add" @click="speedUp"></q-btn>
          </div>
          <div class="col-12 text-center q-pb-sm text-h6">Beats por minuto</div>
        </div>
        <div class="row flex flex-center">
          <q-btn dense round size="lg" :color="playPauseColor" :icon="playPause" @click="startStopMetronome"></q-btn>
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

const speed = ref(90)
const slowDown = () => {
  if (speed.value > 10)
    speed.value--
}
const speedUp = () => {
  if (speed.value < 240)
    speed.value++
}
const bpc = ref(4)
const lessBPC = () => {
  if (bpc.value > 1)
    bpc.value--
}
const moreBPC = () => {
  bpc.value++
}
const playing = ref(false)
const playPause = computed(() => {
  if (!playing.value)
    return 'play_arrow'
  return 'pause'
})
const playPauseColor = computed(() => {
  if (!playing.value)
    return 'green'
  return 'red'
})

const startStopMetronome = (() => {
  if (!playing.value) startMetronome();
  else stopMetronome();
})

let audioContext = null;
let oscillator = null;

// Function to start the metronome
const startMetronome = () => {
  if (playing.value) return

  playing.value = true;
  const intervalMs = (60 / Number(speed.value)) * 1000; // Calculate interval in milliseconds
  playClick(1);
  let counter = 0;
  // registerInterval(playClick, intervalMs);
  registerInterval(() => {
    counter++
    if (counter == bpc.value) {
      playClick(1)
      counter = 0;
    } else {
      playClick(0)
    }
  }, intervalMs)
}

// Function to stop the metronome
function stopMetronome () {
  if (!playing.value) return;
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

watch(speed, () => {
  if (playing.value) {
    stopMetronome()
    startMetronome()
  }
})
</script>

<style scoped></style>
