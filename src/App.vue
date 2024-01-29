<script setup>
import { ref, watchEffect, watch, computed } from "vue";
import { useCustomSettingsStore } from "./stores/CustomSettings";
import { useToDoStore } from "./stores/ToDo";
import { onUnmounted, onMounted } from "vue";
const customSettingsStore = useCustomSettingsStore();
const todoStore = useToDoStore();
// 在这里定义一些全局样式;
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

// 同步配置信息
const customSettings = ref(customSettingsStore.customSettings);
// 刚进来时候注册一次快捷键
const customSettingsForIpc = JSON.parse(
  JSON.stringify(customSettings.value.shortcutKeys)
);
window.electron.shortcutSetting(customSettingsForIpc);
// 立即生效是比较麻烦的，但是用户体验大于一切，快捷键设置因为需要双向通信，就直接在组件中设置了
// 注意不要传递代理对象，不能被序列化
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
// 设置提示信息
const intervalIds = []; // 用于存储所有定时器的ID，以便稍后清理

// 如果todoList发生改变了，更新forEach
const todoList = ref(todoStore.todoList);
const watchToDos = (todoList) => {
  // 清除之前的定时器
  intervalIds.forEach(clearInterval);
  intervalIds.value = [];
  // 挨个注册定时器
  todoList.forEach((todo) => {
    const remindTime = ref(todo.remindTime); // 用户选择的时间（ISO 8601格式）
    const music = new Audio(
      `/voices/todos/${customSettings.value?.voice?.todoV}/remind.wav`
    ); // 音乐文件

    // 播放音乐
    const playMusic = () => {
      !customSettings.value?.voice?.isClosedV && music.play();
    };
    console.log("注册待办", todo);

    // 定期检查当前时间是否接近用户设置的时间
    const intervalId = setInterval(() => {
      const currentTime = new Date(); // 当前时间
      const targetTime = new Date(remindTime.value); // 将用户设置的时间转换为Date对象
      console.log(currentTime, targetTime);

      // 检查当前时间是否在目标时间前后一分钟内
      if (Math.abs(currentTime - targetTime) < 60000) {
        playMusic();
        clearInterval(intervalId);
      }
    }, 1000 * 60); // 每1分钟检查一次
    intervalIds.value.push(intervalId);
  });
};
// 进来先注册一次
watchToDos(todoList.value);
// 使用watch来侦听todoList的变化，并重新设置定时器
watch(
  todoList,
  (newTodoList) => {
    watchToDos(newTodoList);
  },
  {
    deep: true, // 监听内部值
  }
);
// 清理所有定时器
onUnmounted(() => {
  intervalIds.forEach(clearInterval);
});
</script>

<template>
  <router-view></router-view>
</template>

<style scoped></style>
