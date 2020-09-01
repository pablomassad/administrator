<template>
  <div>
    <q-input ref="filterIntentions" filled v-model="filter" label="Filtro">
      <template v-slot:append>
        <q-icon
          v-if="filter !== ''"
          name="clear"
          class="cursor-pointer"
          @click="filter = ''"
        />
        <q-toggle color="red" v-model="filterEdFlag" icon="star" />
        <q-chip icon="event" text-color="white" color="primary">
          Total: {{ Object.keys(intenciones).length }}</q-chip
        >
      </template>
    </q-input>
    <q-scroll-area style="height: 87vh">
      <q-list bordered separator :filter="filter">
        <q-item
          clickable
          v-ripple
          v-for="(int, i) in intenciones"
          :key="i"
          :active="selIntention === int"
          @click="setSelIntention(int)"
          active-class="currentIntention"
        >
          <q-item-section>
            {{ int.text }}
          </q-item-section>
          <q-item-section v-if="int.dirty" avatar>
            <q-avatar
              color="negative"
              text-color="white"
              icon="star"
              class="shadow-2"
            />
          </q-item-section>
        </q-item>
      </q-list>
    </q-scroll-area>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  data() {
    return {
      filter: ''
    };
  },
  computed: {
    ...mapState('bot', ['intentions', 'selIntention', 'dirtyFlag']),
    intenciones() {
      const lst = this.intentions.filter(
        int =>
          (int.text.toLowerCase().indexOf(this.filter.toLowerCase()) > -1 &&
            this.dirtyFlag === false) ||
          int.dirty === true
      );
      return lst;
    },
    filterEdFlag: {
      get() {
        console.log('dirtyFlag: ', this.dirtyFlag);
        return this.dirtyFlag;
      },
      set(v) {
        this.setDirtyFlag(v);
      }
    }
  },
  methods: {
    ...mapMutations('bot', ['setSelIntention', 'setDirtyFlag']),
    resetFilter() {
      this.filter = '';
      this.$refs.filterGroups.focus();
    }
  }
};
</script>
<style scoped>
.currentIntention {
  font-weight: bold;
  background-color: rgb(49, 133, 201);
  color: white;
}
.edited {
  background-color: lightsalmon;
}
</style>
