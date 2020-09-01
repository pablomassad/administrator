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
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>{{ title }}</q-toolbar-title>

        <div>Ver.1.0</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label header class="text-grey-8">
          Menu
        </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from 'components/EssentialLink.vue';
import { mapState } from 'vuex';

const linksData = [
  {
    title: 'Perfiles',
    caption: '',
    icon: 'groups',
    link: '/perfiles'
  },
  {
    title: 'Grupos',
    caption: '',
    icon: 'group',
    link: '/grupos'
  },
  {
    title: 'Perfiles Agentes',
    caption: '',
    icon: 'support_agent',
    link: '/perfiles_agentes'
  },
  {
    title: 'Bandas Horarias',
    caption: '',
    icon: 'access_time',
    link: '/perfiles_agentes'
  },
  {
    title: 'Feriados',
    caption: '',
    icon: 'calendar_today',
    link: '/feriados'
  },
  {
    title: 'Videos',
    caption: '',
    icon: 'camera',
    link: '/vids'
  },
  {
    title: 'Criterios Rellamada',
    caption: '',
    icon: 'call_split',
    link: '/perfiles_agentes'
  },
  {
    title: 'Bot Trainer',
    caption: '',
    icon: 'android',
    link: '/bot'
  }
];

export default {
  name: 'MainLayout',
  components: { EssentialLink },
  data() {
    return {
      leftDrawerOpen: false,
      essentialLinks: linksData
    };
  },
  computed: {
    ...mapState('main', ['title'])
  }
};
</script>
