import "./assets/main.css";
import { createApp } from "vue";
import App from "./App.vue";
// 引入vue-router和pinia
import router from "./router";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate"; // 持久化插件
// 引入图标
import ArcoVueIcon from "@arco-design/web-vue/es/icon";
import "@arco-design/web-vue/dist/arco.css";

const app = createApp(App);
app.use(ArcoVueIcon);

// 引入并挂载
app.use(createPinia().use(piniaPluginPersistedstate)).use(router).mount("#app");
