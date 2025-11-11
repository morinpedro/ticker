<template>
  <q-page padding>
    <div class="row">
      <div class="col-0 col-sm-1 col-md-2"></div>
      <div class="col">
        <div class="row text-h4 q-pa-xl">
          Canciones
        </div>
        <div class="row items-center q-pa-md" v-for="song in songs" :key="song.id">
          <song-card :song="song" @click="gotoSong(song)" :clickable="true" />
        </div>
      </div>
      <div class="col-0 col-sm-1 col-md-2"></div>
    </div>
  </q-page>
</template>

<script setup>
import SongCard from 'src/components/SongCard.vue'
const songs = [
  {
    id: 1,
    name: 'uno',
    blocks: [{
      id: 1,
      speed: 120,
      bpc: 4,
      repeat: 4
    },
    {
      id: 2,
      speed: 60,
      bpc: 3,
      repeat: 6
    }]
  },
  {
    id: 2,
    name: 'dos',
    blocks: [{
      id: 1,
      speed: 60,
      repeat: 4
    },
    {
      id: 2,
      speed: 80,
      repeat: 6
    }]
  },
]

import { useRouter } from 'vue-router'
const router = useRouter()

const gotoSong = (song) => {
  console.log(song)
  router.push({ path: '/song', query: { data: JSON.stringify(song) } })
}

// Function to start the metronome
</script>
