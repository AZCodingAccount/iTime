<script setup>
import { ref, watchEffect, watch, computed } from "vue";
import { useCustomSettingsStore } from "./stores/CustomSettings";
import { onMounted } from "vue";
const customSettingsStore = useCustomSettingsStore();
/*  在这里定义一些全局样式
const todoIcons = ref(customSettingsStore.customSettings["todo-icons"]);

// 使用 watchEffect 来响应式地更新 CSS 变量
watchEffect(() => {
  console.log(111);
  console.log(todoIcons.value.olIcon);
  // 通过js操作元素样式
  if (todoIcons.value.olIcon !== "1." && todoIcons.value.olIcon.trim() !== "") {
    // 设置全局变量
    const style = document.createElement("style");
    style.id = "custom-ol-style"; // 为 <style> 元素设置一个唯一的 id
    style.innerHTML = `.ql-container ol > li::before,.card ol>li::marker { content: "${todoIcons.value.olIcon}" !important; }`;
    document.head.appendChild(style);
    console.log("所有样式添加成功~~~");
  } else {
    const styleElement = document.getElementById("custom-ol-style"); // 通过 id 选中 <style> 元素
    if (styleElement) {
      styleElement.parentNode.removeChild(styleElement); // 从其父元素中移除
    }
    console.log("样式添加失败");
  }

  // 设置自定义样式变量
  document.documentElement.style.setProperty(
    "--ulIcon",
    `"${todoIcons.value.ulIcon}"`
  );
});

// 获取元素的属性值看一下
const ulIconValue = getComputedStyle(document.documentElement)
  .getPropertyValue("--ulIcon")
  .trim();
console.log(ulIconValue); // 输出 --ulIcon 的当前值

console.log("设置成功~~~~", todoIcons.value);
*/
// 同步配置信息
const customSettings = ref(customSettingsStore.customSettings);
console.log(customSettings.value.shortcutKeys);
// 刚进来时候注册一次快捷键
const customSettingsForIpc = JSON.parse(
  JSON.stringify(customSettings.value.shortcutKeys)
);
const test = async () => {
  const res = await window.electron.shortcutSetting(customSettingsForIpc);
  console.log(res);
};
test()
// 立即生效是比较麻烦的，但是用户体验大于一切，快捷键设置因为需要双向通信，就直接在组件中设置了
watch(
  [customSettings.value.position, customSettings.value.voice],
  (oldV, newV) => {
    const customSettingsForIpc = JSON.parse(JSON.stringify(oldV));
    // 需要更新全局配置
    window.electron.syncElseSetting(customSettingsForIpc);
  },
  { immediate: true }
  // { deep: true }
);
// 注意不要传递代理对象，不能被序列化
// watchEffect(() => {
//   console.log(111);
//   const customSettingsForIpc = JSON.parse(JSON.stringify(customSettings.value));

//   window.electron.syncSetting(customSettingsForIpc);
// });
</script>

<template>
  <router-view></router-view>
</template>

<style scoped></style>
