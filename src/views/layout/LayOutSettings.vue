<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
// 高亮导航栏
const currentRouteKey = computed(() => route.path);
</script>

<template>
  <div class="menu">
    <!-- 导航栏 -->
    <a-menu mode="horizontal" :selectedKeys="[currentRouteKey]">
      <router-link to="/settings/global">
        <a-menu-item key="/settings/global">全局设置</a-menu-item>
      </router-link>
      <router-link to="/settings/todo">
        <a-menu-item key="/settings/todo">待办</a-menu-item>
      </router-link>
      <router-link to="/settings/clock">
        <a-menu-item key="/settings/clock">时钟</a-menu-item>
      </router-link>
      <router-link to="/settings/appearance">
        <a-menu-item key="/settings/appearance">外观设置</a-menu-item>
      </router-link>
    </a-menu>
    <!-- 内容 -->
    <router-view></router-view>
  </div>
</template>
<style scoped>
.menu {
  height: 100%;
}
</style>
