<template>
  <q-page padding>
    <div class="row">
      <div class="col-0 col-sm-1 col-md-2"></div>
      <div class="col">
        <div class="row q-pa-xl">
          <div class="col text-h4">Canciones</div>
          <div class="col-auto"><q-btn round dense class="q-ml-lg" color="green" icon="add" @click="newSong"></q-btn></div>
        </div>
        <template v-if="!starting">
        <div class="row items-center q-pa-xl text-h6" v-if="songs.length==0">
          Aún no tienes canciones
        </div>
        <div class="row items-center q-pa-md" v-for="song in songs" :key="song.id">
          <song-card :song="song" @click="gotoSong(song)" @delete="deleteSong(song)" :clickable="true" />
        </div>
        </template>
      </div>
      <div class="col-0 col-sm-1 col-md-2"></div>
    </div>
  </q-page>
  <YesNoDialog v-if="confirmDeleteDialog" :message="'¿Estás segura/o de eliminar <br />'+songToDelete.name+'?'" @yes="confirmDelete"
    @no="confirmDeleteDialog = false" />
</template>

<script setup>
import SongCard from 'src/components/SongCard.vue'
// const songs = [
//   {
//     id: 1,
//     name: 'uno',
//     blocks: [{
//       id: 1,
//       speed: 120,
//       bpc: 4,
//       repeat: 4
//     },
//     {
//       id: 2,
//       speed: 60,
//       bpc: 3,
//       repeat: 6
//     }]
//   },
//   {
//     id: 2,
//     name: 'dos',
//     blocks: [{
//       id: 1,
//       speed: 60,
//       repeat: 4
//     },
//     {
//       id: 2,
//       speed: 80,
//       repeat: 6
//     }]
//   },
// ]


const songs = ref([])
import { useRouter } from 'vue-router'
const router = useRouter()

import { onBeforeMount, ref } from 'vue';
import { useQuasar } from 'quasar';
import { loadSongs, renumberElements, saveSongs } from 'src/services/utils';
import YesNoDialog from 'src/components/YesNoDialog.vue';

onBeforeMount(async () => {
  reload()
})

const q = useQuasar()

const starting = ref(true)
const reload = async () => {
  starting.value = true
  q.loading.show()
  songs.value = await loadSongs()
  q.loading.hide()
  starting.value = false
}

const newSong = () => {
  router.push({ path: '/song/0' })
}


const gotoSong = (song) => {
  router.push({ path: '/song/'+song.id })
}

const songToDelete = ref(null)
const confirmDeleteDialog = ref(false)
const deleteSong = (song) => {
  songToDelete.value = song
  confirmDeleteDialog.value = true
}

const confirmDelete = async () => {
  confirmDeleteDialog.value = false
  q.loading.show()
  songs.value.splice(songToDelete.value.id-1,1)
  renumberElements(songs.value)
  await saveSongs(songs.value)
  reload()
  q.loading.hide()
}


// Function to start the metronome
</script>
