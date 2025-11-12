<template>
  <q-page padding>
    <div class="row">
      <div class="col-0 col-sm-1 col-md-2"></div>
      <div class="col">
        <div class="row q-pa-lg" v-if="!starting">
          <q-card class="bg-info col-12 q-pa-xs">
              <div class="row q-px-xl q-py-xs text-h6">
                {{ song.name }}
              <!-- {{ song }} -->
            </div>
            <q-form @submit.prevent="submitChanges">
              <q-input :disable="!editing" label="Nombre" v-model="song.name"></q-input>
              <div class="row q-px-sm q-py-xs items-center" v-for="block in song.blocks" :key="block.id">
                <!-- {{ block }} -->
                <div class="col-1">({{ block.id }})</div>
                <div class="col-2 q-pr-sm">
                  <q-input :disable="!editing" type="number" :min="1" :max="8" label="BPC" v-model="block.bpc"></q-input>
                </div>
                <div class="col-2 q-pr-sm">
                  <q-input :disable="!editing" type="number" :min="2" :max="240" label="BPM" v-model="block.speed">
                  </q-input>
                </div>
                <div class="col-2 q-pr-sm"><br />
                  <span v-if="accel !== 0" class="q-pl-sm">({{ Math.max(block.speed + accel, 1)
                  }})</span>
                </div>
                <div class="col-2">
                  <q-input :disable="!editing" type="number" label="Reps." v-model="block.repeat"></q-input>
                </div>
                <div class="col-auto" v-if="editing">
                  <q-btn dense size="sm" class="text-green" icon="arrow_upward" :disable="block.id==1" @click="moveBlockUp(block.id)"></q-btn>
                  <q-btn dense size="sm" class="text-green" icon="arrow_downward" :disable="block.id==song.blocks.length" @click="moveBlockDown(block.id)"></q-btn>
                  <q-btn dense round size="sm" class="text-red q-ml-sm" icon="delete" @click="deleteBlock(block.id)"></q-btn>
                </div>
              </div>

              <div class="row q-pa-xs">
                <div class="col-12 text-right" v-if="!editing">
                  <q-btn dense color="green" icon="edit" @click="enableEditing"></q-btn>
                </div>
                <div class="col-12 text-right q-pr-sm" v-if="editing">
                  <q-btn dense round class="text-green" icon="add" @click="addBlock"></q-btn>
                </div>
                <div class="col-12 text-center" v-if="editing">
                  <q-btn dense color="green" type="submit" icon="check" class="q-mr-xl" :disable="!someChanges"></q-btn>
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
import { computed, ref, watch, onBeforeMount } from 'vue';
const { registerInterval, removeInterval } = useInterval();

import { useRoute } from 'vue-router'
const route = useRoute()

import { useQuasar } from 'quasar';

onBeforeMount(async () => {
  reload()
})

const q = useQuasar()
const starting = ref(true)

const reload = async () => {
  starting.value = true
  q.loading.show()
  songs.value = await loadSongs()
  const songId = Number(route.params.songId)
  if (songId>0) {
    editingSongIndex = songId-1
    song.value = songs.value[editingSongIndex];
  } else {
    editingSongIndex = songs.value.length
    song.value = {
      id: songs.value.length+1,
      name: '',
      blocks: [{
        id: 1,
        speed: 90,
        bpc: 4,
        repeat: 4
      },
      ]
    }
    editing.value=true
  }
  songCopy.value = JSON.parse(JSON.stringify(song.value))
  q.loading.hide()
  starting.value = false
}

const songs = ref([]);
const song = ref(null);
const songCopy = ref(null);



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
  for (let i = 0; i < song.value.blocks.length; i++) {
    await playBlock(song.value.blocks[i])
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
  const intervalMs = (60 / Math.max(Number(block.speed) + accel.value, 1)) * 1000; // Calculate interval in milliseconds

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
        if (counter % block.bpc == 1)
          playClick(1)
        else
          playClick(0)
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

let editingSongIndex = null
const editing = ref(false)
const enableEditing = () => {
  editing.value = true
}
const cancelChanges = () => {
  song.value = JSON.parse(JSON.stringify(songCopy.value))
  editing.value = false
}

import { useRouter } from 'vue-router'
import { loadSongs, renumberElements, saveSongs } from 'src/services/utils';
const router = useRouter()

const submitChanges = async () => {
  editing.value = false
  q.loading.show()
  // validate song
  songs.value[editingSongIndex] = JSON.parse(JSON.stringify(song.value))
  await saveSongs(songs.value)
  q.loading.hide()
  router.replace({ path: '/song/'+ song.value.id }).then(() => {
    router.go(0); // Reloads the current route
  });
  // router.push({ path: '/songs' })
}

const moveBlockDown = (i) => {
  const au = JSON.stringify(song.value.blocks[i-1])
  song.value.blocks[i-1] = JSON.parse(JSON.stringify(song.value.blocks[i]))
  song.value.blocks[i] = JSON.parse(au)
  song.value.blocks[i].id = i+1
  song.value.blocks[i-1].id = i
}

const moveBlockUp = (i) => {
  moveBlockDown(i-1)
}

const deleteBlock = (i) => {
  song.value.blocks.splice(i-1,1)
  renumberElements(song.value.blocks)
}

const addBlock = () => {
  song.value.blocks[song.value.blocks.length] = {
    id: song.value.blocks.length+1,
    speed: 90,
    bpc: 4,
    repeat: 4
  }
}

const someChanges = computed(() => {
  return JSON.stringify(song.value)!==JSON.stringify(songCopy.value)
})

watch(accel, () => {
  stopMetronome()
})

</script>
