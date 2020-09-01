// import Vue from 'vue';
// import Vuex from 'vuex';
// import NetSrv from '../../services/NetSrv'
import { Loading, QSpinnerGears } from 'quasar';
// import axios from 'axios'

const state = {
  groups: [],
  selectedGroupId: 1,
  selectedGroupName: ''
};
const getters = {};
const mutations = {
  setGroups(state, groups) {
    state.groups = groups;
    console.log('STORE setGroups:', state.groups);
  },
  setSelectedGroupName(state, grpName) {
    state.selectedGroupName = grpName;
    console.log('STORE setSelectedGroupName:', state.selectedGroupName);
  }
};
const actions = {
  async getHolidays({ commit }) {
    Loading.show({
      spinner: QSpinnerGears,
      spinnerColor: 'white',
      spinnerSize: 140,
      backgroundColor: 'gray',
      message: 'cargando...',
      messageColor: 'black'
    });
    setTimeout(() => {
      const grps = [
        {
          id: 1,
          name: 'Default',
          details: [
            {
              fecha: '2019/03/15',
              descripcion: 'Dia de la bandera'
            },
            {
              fecha: '2019/03/15',
              descripcion: 'Navidad'
            },
            {
              fecha: '2019/03/15',
              descripcion: 'San Martín'
            },
            {
              fecha: '2019/03/15',
              descripcion: 'Dia de la independencia'
            },
            {
              fecha: '2020/03/15',
              descripcion: 'Dia de la Memoria'
            },
            {
              fecha: '2020/01/01',
              descripcion: 'Año nuevo'
            },
            {
              fecha: '2019/09/10',
              descripcion: 'Dia de la Virgen'
            },
            {
              fecha: '2020/01/14',
              descripcion: 'Dia de la revolucion de Mayo'
            },
            {
              fecha: '2019/03/15',
              descripcion: 'Dia de la raza'
            },
            {
              fecha: '2020/02/04',
              descripcion: 'Dia de Guemes'
            }
          ]
        },
        {
          id: 2,
          name: 'Primer Grupo',
          details: [
            {
              fecha: '2019/03/15',
              descripcion: 'Dia de la raza'
            },
            {
              fecha: '2020/02/04',
              descripcion: 'Dia de la Virgen'
            }
          ]
        }
      ];
      commit('setSelectedGroupName', grps[0].name);
      commit('setGroups', grps);
      Loading.hide();
    }, 2000);
  }
};

export default {
  strict: true,
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
