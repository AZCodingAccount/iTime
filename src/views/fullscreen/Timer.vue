<script setup>
import { IconFullscreenExit } from "@arco-design/web-vue/es/icon";
import { ref, computed, onMounted, onUnmounted, h } from "vue";
import { useRouter } from "vue-router";
import { Message } from "@arco-design/web-vue";
import { useCustomSettingsStore } from "@/stores/CustomSettings";
import { useHasVisitedBeforeStore } from "@/stores/HasVisitedBefore";
const hasVisitedBeforeStore = useHasVisitedBeforeStore();
const isFirst = computed({
  get: () => hasVisitedBeforeStore.fullScreenTimer,
  set: (newValue) => (hasVisitedBeforeStore.fullScreenTimer = newValue),
}); // 记录是否访问过这个页面

const currentPath = window.electron.getAppPath(); // 当前应用的工作路径
const backgroundImage = ref(""); // 背景图

const customSettingsStore = useCustomSettingsStore();
backgroundImage.value = customSettingsStore.customSettings["f-pomodoro-bgi"];

const isRunning = ref(false); // 是否正在运行——控制按钮显隐
const percent = ref(0); // 定义进度条
const originTime = ref(0); // 记录选择的时间
const isBegin = ref(false); // 定义是否开始
const inputTime = ref(0); // 输入的时间
const totalTime = ref(0); // 计算成的秒数
let intervalId = null; // 定时器id
let halfFirst = true; // 标记提醒的是不是第一次half

// 同步输入框和定时器的时间
const handleChange = () => {
  totalTime.value = inputTime.value * 60;
};

// 计算分值
const minutes = computed(() =>
  Math.floor(totalTime.value / 60)
    .toString()
    .padStart(2, "0")
);
// 计算秒
const seconds = computed(() =>
  (totalTime.value % 60).toString().padStart(2, "0")
);

// 播放器对象
const audioFullTimePlayer = ref(null);
const audioHalfTimePlayer = ref(null);
const role = computed(
  () => customSettingsStore.customSettings.voice.timerV ?? "default"
); // 当前角色
const isClosed = computed(
  () => customSettingsStore.customSettings.voice.isClosedV ?? "false"
); //是否关闭(使用计算属性保持响应性)

// 开启定时器
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
        if (percent.value == 0.5 && halfFirst == true) {
          halfFirst = false;
          !isClosed.value && audioHalfTimePlayer.value.play();
          window.electron.notificationUser("timer-half");
        }
      } else {
        // 时间结束，做最后的工作
        clearInterval(intervalId);
        !isClosed.value && audioFullTimePlayer.value.play();
        window.electron.notificationUser("timer-full");
        // 恢复到之前的状态
        isBegin.value = false;
        isRunning.value = false;
        // 把上一次设置的值同步给计数器
        handleChange();
      }
    }, 1000);
  }
};

// 暂停定时器
const pauseTimer = () => {
  clearInterval(intervalId);
  intervalId = null;
  isRunning.value = false;
};

// 应用的初始化工作
onMounted(() => {
  // 可以在这里设置开始的默认状态
  window.addEventListener("keydown", handleKeyDown);
  if (isFirst.value) {
    Message.info({
      content: "按F键即可退出全屏😊",
      icon: () => h(IconFullscreenExit),
    });
    hasVisitedBeforeStore.fullScreenTimer = false;
  }
});

// 应用结束的收尾工作
onUnmounted(() => {
  clearInterval(intervalId);
  window.removeEventListener("keydown", handleKeyDown);
});
const router = useRouter();
// 键盘监听——重置定时器、退出窗口
const handleKeyDown = (e) => {
  if (e.key === "r") {
    // r reset
    // 恢复定时器初始状态
    clearInterval(intervalId);
    intervalId = null;
    inputTime.value = originTime.value / 60;
    totalTime.value = originTime.value;
    isRunning.value = false;
    percent.value = 0;
    isBegin.value = false;
  } else if (e.key === "f") {
    // 先关闭窗口，再跳
    window.electron.removeWindow();
    // 执行跳转逻辑，再跳回去，关闭全屏窗口
    router.push("/countdown");
  }
};
// 双击事件—退出窗口
const handleDBLClick = (event) => {
  // 双击定时器部分不应该有响应
  if (event.target.closest(".timer")) {
    return;
  }
  window.electron.removeWindow();
  router.push("/countdown");
};
</script>
<template>
  <div
    class="main"
    @dblclick="handleDBLClick"
    :style="{ backgroundImage: `url(${backgroundImage})` }"
  >
    <div class="timer">
      <!-- 输入框 -->
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
      />
      <!-- 进度条 -->
      <a-progress
        status="warning"
        :percent="percent"
        type="circle"
        size="small"
        color="rgb(12, 228, 140)"
        v-else
      />
      <!-- 时间展示 -->
      <div class="timer-display">{{ minutes }}:{{ seconds }}</div>
      <!-- 操作按钮 -->
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
    <!-- 播放音频 |时间过半|时间到|-->
    <audio
      ref="audioHalfTimePlayer"
      :src="`${currentPath}/assets/voices/timer/${role}/halfTime.wav`"
    ></audio>
    <audio
      ref="audioFullTimePlayer"
      :src="`${currentPath}/assets/voices/timer/${role}/fullTime.wav`"
    ></audio>
  </div>
</template>

<style scoped>
/* 整个界面 */
.main {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: row;
  width: 100%;
  height: 100%;
  text-align: center;
  font-family: "sans-serif";
  color: white;
  font-weight: 700;
  background-size: cover; /* 覆盖整个容器 */
  background-repeat: no-repeat; /* 不重复 */
  background-position: center center; /* 图像居中显示 */
}
/* 定时器 */
.timer {
  display: flex;
  margin-top: 10%;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  width: 320px;
  height: 80px;
  border: 2px solid white;
  border-radius: 10px;
  padding: 0 15px;
}
/* 字体 */

.timer-display {
  font-size: 3em;
}

/* 按钮 */
button {
  cursor: pointer;
}
/* 自定义字体颜色 */
>>> .arco-progress-circle-text {
  color: white;
}
</style>
