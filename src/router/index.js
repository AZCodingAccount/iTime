import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      // 软件主界面
      path: "/",
      component: () => import("@/views/layout/LayOutContainer.vue"), // 使用箭头函数可以懒加载
      redirect: "/plain/todo",
      children: [
        { path: "/plain/todo", component: () => import("@/views/pc/PlainToDo.vue") },
        {
          path: "/add/customtodo",
          component: () => import("@/views/pc/AddCustomToDo.vue"),
        },
        {
          path: "/custom/todo",
          component: () => import("@/views/pc/CustomToDo.vue"),
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
        { path: "/about", component: () => import("@/views/pc/About.vue") },
        {
          path: "/timer",
          component: () => import("@/views/pc/Timer.vue"),
        },
        { path: "/pomodoro", component: () => import("@/views/pc/Pomodoro.vue") },
      ],
    },
    // 桌面用的三个路径
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
      path: "/fullscreen/timer",
      component: () => import("@/views/fullscreen/Timer.vue"),
    },
    {
      path: "/fullscreen/pomodoro",
      component: () => import("@/views/fullscreen/Pomodoro.vue"),
    },
  ],
});

export default router;
