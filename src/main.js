import "./assets/main.css";

import { createApp } from "vue";
// 引入vue-router和pinia
import router from "./router";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate"; // 持久化插件

import App from "./App.vue";
// import { create, NButton } from "naive-ui"; // 按需引入

import { Message } from '@arco-design/web-vue';
import '@arco-design/web-vue/dist/arco.css';


const app = createApp(App);
Message._context = app._context; // 引入message


// const naive = create({
//   components: [NButton],
// });

// 引入并挂在
app
  .use(createPinia().use(piniaPluginPersistedstate))
  // .use(naive)
  .use(router)
  .mount("#app");
