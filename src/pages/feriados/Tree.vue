<template>
  <div>
    <q-input ref="filterGroups" filled v-model="filter" label="Filtro">
      <template v-slot:append>
        <q-icon v-if="filter !== ''" name="clear" class="cursor-pointer" />
      </template>
    </q-input>
    <q-tree
      :nodes="grupos"
      node-key="label"
      :filter="filter"
      selected-color="primary"
      :selected.sync="selGrpName"
      default-expand-all
    >
      <template v-slot:header-root="prop">
        <div class="row items-center">
          {{ prop.node.label }}
        </div>
      </template>
    </q-tree>
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
    ...mapState('feriados', ['groups', 'selectedGroupName']),
    grupos() {
      const res = [];
      const groupsData = {
        icon: 'today',
        label: 'Grupos de feriados',
        header: 'root'
      };
      groupsData.children = this.initGroups();
      res.push(groupsData);
      console.log('tree groups:', res);
      return res;
    },
    selGrpName: {
      get() {
        console.log('tree selectedGroupName:', this.selectedGroupName);
        return this.selectedGroupName;
      },
      set(value) {
        this.setSelectedGroupName(value);
      }
    }
  },
  mounted() {
    console.log('tree mounted event!');
  },
  methods: {
    ...mapMutations('feriados', ['setSelectedGroupName']),
    initGroups() {
      const res = this.groups.map(x => {
        const o = { label: x.name };
        return o;
      });
      return res;
    }
  }
};
</script>
