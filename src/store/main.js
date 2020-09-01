// import Vuex from 'vuex';
// import { db } from '../boot/firebase';

import { Notify } from 'quasar';

const state = {
  appValidated: false,
  title: 'Administrador ACD',
  legajo: ''
};
const getters = {};
const mutations = {
  setAppValidated(state, flag) {
    state.appValidated = flag;
    console.log('setAppValidated:', state.appValidated);
  },
  setLegajo(state, legajo) {
    state.legajo = legajo;
  },
  setTitle(state, title) {
    console.log('setting title: ', title);
    state.title = title;
  }
};
const actions = {
  async validateDevice({ commit }, uuid) {
    // let valOK = false;
    // try {
    //   const dsn = await db.doc(`devices/${uuid}`).get();
    //   const o = dsn.data();
    //   const now = new Date().getTime();
    //   if (now - o.lastUsage < 10000 && o.tool === 'DIAGNOSTICO') {
    //     valOK = true;
    //     commit('setLegajo', o.legajo);
    //   }
    //   return valOK;
    // } catch (error) {
    //   console.log('error:', error);
    //   return valOK;
    // }
    if (state.legajo === 'xxx') {
      Notify.create({
        message: 'No es posible validar la aplicación',
        color: 'red-12',
        textColor: 'white',
        icon: 'error'
      });
    } else {
      commit('setAppValidated', true);
      commit('setLegajo', 'u506713');
    }
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
