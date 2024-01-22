import "./assets/main.css";

import { createApp } from "vue";
// 引入vue-router和pinia
import router from "./router";
import { createPinia } from "pinia";
import App from "./App.vue";
// import { create, NButton } from "naive-ui"; // 按需引入
const app = createApp(App);

// const naive = create({
//   components: [NButton],
// });

// 引入并挂在
app.
   use(createPinia())
  // .use(naive)
  .use(router)
  .mount("#app");

