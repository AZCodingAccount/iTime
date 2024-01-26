import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      // 软件主界面
      path: "/",
      component: () => import("@/views/layout/LayOutContainer.vue"), // 使用箭头函数可以懒加载
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
        {
          path: "/settings",
          redirect: "/settings/global",
          component: () => import("@/views/layout/LayOutSettings.vue"),
          children: [
            {
              path: "/settings/global",
              component: () => import("@/views/settings/GlobalSettings.vue"),
            },
            {
              path: "/settings/todo",
              component: () => import("@/views/settings/ToDoSettings.vue"),
            },
            {
              path: "/settings/clock",
              component: () => import("@/views/settings/ClockSettings.vue"),
            },
            {
              path: "/settings/appearance",
              component: () =>
                import("@/views/settings/AppearanceSettings.vue"),
            },
          ],
        },
        { path: "/about", component: () => import("@/views/AboutAuthor.vue") },
        {
          path: "/countdown",
          component: () => import("@/views/CountDown.vue"),
        },
        { path: "/pomodoro", component: () => import("@/views/Pomodoro.vue") },
      ],
      // 待办界面（悬浮在桌面的）
    },
    { path: "/todo", component: () => import("@/views/ToDo.vue") },
    // 下面是桌面用的三个路径
    {
      path: "/desktop/customtodo",
      component: () => import("@/views/desktop/CustomToDo.vue"),
    },
    {
      path: "/desktop/timer",
      component: () => import("@/views/desktop/Timer.vue"),
    },
    {
      path: "/desktop/pomodoro",
      component: () => import("@/views/desktop/Pomodoro.vue"),
    },
    // 全屏跳转的路径
    {
      path: "/fullscreen/countdown",
      component: () => import("@/views/fullscreen/CountDown.vue"),
    },
    {
      path: "/fullscreen/pomodoro",
      component: () => import("@/views/fullscreen/Pomodoro.vue"),
    },
  ],
});

export default router;
