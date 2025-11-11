<template>
  <q-item clickable :to="link" :class="highlight ? 'text-yellow text-h6 text-bold' : ''" class="items-center"
    active-class="text-blue bg-lightPurple text-bold">
    <q-icon :name="icon" size="1.5rem" class="q-mr-md"></q-icon>
    <q-item-label v-if="icon == 'star'"> <strong>{{ title }}</strong></q-item-label>
    <q-item-label v-else> {{ title }}</q-item-label>
  </q-item>
</template>

<script>
export default {
  name: 'NavigationItem',

  props: {
    title: {
      type: String,
      required: true
    },

    caption: {
      type: String,
      default: ''
    },

    link: {
      type: String,
      default: '#'
    },

    icon: {
      type: String,
      default: ''
    },

    highlight: {
      type: Boolean,
      default: false
    },

  }
}
</script>
