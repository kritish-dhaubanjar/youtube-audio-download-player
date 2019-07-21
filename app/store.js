import Vue from "vue";
import Vuex from "vuex";
import localStorage from "nativescript-localstorage";

const NSVuexPersistent = store => {
  let storageStr = localStorage.getItem("ns-vuex-persistent");
  if (storageStr) {
    store.replaceState(JSON.parse(storageStr));
  }
  store.subscribe((mutation, state) => {
    localStorage.setItem("ns-vuex-persistent", JSON.stringify(state));
  });
};

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [NSVuexPersistent],
  state: {
    music: [],
    playing: "",
    path: ""
  },

  getters: {
    getMusic: state => {
      return state.music;
    },
    getPlaying: state => {
      return state.playing;
    },
    getPath: state => {
      return state.path;
    }
  },
  mutations: {
    addMusic(state, payload) {
      state.music.push(payload);
    },
    setPlaying(state, payload) {
      state.playing = payload;
    },
    setPath(state, payload) {
      state.path = payload;
    },
    removeMusic(state, payload) {
      state.music = state.music.filter(item => {
        return item._name !== payload._name;
      });
    }
  },
  actions: {}
});
