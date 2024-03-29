<script setup>
import { ref, computed, onMounted, onUnmounted, h } from "vue";
import { useCustomSettingsStore } from "@/stores/CustomSettings";
import { IconFullscreenExit } from "@arco-design/web-vue/es/icon";
import { Message } from "@arco-design/web-vue";
import { useHasVisitedBeforeStore } from "@/stores/HasVisitedBefore";
const hasVisitedBeforeStore = useHasVisitedBeforeStore();
const isFirst = computed({
  get: () => hasVisitedBeforeStore.fullScreenPomodoro,
  set: (newValue) => (hasVisitedBeforeStore.fullScreenPomodoro = newValue),
});
const currentPath = window.electron.getAppPath(); // 当前应用的工作路径


const isRunning = ref(false); // 控制按钮显示隐藏
let totalTime = ref(0); // 计算成的秒数
const isStart = ref(true); // 是不是第一次启动定时器
let intervalId = null;  // 定时器id
let isEnding = ref(false); // 定义结束按钮是否显示隐藏
const backgroundImage = ref("");  // 背景图url
// 计算分钟
const minutes = computed(() =>
  Math.floor(totalTime.value / 60)
    .toString()
    .padStart(2, "0")
);
// 计算秒
const seconds = computed(() =>
  (totalTime.value % 60).toString().padStart(2, "0")
);
const hintText = ref("待开始"); // 上方提示文字
// 读取番茄钟配置
const customSettingsStore = useCustomSettingsStore();

const { duration, shortBreakDuration, longBreakDuration, longBreakInterval } =
  customSettingsStore.customSettings["pomodoroSettings"]; // 解构出来
let step = ref(1); // 记录当前在第几轮
// 播放器对象
const audioShortBreakPlayer = ref(null);
const audioLongBreakPlayer = ref(null);
const audioFocusPlayer = ref(null);
const role = computed(
  () => customSettingsStore.customSettings.voice.pomodoroV ?? "default"
); // 当前角色
const isClosed = computed(
  () => customSettingsStore.customSettings.voice.isClosedV ?? "false"
); //是否关闭(使用计算属性保持响应性)
// 开启定时器
const startTimer = () => {
  !isEnding.value && (isEnding.value = true);
  if (isStart.value) {
    // 第一次进来，就更新
    if (hintText.value === "待开始" || hintText.value === "专注中") {
      totalTime.value = duration * 60;
    } else if (hintText.value === "短休息") {
      totalTime.value = shortBreakDuration * 60; // 短休息
    } else if (hintText.value === "长休息") {
      totalTime.value = longBreakDuration * 60; // 长休息
    }
  }
  if (hintText.value === "待开始") {
    hintText.value = "专注中";
  }

  // 当前没有定时器在运行
  if (intervalId === null) {
    isRunning.value = true;
    // 开启定时器
    intervalId = setInterval(() => {
      if (totalTime.value > 0) {
        totalTime.value--;
      } else {
        // 时间结束，做最后的工作
        // 清除定时器
        clearInterval(intervalId);
        intervalId = null;

       
        // 更新提示文字并播放音乐
        if (hintText.value === "专注中" && step.value !== longBreakInterval) {
          !isClosed.value && audioShortBreakPlayer.value.play();
          window.electron.notificationUser("pomodoro-shortBreak")
          hintText.value = "短休息";
        } else if (
          hintText.value === "专注中" &&
          step.value === longBreakInterval
        ) {
          !isClosed.value && audioLongBreakPlayer.value.play();
          window.electron.notificationUser("pomodoro-longBreak")
          hintText.value = "长休息";
        } else if (hintText.value === "短休息" || hintText.value === "长休息") {
          !isClosed.value && audioFocusPlayer.value.play();
          window.electron.notificationUser("pomodoro-work")
          // 一个休息以后是一轮
          step.value === longBreakInterval
            ? (step.value = 1)
            : (step.value = step.value + 1);
          hintText.value = "专注中";
        } // 修改上方提示文字
        isStart.value = true; // 标记下次再开启定时器是第一次开启
        startTimer(); //继续计时
      }
    }, 1000);
  }
};

// 暂停定时器
const pauseTimer = () => {
  clearInterval(intervalId);
  intervalId = null;
  isRunning.value = false;
  isStart.value = false; // 标记暂停过
};
// 终止定时器
const endTimer = () => {
  // 清除定时器
  clearInterval(intervalId);
  intervalId = null;
  // 修改页面状态
  isStart.value = true;
  hintText.value = "待开始";
  isRunning.value = false;
  totalTime.value = 0;
  isEnding.value = false;
  step.value = 1;
};
// 应用初始化
onMounted(() => {
  backgroundImage.value = customSettingsStore.customSettings["f-pomodoro-bgi"];
  if (isFirst.value) {
    Message.info({
      content: "按F键即可退出全屏😊",
      icon: () => h(IconFullscreenExit),
    });
    isFirst.value = false;
  }
  window.addEventListener("keydown", handleKeyDown);
});

// 应用结束的收尾工作
onUnmounted(() => {
  clearInterval(intervalId);
  window.removeEventListener("keydown", handleKeyDown);
});
// 快捷键退出窗口
const handleKeyDown = (e) => {
  if (e.key === "f") {
    // 关闭窗口并跳转
    window.electron.removeWindow();
    router.push("/pomodoro");
  }
};
// 双击事件退出窗口
const handleDBLClick = (event) => {
  // 双击定时器部分不应该有响应
  if (event.target.closest(".pomodoro-timer")) {
    return;
  }
  // 关闭窗口并跳转
  window.electron.removeWindow();
  router.push("/pomodoro");
};
</script>
<template>
  <div
    class="main"
    :style="{ backgroundImage: `url(${backgroundImage})` }"
    @dblclick="handleDBLClick"
  >
    <div class="pomodoro-timer">
      <!-- 上方提示文字 （专注中、短休息、长休息）-->
      <div class="hint">
        {{ hintText }}
      </div>
      <!-- 下方展示计时器 -->
      <div class="bottom">
        <!-- 轮数 -->
        <div class="step">
          {{ step }}
        </div>
        <!-- 时间 -->
        <div class="timer-display">{{ minutes }}:{{ seconds }}</div>
        <!-- 开始暂停按钮 -->
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
            ><icon-play-arrow size="1.5em"
          /></a-button>
          <a-button
            @click="pauseTimer"
            v-if="isRunning"
            shape="circle"
            style="
              width: 44px;
              height: 44px;
              color: white;
              background-color: transparent;
              border: 2px solid white;
            "
            ><icon-pause size="1.5em"
          /></a-button>
          <a-button
            @click="endTimer"
            v-if="isEnding"
            shape="circle"
            style="
              width: 44px;
              height: 44px;
              color: white;
              background-color: transparent;
              border: 2px solid white;
              margin-left: 10px;
            "
            ><svg
              t="1706081169498"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="7401"
              width="1.5em"
              height="1.5em"
            >
              <path
                d="M192 128a64 64 0 0 0-64 64v640a64 64 0 0 0 64 64h640a64 64 0 0 0 64-64V192a64 64 0 0 0-64-64H192z m0-64h640a128 128 0 0 1 128 128v640a128 128 0 0 1-128 128H192a128 128 0 0 1-128-128V192a128 128 0 0 1 128-128z"
                fill="#ffffff"
                p-id="7402"
              ></path></svg
          ></a-button>
        </div>
      </div>
    </div>
    <!-- 播放音频 ：|轮到短休息|轮到长休息|轮到专注|-->
    <audio
      ref="audioShortBreakPlayer"
      :src="`${currentPath}/assets/voices/pomodoro/${role}/shortBreak.wav`"
    ></audio>
    <audio
      ref="audioLongBreakPlayer"
      :src="`${currentPath}/assets/voices/pomodoro/${role}/longBreak.wav`"
    ></audio>
    <audio
      ref="audioFocusPlayer"
      :src="`${currentPath}/assets/voices/pomodoro/${role}/focus.wav`"
    ></audio>
  </div>
</template>

<style scoped>
/* 定义主界面 */
.main {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: row;
  width: 100%;
  height: 100%;
  text-align: center;
  font-family:  "sans-serif";
  color: white;
  font-weight: 700;
  background-size: cover; /* 覆盖整个容器 */
  background-repeat: no-repeat; /* 不重复 */
  background-position: center center; /* 图像居中显示 */
}
/* 定义定时器盒子样式 */
.pomodoro-timer {
  margin-top: 10%;
  width: 340px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  border: 2px solid white;
  border-radius: 10px;
  padding: 0 15px;
}

/* 定义下方样式 */
.bottom {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  width: 340px;
  height: 70px;
  padding: 0 15px;
}
/* 定时器和轮数字体 */
.timer-display,
.step {
  font-size: 3em;
}
.timer-display {
  text-align: center;
  padding-right: 40px;
}
.step {
  flex: 1;
  text-align: left;
}
/* 按钮样式 */
.button {
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  cursor: pointer;
  margin-left: auto;
}
/* 提示样式 */
.hint {
  font-size: 1.5em;
  margin: 10px 0px 0px;
  text-align: center;
  padding-right: 40px;
}
/* 自定义字体颜色 */
>>> .arco-progress-circle-text {
  color: white;
}
</style>
