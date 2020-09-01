import Vue from 'vue';
// import Vuex from 'vuex';
// import NetSrv from '../../services/NetSrv'
import { Loading, QSpinnerGears } from 'quasar';
import axios from 'axios';

const state = {
  intentions: [],
  selIntention: '',
  selIntentionIndex: -1,
  dirtyFlag: false
};
const getters = {};
const mutations = {
  setIntentions(state, ints) {
    state.intentions = ints;
  },
  setSelIntention(state, sel) {
    state.selIntention = sel;
  },
  setDirtyFlag(state, flag) {
    Vue.set(state, 'dirtyFlag', flag);
    console.log('STORE: dirtyFlag: ', state.dirtyFlag);
  },
  setExample(state, payload) {
    console.log('STORE setExample:' + payload.id + ' -> ' + payload.text);
    Vue.set(state.selIntention, 'dirty', true);
    Vue.set(state.selIntention.ejemplos[payload.id], 'text', payload.text);
    Vue.set(state.selIntention.ejemplos[payload.id], 'dirty', true);
  },
  setResponse(state, text) {
    const found = state.intentions.find(
      x => x.text === state.selIntention.text
    );
    found.dirty = true;
    found.respuesta = {
      text: text,
      dirty: true
    };
    console.log('STORE setResponse:', text);
  }
};
const actions = {
  async getIntentions({ commit }) {
    Loading.show({
      spinner: QSpinnerGears,
      spinnerColor: 'white',
      spinnerSize: 140,
      backgroundColor: 'gray',
      message: 'cargando...',
      messageColor: 'black'
    });
    // const raw = await axios.get('http://localhost:9000/api/getIntentions');
    const raw = await axios({
      method: 'GET',
      url: 'http://localhost:9000/api/getIntentions',
      headers: {
        'content-type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
      },
      params: {}
    });
    const ints = raw.data;
    console.log('ints:', ints);
    commit('setSelIntention', ints[0]);
    commit('setIntentions', ints);
    Loading.hide();
  },
  async saveExample({ commit }, payload) {
    Loading.show({
      spinner: QSpinnerGears,
      spinnerColor: 'white',
      spinnerSize: 140,
      backgroundColor: 'gray',
      message: 'cargando...',
      messageColor: 'black'
    });
    commit('setExample', payload);

    Loading.hide();
  },
  async saveResponse({ commit }, text) {
    Loading.show({
      spinner: QSpinnerGears,
      spinnerColor: 'white',
      spinnerSize: 140,
      backgroundColor: 'gray',
      message: 'cargando...',
      messageColor: 'black'
    });
    commit('setResponse', text);
    Loading.hide();
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
