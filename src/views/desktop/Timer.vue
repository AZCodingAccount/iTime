<script setup>
import { Message } from "@arco-design/web-vue";
import { ref, computed, onMounted, onUnmounted, h } from "vue";
import { IconFullscreenExit } from "@arco-design/web-vue/es/icon";

const isRunning = ref(false);
const percent = ref(0); // 定义进度条
const originTime = ref(0); // 记录选择的时间
const isBegin = ref(false); // 定义是否开始
const inputTime = ref(0); // 输入的时间
const totalTime = ref(0); // 计算成的秒数
let intervalId = null;
const handleChange = () => {
  totalTime.value = inputTime.value * 60;
};

const minutes = computed(() =>
  Math.floor(totalTime.value / 60)
    .toString()
    .padStart(2, "0")
);
const seconds = computed(() =>
  (totalTime.value % 60).toString().padStart(2, "0")
);

const startTimer = () => {
  // 首先把数字输入框隐藏，显示进度条
  isBegin.value = true;
  originTime.value === 0 && (originTime.value = totalTime.value); // 只有第一次进来时候才同步时间，用于进度条的计算
  // 当前没有定时器在运行，第二个条件是为了重新开始，并清空定时器
  if (intervalId === null || originTime.value === totalTime.value) {
    isRunning.value = true;
    // 判断是不是第一次开始，是就清空进度条
    if (originTime.value === totalTime.value) {
      percent.value = 0;
    }
    // 开启定时器
    intervalId = setInterval(() => {
      if (totalTime.value > 0) {
        totalTime.value--;
        percent.value = Number(
          (1 - totalTime.value / originTime.value).toFixed(2)
        ); //更新进度条
      } else {
        // 时间结束，做最后的工作
        clearInterval(intervalId);
        // TODO：调用原生弹窗给用户提示
        alert("时间到！");
        // 恢复到之前的状态
        isBegin.value = false;
        isRunning.value = false;
        // 把上一次设置的值同步给计数器
        handleChange();
      }
    }, 1000);
  }
};

const pauseTimer = () => {
  clearInterval(intervalId);
  intervalId = null;
  isRunning.value = false;
};

onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);

  Message.info({
    position: "top",
    content: "按E键即可清除挂件😊",
    icon: () => h(IconFullscreenExit),
  });
});

onUnmounted(() => {
  clearInterval(intervalId);
  window.removeEventListener("keydown", handleKeyDown);
});

// 添加监听事件
const handleKeyDown = (e) => {
  if (e.key === "r") {
    // r reset
    // 恢复定时器初始状态
    clearInterval(intervalId);
    intervalId = null;
    totalTime.value = 0;
    inputTime.value = originTime.value;
    originTime.value = 0;
    isRunning.value = false;
    percent.value = 0;
  } else if (e.key === "e") {
    // exit，退出
    window.electron.removeWindow();
  }
};
</script>
<template>
  <div class="pomodoro-timer">
    <!-- 输入框 -->
    <!-- 这个输入框是真的丑，但是我找了15分钟也没找到怎么修改灰色背景，就这样吧唉 -->
    <a-input-number
      v-model="inputTime"
      :style="{ width: '125px' }"
      mode="button"
      size="large"
      :default-value="24"
      :min="0.1"
      :max="999"
      v-if="!isBegin"
      @change="handleChange"
      style="-webkit-app-region: no-drag"
    />
    <!-- 进度条 -->
    <!-- :show-text="false" -->
    <a-progress
      status="warning"
      :percent="percent"
      type="circle"
      size="small"
      color="rgb(12, 228, 140)"
      v-else
    />
    <div class="timer-display">{{ minutes }}:{{ seconds }}</div>
    <div class="button">
      <a-button
        v-if="!isRunning"
        @click="startTimer"
        shape="circle"
        style="
          width: 44px;
          height: 44px;
          color: white;
          background-color: transparent;
          border: 2px solid white;
        "
        ><icon-play-arrow
      /></a-button>
      <a-button
        v-else
        @click="pauseTimer"
        shape="circle"
        style="
          width: 44px;
          height: 44px;
          color: white;
          background-color: transparent;
          border: 2px solid white;
        "
        ><icon-pause
      /></a-button>
    </div>
  </div>
</template>

<style scoped>
/* 在CSS文件中使用@import引入Roboto字体 */
@import url("https://fonts.googleapis.com/css?family=Roboto&display=swap");
.pomodoro-timer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  width: 320px;
  height: 80px;
  /* border: 2px solid black; */
  background-color: rgba(23, 31, 29, 0.4);
  border-radius: 10px;
  padding: 0 15px;
  -webkit-app-region: drag;
}

.timer-display {
  font-size: 3em;
  color: white;
}

button {
  cursor: pointer;
  -webkit-app-region: no-drag;
}
/* 自定义字体颜色 */
>>> .arco-progress-circle-text {
  color: white;
}
</style>
