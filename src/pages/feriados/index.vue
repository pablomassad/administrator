<template>
  <q-splitter v-model="splitterModel">
    <template v-slot:before>
      <Tree />
    </template>
    <template v-slot:after>
      <Detail />
    </template>
  </q-splitter>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';
import Tree from './Tree.vue';
import Detail from './Detail.vue';

export default {
  name: 'feriados',
  data() {
    return {
      splitterModel: 30
    };
  },
  methods: {
    ...mapMutations('main', ['setTitle']),
    ...mapActions('feriados', ['getHolidays'])
  },
  created() {
    this.setTitle('Feriados');
    this.getHolidays();
  },
  components: {
    Tree,
    Detail
  }
};
</script>
