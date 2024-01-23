<script setup></script>
<template>
  <div class="common-layout">
    <a-layout>
      <a-layout-header class="header"
        >✔easyToDo 简单的待办清单
        <div class="search">
          <a-input-search
            :style="{ width: '320px' }"
            placeholder="搜索待办内容（Ctrl+Fn+F）"
          />
        </div>
      </a-layout-header>
      <a-layout>
        <a-layout-sider>
          <a-menu :default-selected-keys="['1']">
            <router-link to="/today">
              <a-menu-item key="1"> 所有待办 </a-menu-item>
            </router-link>
            <router-link to="/categories">
              <a-menu-item key="2"> 自定义待办 </a-menu-item>
            </router-link>
            <router-link to="/add/customtodo">
              <a-menu-item key="3"> 添加自定义待办 </a-menu-item>
            </router-link>
            <router-link to="/pomodoro">
              <a-menu-item key="4"> 番茄钟 </a-menu-item>
            </router-link>
            <router-link to="/settings">
              <a-menu-item key="5"> 自定义设置 </a-menu-item>
            </router-link>
            <router-link to="/about">
              <a-menu-item key="6"> 关于作者 </a-menu-item>
            </router-link>
          </a-menu></a-layout-sider
        >
        <a-layout-content> <router-view></router-view> </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>
<style scoped>
/* 定义头部字体样式 */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 20px;
  color: #333;
  font-weight: bold;
  font-size: 12px;
  font-family: "Kaiti", "Kaiti SC", "SimKai", "楷体", serif;
}
.search {
  margin: 0 auto;
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
