import "@fortawesome/fontawesome-free/css/all.css";
import "@fortawesome/fontawesome-free/js/all.js";

import Vue from "vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "./components/element-ui-extend";
import "./components/z-md-editor";
import "./components/z-upload-picker";
import store from "./store";
import router from "./router";

import App from "./app.vue";

Vue.use(ElementUI);

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount("#app");
