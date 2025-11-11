<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          Ticker by Pedro
        </q-toolbar-title>

        <div>v0.1</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
          Menú
        </q-item-label>

        <q-separator class="q-ma-xs"></q-separator>
        <SimpleItem v-for="link in menu" :key="link.title" v-bind="link" />
        <q-separator class="q-ma-xs"></q-separator>

      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import SimpleItem from 'components/SimpleItem.vue'

const menu = ref([
  {
    title: 'Metrónomo',
    icon: 'school',
    link: '/home'
  },
  {
    title: 'Canciones',
    icon: 'school',
    link: '/songs'
  },
])


const leftDrawerOpen = ref(false)

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
