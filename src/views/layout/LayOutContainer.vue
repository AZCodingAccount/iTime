<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
// 适配二级高亮导航栏
const currentRouteKey = computed(() => {
  if (route.path.startsWith("/settings")) {
    return "/settings";
  }
  return route.path;
});
</script>
<template>
  <div class="common-layout">
    <a-layout>
      <a-layout-sider>
        <a-layout>
          <a-layout-header class="header">
            ✔easyToDo 简单的待办清单
          </a-layout-header>
          <a-layout-content
            ><a-menu :selectedKeys="[currentRouteKey]">
              <router-link to="/today">
                <a-menu-item key="/today"> 标准待办 </a-menu-item>
              </router-link>
              <router-link to="/categories">
                <a-menu-item key="/categories"> 自定义待办 </a-menu-item>
              </router-link>
              <router-link to="/add/customtodo">
                <a-menu-item key="/add/customtodo">
                  添加自定义待办
                </a-menu-item>
              </router-link>
              <a-divider margin="10px" />
              <router-link to="/countdown">
                <a-menu-item key="/countdown"> 倒计时 </a-menu-item>
              </router-link>
              <router-link to="/pomodoro">
                <a-menu-item key="/pomodoro"> 番茄钟 </a-menu-item>
              </router-link>
              <a-divider margin="10px" />
              <router-link to="/settings">
                <a-menu-item key="/settings"> 自定义设置 </a-menu-item>
              </router-link>
              <router-link to="/about">
                <a-menu-item key="/about"> 关于 </a-menu-item>
              </router-link>
            </a-menu></a-layout-content
          >
        </a-layout>
      </a-layout-sider>
      <a-layout-content class="content">
        <router-view></router-view>
      </a-layout-content>
    </a-layout>
  </div>
</template>
<style scoped>
/* 定义头部字体样式 */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 1.5em;
  color: #333;
  font-weight: bold;
  font-size: 0.8em;
  font-family: "Kaiti", "Kaiti SC", "SimKai", "楷体", serif;
}
.content {
  margin-top: 1.5em;
}
.common-layout {
  height: 100vh;
  /* background-color: pink; */
}
/* 隐藏溢出的东西 */
.common-layout :deep(.arco-layout-sider-children) {
  overflow: hidden;
}
.common-layout :deep(.arco-layout) {
  height: 100%;
}
</style>
