import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = () =>
  new Vuex.Store({
    state: {
      user: {}
    },
    getters: {
      isLogin() {
        return (
          !!localStorage.getItem("user") && !!localStorage.getItem("token")
        );
      }
    },
    mutations: {
      SET_USER(state, userInfo) {
        state.user = userInfo;
        localStorage.setItem("user", JSON.stringify(userInfo));
      }
    },
    actions: {}
  });

export default store;
