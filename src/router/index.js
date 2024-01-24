import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      // 软件主界面
      path: "/",
      component: () => import("@/views/LayOutContainer.vue"), // 使用箭头函数可以懒加载
      redirect: "/today",
      children: [
        { path: "/today", component: () => import("@/views/TodayToDo.vue") },
        {
          path: "/add/customtodo",
          component: () => import("@/views/AddCustomToDo.vue"),
        },
        {
          path: "/categories",
          component: () => import("@/views/MyCategory.vue"),
        },
        { path: "/settings", component: () => import("@/views/Settings.vue") },
        { path: "/about", component: () => import("@/views/AboutAuthor.vue") },
        {
          path: "/countdown",
          component: () => import("@/views/CountDown.vue"),
        },
      ],
      // 待办界面（悬浮在桌面的）
    },
    { path: "/todo", component: () => import("@/views/ToDo.vue") },
    { path: "/pomodoro", component: () => import("@/views/Pomodoro.vue") },
  ],
});

export default router;
